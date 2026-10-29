export { EVENT_NAME } from "./site-config";

export const BOARDS = [
  { value: "CBSE", label: "CBSE" },
  { value: "HBSE", label: "HBSE (Board of School Education Haryana)" },
  { value: "OTHER", label: "Other" },
];

export const SCHOOL_CATEGORIES = ["Private", "Government", "Government-Aided"];

// Student outreach & admission potential
export const OUTREACH = {
  guidanceStage: ["Classes IX–X", "Classes XI–XII", "After Class XII", "At all these stages"],
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

export function boardLabel({ board, otherBoard }) {
  if (board === "OTHER") return `Other – ${otherBoard || ""}`.trim();
  return BOARDS.find((b) => b.value === board)?.label ?? board ?? "";
}

/** Joins a multi-select, replacing "Other" with the free-text value. */
export const listLabel = (arr = [], other = "") =>
  arr.map((v) => (v === "Other" && other ? `Other (${other})` : v)).join(", ");