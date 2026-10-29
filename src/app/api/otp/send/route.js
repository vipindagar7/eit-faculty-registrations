import { getDb } from "@/lib/mongodb";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import { sendOtpSms } from "@/lib/sms";
import { isValidPhone, normalizePhone } from "@/lib/validation";
import { fail, getClientIp, json, readBody } from "@/lib/http";
import { OTP_RESEND_SECONDS } from "@/lib/constants";

const MAX_PER_MOBILE_PER_HOUR = 5;
const MAX_PER_IP_PER_HOUR = 20;

export async function POST(request) {
  const body = await readBody(request);
  const mobile = normalizePhone(body?.mobile);
  if (!isValidPhone(mobile)) return fail("Enter a valid 10-digit Indian mobile number");

  try {
    const db = await getDb();
    const ip = getClientIp(request);

    // Block OTP for numbers that are already registered (as mobile or WhatsApp).
    const exists = await db.collection("registrations").findOne({ phones: mobile }, { projection: { _id: 1 } });
    if (exists) return fail("This mobile number is already registered", 409, { field: "mobile" });

    // Cooldown between sends.
    const current = await db.collection("otps").findOne({ mobile });
    if (current?.lastSentAt) {
      const wait = OTP_RESEND_SECONDS - Math.floor((Date.now() - current.lastSentAt.getTime()) / 1000);
      if (wait > 0) return fail(`Please wait ${wait}s before requesting a new OTP`, 429, { retryAfter: wait });
    }

    // Hourly limits.
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [byMobile, byIp] = await Promise.all([
      db.collection("otp_requests").countDocuments({ mobile, createdAt: { $gte: hourAgo } }),
      db.collection("otp_requests").countDocuments({ ip, createdAt: { $gte: hourAgo } }),
    ]);
    if (byMobile >= MAX_PER_MOBILE_PER_HOUR || byIp >= MAX_PER_IP_PER_HOUR) {
      return fail("Too many OTP requests. Please try again after some time.", 429);
    }

    const otp = generateOtp();
    const now = new Date();
    await db.collection("otps").updateOne(
      { mobile },
      {
        $set: {
          hash: hashOtp(mobile, otp),
          attempts: 0,
          lastSentAt: now,
          expiresAt: new Date(now.getTime() + OTP_TTL_MS),
        },
      },
      { upsert: true }
    );
    await db.collection("otp_requests").insertOne({ mobile, ip, createdAt: now });

    try {
      await sendOtpSms(mobile, otp, OTP_TTL_MS / 60000);
    } catch (err) {
      console.error("[otp/send] SMS failed:", err.message);
      await db.collection("otps").deleteOne({ mobile });
      return fail("Could not send OTP right now. Please try again.", 502);
    }

    const devOtp =
      process.env.NODE_ENV !== "production" && (process.env.SMS_PROVIDER || "console") === "console"
        ? otp
        : undefined;

    return json({ ok: true, message: "OTP sent successfully", resendIn: OTP_RESEND_SECONDS, devOtp });
  } catch (err) {
    console.error("[otp/send]", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}
