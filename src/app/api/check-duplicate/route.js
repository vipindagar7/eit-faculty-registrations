import { getDb } from "@/lib/mongodb";
import { emailSchema, isValidPhone, normalizePhone } from "@/lib/validation";
import { fail, json, readBody } from "@/lib/http";

/** Live availability check for email / phone (used on field blur). */
export async function POST(request) {
  const body = await readBody(request);
  const field = body?.field;

  try {
    const db = await getDb();
    const col = db.collection("registrations");

    if (field === "email") {
      const parsed = emailSchema.safeParse(body?.value ?? "");
      if (!parsed.success) return fail("Invalid email");
      const found = await col.findOne({ email: parsed.data }, { projection: { _id: 1 } });
      return json({ ok: true, available: !found });
    }

    if (field === "phone") {
      const phone = normalizePhone(body?.value);
      if (!isValidPhone(phone)) return fail("Invalid number");
      const found = await col.findOne({ phones: phone }, { projection: { _id: 1 } });
      return json({ ok: true, available: !found });
    }

    return fail("Unknown field");
  } catch (err) {
    console.error("[check-duplicate]", err);
    return fail("Could not check right now", 500);
  }
}
