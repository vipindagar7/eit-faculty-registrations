import "server-only";

export const json = (data, status = 200) => Response.json(data, { status });
export const fail = (message, status = 400, extra = {}) =>
  Response.json({ ok: false, message, ...extra }, { status });

export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** Maps a Mongo duplicate-key error to a field + friendly message. */
export function duplicateField(err) {
  if (err?.code !== 11000) return null;
  const key = Object.keys(err.keyPattern || err.keyValue || {})[0] || "";
  if (key === "email") return { field: "email", message: "This email is already registered" };
  if (key === "mobile") return { field: "mobile", message: "This mobile number is already registered" };
  if (key === "phones") return { field: "altContact", message: "This mobile / alternative number is already registered" };
  return { field: "form", message: "A registration with these details already exists" };
}
