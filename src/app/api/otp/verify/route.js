import { getDb } from "@/lib/mongodb";
import { hashOtp, OTP_MAX_ATTEMPTS, safeEqual, signVerificationToken } from "@/lib/otp";
import { isValidPhone, normalizePhone } from "@/lib/validation";
import { fail, json, readBody } from "@/lib/http";
import { OTP_LENGTH } from "@/lib/constants";

export async function POST(request) {
  const body = await readBody(request);
  const mobile = normalizePhone(body?.mobile);
  const otp = String(body?.otp ?? "").replace(/\D/g, "");

  if (!isValidPhone(mobile)) return fail("Invalid mobile number");
  if (otp.length !== OTP_LENGTH) return fail(`Enter the ${OTP_LENGTH}-digit OTP`);

  try {
    const db = await getDb();
    const record = await db.collection("otps").findOne({ mobile });

    if (!record || record.expiresAt.getTime() < Date.now()) {
      return fail("OTP expired. Please request a new one.", 410);
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await db.collection("otps").deleteOne({ mobile });
      return fail("Too many wrong attempts. Please request a new OTP.", 429);
    }

    if (!safeEqual(record.hash, hashOtp(mobile, otp))) {
      const { attempts } = await db
        .collection("otps")
        .findOneAndUpdate({ mobile }, { $inc: { attempts: 1 } }, { returnDocument: "after" });
      const left = Math.max(OTP_MAX_ATTEMPTS - (attempts ?? OTP_MAX_ATTEMPTS), 0);
      return fail(
        left > 0 ? `Incorrect OTP. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong attempts. Request a new OTP.",
        400
      );
    }

    await db.collection("otps").deleteOne({ mobile });
    return json({ ok: true, message: "Mobile number verified", token: signVerificationToken(mobile) });
  } catch (err) {
    console.error("[otp/verify]", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}
