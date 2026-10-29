export { EVENT_NAME } from "./site-config";

export const DESIGNATIONS = ["Principal", "Vice Principal", "HOD", "Coordinator", "Teacher", "Other"];

export const BOARDS = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE / ISC (CISCE)" },
  { value: "STATE", label: "State Board" },
  { value: "NIOS", label: "NIOS" },
  { value: "IB", label: "IB (International Baccalaureate)" },
  { value: "CAMBRIDGE", label: "Cambridge (CAIE / IGCSE)" },
  { value: "OTHER", label: "Other" },
];

export const SCHOOL_CATEGORIES = ["Private", "Government", "Government-Aided"];

// All Indian states & union territories with their state school boards.
export const STATES = [
  { value: "andhra-pradesh", name: "Andhra Pradesh", board: "BSEAP / BIEAP" },
  { value: "arunachal-pradesh", name: "Arunachal Pradesh", board: "Arunachal Pradesh State Board" },
  { value: "assam", name: "Assam", board: "ASSEB (formerly SEBA / AHSEC)" },
  { value: "bihar", name: "Bihar", board: "BSEB" },
  { value: "chhattisgarh", name: "Chhattisgarh", board: "CGBSE" },
  { value: "goa", name: "Goa", board: "GBSHSE" },
  { value: "gujarat", name: "Gujarat", board: "GSEB" },
  { value: "haryana", name: "Haryana", board: "BSEH (HBSE)" },
  { value: "himachal-pradesh", name: "Himachal Pradesh", board: "HPBOSE" },
  { value: "jharkhand", name: "Jharkhand", board: "JAC" },
  { value: "karnataka", name: "Karnataka", board: "KSEAB" },
  { value: "kerala", name: "Kerala", board: "KBPE / DHSE" },
  { value: "madhya-pradesh", name: "Madhya Pradesh", board: "MPBSE" },
  { value: "maharashtra", name: "Maharashtra", board: "MSBSHSE" },
  { value: "manipur", name: "Manipur", board: "BOSEM / COHSEM" },
  { value: "meghalaya", name: "Meghalaya", board: "MBOSE" },
  { value: "mizoram", name: "Mizoram", board: "MBSE" },
  { value: "nagaland", name: "Nagaland", board: "NBSE" },
  { value: "odisha", name: "Odisha", board: "BSE Odisha / CHSE" },
  { value: "punjab", name: "Punjab", board: "PSEB" },
  { value: "rajasthan", name: "Rajasthan", board: "RBSE" },
  { value: "sikkim", name: "Sikkim", board: "Sikkim State Board" },
  { value: "tamil-nadu", name: "Tamil Nadu", board: "TNBSE (DGE)" },
  { value: "telangana", name: "Telangana", board: "BSE Telangana / TSBIE" },
  { value: "tripura", name: "Tripura", board: "TBSE" },
  { value: "uttar-pradesh", name: "Uttar Pradesh", board: "UPMSP" },
  { value: "uttarakhand", name: "Uttarakhand", board: "UBSE" },
  { value: "west-bengal", name: "West Bengal", board: "WBBSE / WBCHSE" },
  { value: "andaman-nicobar", name: "Andaman & Nicobar Islands", board: "UT Board", ut: true },
  { value: "chandigarh", name: "Chandigarh", board: "UT Board", ut: true },
  { value: "dnh-dd", name: "Dadra & Nagar Haveli and Daman & Diu", board: "UT Board", ut: true },
  { value: "delhi", name: "Delhi (NCT)", board: "DBSE", ut: true },
  { value: "jammu-kashmir", name: "Jammu & Kashmir", board: "JKBOSE", ut: true },
  { value: "ladakh", name: "Ladakh", board: "UT Board", ut: true },
  { value: "lakshadweep", name: "Lakshadweep", board: "UT Board", ut: true },
  { value: "puducherry", name: "Puducherry", board: "UT Board", ut: true },
];

// Student outreach & admission potential
export const OUTREACH = {
  classes: ["IX", "X", "XI", "XII", "Pass-outs"],
  class12Strength: ["Below 50", "50–100", "101–200", "201–500", "Above 500"],
  streams: ["PCM", "PCB", "Commerce", "Humanities", "Other"],
  careerGuidance: ["Yes", "No", "Partially"],
  guidanceSessions: ["Yes", "No", "Maybe"],
  programmeInfo: ["Yes", "No"],
  schoolVisit: ["Yes", "No", "Maybe"],
  activities: [
    "Campus visits",
    "Technical workshops",
    "Career counselling",
    "Coding competitions",
    "Seminars",
    "Faculty interaction",
  ],
  commModes: ["Email", "Phone", "WhatsApp"],
  contactTime: ["Morning", "Afternoon", "Working hours", "Other"],
};

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;

export const stateName = (v) => STATES.find((s) => s.value === v)?.name ?? "";

export function boardLabel({ board, state, otherBoard }) {
  if (board === "STATE") {
    const s = STATES.find((x) => x.value === state);
    return s ? `State Board – ${s.name} (${s.board})` : "State Board";
  }
  if (board === "OTHER") return `Other – ${otherBoard || ""}`.trim();
  return BOARDS.find((b) => b.value === board)?.label ?? board ?? "";
}

export const designationLabel = ({ designation, designationOther }) =>
  designation === "Other" ? designationOther || "Other" : designation;

/** Joins a multi-select, replacing "Other" with the free-text value. */
export const listLabel = (arr = [], other = "") =>
  arr.map((v) => (v === "Other" && other ? `Other (${other})` : v)).join(", ");
