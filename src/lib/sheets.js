import "server-only";
import { JWT } from "google-auth-library";

const yes = (b) => (b ? "Yes" : "No");
const list = (a) => (Array.isArray(a) ? a.join(", ") : a ?? "");

// [column header, value getter]
const COLUMNS = [
  ["Timestamp (IST)", (r) => new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ["Registration ID", (r) => r.regId],
  ["Full Name", (r) => r.fullName],
  ["Designation", (r) => r.designation],
  ["Mobile (OTP verified)", (r) => r.mobile],
  ["Official Email ID", (r) => r.email],
  ["Alternative Contact", (r) => r.altContact ?? ""],
  ["School / Institution", (r) => r.school.name],
  ["School Address", (r) => r.school.address],
  ["School Board", (r) => r.school.boardLabel],
  ["School Category", (r) => r.school.category],
  ["School Official Email", (r) => r.school.email],
  ["School Contact Number", (r) => r.school.contact],
  ["Principal / Head Name", (r) => r.school.principalName],
  ["Principal Email / Contact", (r) => r.school.principalContact],
  ["Stage Benefiting Most from Guidance", (r) => r.outreach.guidanceStage],
  ["Class XII Enrolment (approx.)", (r) => r.outreach.class12Strength],
  [
    "Streams Offered",
    (r) => list(r.outreach.streams.map((s) => (s === "Other" && r.outreach.streamsOther ? `Other (${r.outreach.streamsOther})` : s))),
  ],
  ["Handles Career Guidance", (r) => r.outreach.careerGuidance],
  ["Interested in EIT Guidance Sessions", (r) => r.outreach.guidanceSessions],
  ["Wants EIT Programme Info", (r) => r.outreach.programmeInfo],
  ["Interested in School Visit to EIT", (r) => r.outreach.schoolVisit],
  ["Preferred Activities", (r) => list(r.outreach.activities)],
  ["Preferred Communication", (r) => list(r.outreach.commModes)],
  ["Best Time to Contact", (r) => r.outreach.contactTime],
  ["Marketing Consent", (r) => yes(r.consent.marketing)],
  ["Privacy Notice Version", (r) => r.consent.noticeVersion],
];

const HEADERS = COLUMNS.map(([h]) => h);

/** 1 → A, 27 → AA */
function colLetter(n) {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
const LAST_COL = colLetter(HEADERS.length);

const globalForSheets = globalThis;

function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key || !process.env.GOOGLE_SHEET_ID) return null;
  if (!globalForSheets._sheetsClient) {
    globalForSheets._sheetsClient = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
  return globalForSheets._sheetsClient;
}

const base = () => `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values`;
const tab = () => process.env.GOOGLE_SHEET_TAB || "Registrations";
const range = (r) => encodeURIComponent(`'${tab()}'!${r}`);

/** Writes the header row when the tab's first row is empty. */
async function ensureHeader(client) {
  if (globalForSheets._sheetsHeaderReady) return;
  const res = await client.request({ url: `${base()}/${range(`A1:${LAST_COL}1`)}` });
  if (!res.data.values?.length) {
    await client.request({
      url: `${base()}/${range(`A1:${LAST_COL}1`)}?valueInputOption=RAW`,
      method: "PUT",
      data: { values: [HEADERS] },
    });
  }
  globalForSheets._sheetsHeaderReady = true;
}

/** Appends one registration row. Returns true when written, false when Sheets isn't configured. */
export async function appendRegistrationRow(doc) {
  const client = getClient();
  if (!client) return false;
  await ensureHeader(client);

  const row = COLUMNS.map(([, get]) => String(get(doc) ?? ""));

  // RAW keeps values as plain text (no formula injection, phone numbers stay intact).
  await client.request({
    url: `${base()}/${range(`A:${LAST_COL}`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: "POST",
    data: { values: [row] },
  });
  return true;
}