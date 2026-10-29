import "server-only";

/**
 * OTP sender.
 *
 * SMS_PROVIDER=saakshi → Saakshi Software bulk SMS gateway (production)
 * SMS_PROVIDER=console → logs the OTP to the server console (local testing only)
 */

// DLT-approved template — must match the registered template exactly (only {code} changes).
const otpMessage = (code) =>
  `Thank you for registering. Your OTP is ${code}. Echelon Institute of Technology! visit www.eitfaridabad.com or call +919999753763 for more updates..`;

async function sendViaSaakshi(phone, code) {
  const { SMS_USER, SMS_PASS, SENDER_ID } = process.env;
  if (!SMS_USER || !SMS_PASS || !SENDER_ID) {
    throw new Error("SMS_USER, SMS_PASS and SENDER_ID must be set");
  }

  const params = new URLSearchParams({
    user: SMS_USER,
    password: SMS_PASS,
    senderid: SENDER_ID,
    channel: "Trans",
    DCS: "0",
    flashsms: "0",
    number: `91${phone}`,
    text: otpMessage(code),
    route: "4",
  });

  const url = `${process.env.SMS_API_URL || "http://bulksms.saakshisoftware.in/api/mt/SendSMS"}?${params}`;
  const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15000) });
  const raw = await res.text();

  if (!res.ok) {
    console.error("[SMS] HTTP error", res.status, raw.slice(0, 300));
    throw new Error(`SMS gateway HTTP ${res.status}`);
  }

  // Gateway replies with JSON like {"ErrorCode":"000","ErrorMessage":"Success",...}
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    /* non-JSON response */
  }
  if (data && data.ErrorCode !== undefined && String(data.ErrorCode) !== "000" && String(data.ErrorCode) !== "0") {
    console.error("[SMS] Gateway rejected:", data);
    throw new Error(data.ErrorMessage || "SMS gateway rejected the request");
  }

  console.log("[SMS] sent to", `91${phone}`, data?.JobId ? `job ${data.JobId}` : "");
  return { ok: true };
}

export async function sendOtpSms(phone, code) {
  const provider = (process.env.SMS_PROVIDER || "console").toLowerCase();

  if (provider === "saakshi") return sendViaSaakshi(phone, code);

  if (provider === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMS_PROVIDER=console is not allowed in production");
    }
    console.log(`\n📱 [DEV OTP] ${phone} → ${code}\n`);
    return { ok: true };
  }

  throw new Error(`Unknown SMS_PROVIDER "${provider}"`);
}
