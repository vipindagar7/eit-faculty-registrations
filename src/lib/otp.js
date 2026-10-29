import "server-only";
import crypto from "node:crypto";
import { OTP_LENGTH } from "./constants";

const SECRET = () => {
  const s = process.env.OTP_SECRET;
  if (!s || s.length < 32) throw new Error("OTP_SECRET must be set (min 32 chars)");
  return s;
};

export const OTP_TTL_MS = 5 * 60 * 1000; // OTP valid for 5 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const VERIFY_TOKEN_TTL_MS = 30 * 60 * 1000; // verified mobile valid for 30 min to submit

export function generateOtp() {
  const max = 10 ** OTP_LENGTH;
  return String(crypto.randomInt(0, max)).padStart(OTP_LENGTH, "0");
}

export function hashOtp(mobile, otp) {
  return crypto.createHmac("sha256", SECRET()).update(`${mobile}:${otp}`).digest("hex");
}

export function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Signed token proving `mobile` passed OTP verification. */
export function signVerificationToken(mobile) {
  const payload = Buffer.from(
    JSON.stringify({ m: mobile, exp: Date.now() + VERIFY_TOKEN_TTL_MS })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET()).update(`vt.${payload}`).digest("base64url");
  return `${payload}.${sig}`;
}

export function readVerificationToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET()).update(`vt.${payload}`).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data?.m || Date.now() > data.exp) return null;
    return data.m;
  } catch {
    return null;
  }
}
