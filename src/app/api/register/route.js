import { getDb, nextRegistrationId } from "@/lib/mongodb";
import { readVerificationToken } from "@/lib/otp";
import { appendRegistrationRow } from "@/lib/sheets";
import { registerPayloadSchema, normalizePhone } from "@/lib/validation";
import { boardLabel } from "@/lib/constants";
import { SITE } from "@/lib/site-config";
import { duplicateField, fail, getClientIp, json, readBody } from "@/lib/http";

const clean = (s = "") => String(s).replace(/\s+/g, " ").trim();

export async function POST(request) {
  const body = await readBody(request);
  const parsed = registerPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue?.message || "Invalid form data", 422, { field: issue?.path?.at(-1) });
  }

  const { data, verificationToken } = parsed.data;
  const mobile = normalizePhone(data.mobile);
  const altContact = data.altContact ? normalizePhone(data.altContact) : null;

  // OTP proof must match the submitted mobile.
  const verifiedMobile = readVerificationToken(verificationToken);
  if (!verifiedMobile || verifiedMobile !== mobile) {
    return fail("Mobile verification expired. Please verify your mobile number again.", 401, {
      field: "mobile",
      reverify: true,
    });
  }

  try {
    const db = await getDb();
    const col = db.collection("registrations");
    const phones = altContact ? [mobile, altContact] : [mobile];

    // Friendly pre-check (DB unique indexes are the real guarantee against races).
    const dup = await col.findOne(
      { $or: [{ email: data.email }, { phones: { $in: phones } }] },
      { projection: { email: 1, phones: 1 } }
    );
    if (dup) {
      if (dup.email === data.email) return fail("This email is already registered", 409, { field: "email" });
      if (dup.phones?.includes(mobile)) return fail("This mobile number is already registered", 409, { field: "mobile" });
      return fail("This alternative number is already registered", 409, { field: "altContact" });
    }

    const now = new Date();
    const ip = getClientIp(request);
    const regId = await nextRegistrationId(db);

    const doc = {
      regId,
      // Faculty personal & contact
      fullName: clean(data.fullName),
      designation: clean(data.designation),
      mobile,
      mobileVerified: true,
      email: data.email,
      altContact,
      phones,
      // School / institution
      school: {
        name: clean(data.schoolName),
        address: clean(data.schoolAddress),
        board: data.board,
        boardLabel: boardLabel(data),
        category: data.schoolCategory,
        email: data.schoolEmail,
        contact: clean(data.schoolContact),
        principalName: clean(data.principalName),
        principalContact: clean(data.principalContact),
      },
      // Student outreach & admission potential
      outreach: {
        guidanceStage: data.guidanceStage,
        class12Strength: data.class12Strength,
        streams: data.streams,
        streamsOther: data.streams.includes("Other") ? clean(data.streamsOther) : null,
        careerGuidance: data.careerGuidance,
        guidanceSessions: data.guidanceSessions,
        programmeInfo: data.programmeInfo,
        schoolVisit: data.schoolVisit,
        activities: data.activities,
        commModes: data.commModes,
        contactTime: data.contactTime === "Other" ? clean(data.contactTimeOther) : data.contactTime,
      },
      // DPDP Act consent record
      consent: {
        processing: true,
        accuracy: true,
        marketing: data.consentMarketing === true,
        noticeVersion: SITE.privacy.version,
        givenAt: now,
        ip,
        withdrawnAt: null,
      },
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      sheetSynced: false,
      createdAt: now,
    };

    try {
      await col.insertOne(doc);
    } catch (err) {
      const d = duplicateField(err);
      if (d) return fail(d.message, 409, { field: d.field });
      throw err;
    }

    // Google Sheets mirror — MongoDB stays the source of truth if Sheets is down.
    try {
      const written = await appendRegistrationRow(doc);
      await col.updateOne(
        { _id: doc._id },
        { $set: { sheetSynced: written, sheetError: written ? null : "Sheets not configured" } }
      );
    } catch (err) {
      console.error("[register] Google Sheets append failed:", err?.response?.data || err.message);
      await col.updateOne({ _id: doc._id }, { $set: { sheetSynced: false, sheetError: String(err.message) } });
    }

    return json({
      ok: true,
      message: "Registration successful",
      registration: {
        regId,
        fullName: doc.fullName,
        designation: doc.designation,
        email: doc.email,
        mobile: doc.mobile,
        schoolName: doc.school.name,
        boardLabel: doc.school.boardLabel,
      },
    });
  } catch (err) {
    console.error("[register]", err);
    return fail("Something went wrong while saving. Please try again.", 500);
  }
}