import { z } from "zod";
import { BOARDS, OUTREACH, SCHOOL_CATEGORIES } from "./constants";

/** Normalises Indian mobile input: strips spaces, +91, 0 prefix. */
export function normalizePhone(value = "") {
  let digits = String(value).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export const isValidPhone = (v) => /^[6-9]\d{9}$/.test(normalizePhone(v));

/** Mobile or landline with STD code (10–12 digits, optional +91 / 0). */
export const isValidContactNumber = (v) => {
  const d = String(v || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  return /^0?\d{10,11}$/.test(d);
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (v) => EMAIL_RE.test(String(v || "").trim());

const req = (msg) => z.string().trim().min(1, msg);

export const phoneSchema = req("Mobile number is required").refine(
  isValidPhone,
  "Enter a valid 10-digit Indian mobile number"
);

export const emailSchema = req("Email is required")
  .max(120)
  .refine(isValidEmail, "Enter a valid email address")
  .transform((v) => v.toLowerCase());

const opt = z.string().trim().max(150).optional().default("");
const pick = (values, msg) => z.enum(values, { message: msg });
const multi = (values, msg) => z.array(z.enum(values)).min(1, msg);

/* ── Step 1: Faculty personal & contact details ────────────────────────── */
const personalShape = {
  fullName: req("Enter your full name")
    .min(3, "Enter your full name")
    .max(100, "Name is too long")
    .regex(/^[A-Za-z.'\s-]+$/, "Name can contain letters, spaces, dots and hyphens only"),
  designation: req("Enter your designation").min(2, "Enter your designation").max(80, "Designation is too long"),
  mobile: phoneSchema,
  email: emailSchema,
  altContact: z.string().trim().optional().default(""),
};

function refinePersonal(d, ctx) {
  if (d.altContact) {
    if (!isValidPhone(d.altContact)) {
      ctx.addIssue({ code: "custom", path: ["altContact"], message: "Enter a valid 10-digit mobile number" });
    } else if (normalizePhone(d.altContact) === normalizePhone(d.mobile)) {
      ctx.addIssue({ code: "custom", path: ["altContact"], message: "Must be different from your mobile number" });
    }
  }
}

/* ── Step 2: School / institution details ──────────────────────────────── */
const schoolShape = {
  schoolName: req("Enter the school / institution name").min(3, "Enter the school name").max(200),
  schoolAddress: req("Enter the full school address")
    .min(15, "Enter the full address with city, state and PIN code")
    .max(500, "Address is too long"),
  board: pick(
    BOARDS.map((b) => b.value),
    "Select the school board"
  ),
  otherBoard: opt,
  schoolCategory: pick(SCHOOL_CATEGORIES, "Select the school category"),
  schoolEmail: req("Enter the school's official email")
    .refine(isValidEmail, "Enter a valid email address")
    .transform((v) => v.toLowerCase()),
  schoolContact: req("Enter the school contact number").refine(
    isValidContactNumber,
    "Enter a valid phone number (with STD code for landline)"
  ),
  principalName: req("Enter the Principal / Head's name")
    .min(3, "Enter the Principal / Head's name")
    .max(100)
    .regex(/^[A-Za-z.'\s-]+$/, "Name can contain letters, spaces, dots and hyphens only"),
  principalContact: req("Enter the Principal's official email or contact number").refine(
    (v) => isValidEmail(v) || isValidContactNumber(v),
    "Enter a valid email address or phone number"
  ),
};

function refineSchool(d, ctx) {
  if (d.board === "OTHER" && (d.otherBoard || "").length < 2) {
    ctx.addIssue({ code: "custom", path: ["otherBoard"], message: "Enter the board name" });
  }
}

/* ── Step 3: Student outreach & admission potential ────────────────────── */
const outreachShape = {
  guidanceStage: pick(OUTREACH.guidanceStage, "Select a stage"),
  class12Strength: pick(OUTREACH.class12Strength, "Select approximate Class XII enrolment"),
  streams: multi(OUTREACH.streams, "Select at least one stream"),
  streamsOther: opt,
  careerGuidance: pick(OUTREACH.careerGuidance, "Please select an option"),
  guidanceSessions: pick(OUTREACH.guidanceSessions, "Please select an option"),
  programmeInfo: pick(OUTREACH.programmeInfo, "Please select an option"),
  schoolVisit: pick(OUTREACH.schoolVisit, "Please select an option"),
  activities: multi(OUTREACH.activities, "Select at least one activity"),
  commModes: multi(OUTREACH.commModes, "Select at least one mode"),
  contactTime: pick(OUTREACH.contactTime, "Select the best time to contact you"),
  contactTimeOther: opt,
};

function refineOutreach(d, ctx) {
  if (d.streams?.includes("Other") && (d.streamsOther || "").length < 2) {
    ctx.addIssue({ code: "custom", path: ["streamsOther"], message: "Specify the other stream(s)" });
  }
  if (d.contactTime === "Other" && (d.contactTimeOther || "").length < 2) {
    ctx.addIssue({ code: "custom", path: ["contactTimeOther"], message: "Specify a preferred time" });
  }
}

/* ── Step 4: Consent (DPDP Act 2023) ───────────────────────────────────── */
const consentShape = {
  consentProcessing: z.literal(true, {
    message: "Consent is required to process your registration",
  }),
  consentAccuracy: z.literal(true, { message: "Please confirm the details are correct" }),
  consentMarketing: z.boolean().default(false),
};

export const personalSchema = z.object(personalShape).superRefine(refinePersonal);
export const schoolSchema = z.object(schoolShape).superRefine(refineSchool);
export const outreachSchema = z.object(outreachShape).superRefine(refineOutreach);

export const fullSchema = z
  .object({ ...personalShape, ...schoolShape, ...outreachShape, ...consentShape })
  .superRefine((d, ctx) => {
    refinePersonal(d, ctx);
    refineSchool(d, ctx);
    refineOutreach(d, ctx);
  });

/** Schema used by react-hook-form for each step of the wizard. */
export const stepSchemas = [personalSchema, schoolSchema, outreachSchema, fullSchema];

export const registerPayloadSchema = z.object({
  data: fullSchema,
  verificationToken: z.string().min(10, "Mobile number is not verified"),
});