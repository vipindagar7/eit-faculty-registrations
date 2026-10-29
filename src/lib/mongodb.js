import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "faculty_registration";

// Reuse the client across hot reloads (dev) and invocations (prod).
const globalForMongo = globalThis;

function getClientPromise() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    globalForMongo._mongoClientPromise = client.connect();
  }
  return globalForMongo._mongoClientPromise;
}

async function dropLegacyIndexes(db) {
  // v1 of the form had a unique WhatsApp index. New documents have no `whatsapp`
  // field, so that index would block every registration after the first — drop it.
  try {
    await db.collection("registrations").dropIndex("uniq_whatsapp");
  } catch {
    /* index not present */
  }
}

async function ensureIndexes(db) {
  if (globalForMongo._mongoIndexesReady) return globalForMongo._mongoIndexesReady;
  globalForMongo._mongoIndexesReady = dropLegacyIndexes(db)
    .then(() =>
      Promise.all([
        // Uniqueness — enforced by the database, not just app code.
        db.collection("registrations").createIndex({ email: 1 }, { unique: true, name: "uniq_email" }),
        db.collection("registrations").createIndex({ mobile: 1 }, { unique: true, name: "uniq_mobile" }),
        // `phones` = [mobile, altContact?]; multikey unique index stops a number being reused
        // as mobile in one entry and alternative number in another.
        db.collection("registrations").createIndex({ phones: 1 }, { unique: true, name: "uniq_phones" }),
        db.collection("registrations").createIndex({ regId: 1 }, { unique: true, name: "uniq_regId" }),
        db.collection("otps").createIndex({ mobile: 1 }, { unique: true }),
        db.collection("otps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        db.collection("otp_requests").createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }),
        db.collection("otp_requests").createIndex({ mobile: 1, createdAt: -1 }),
        db.collection("otp_requests").createIndex({ ip: 1, createdAt: -1 }),
      ])
    )
    .catch((err) => {
      globalForMongo._mongoIndexesReady = null;
      throw err;
    });
  return globalForMongo._mongoIndexesReady;
}

export async function getDb() {
  const client = await getClientPromise();
  const db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}

/** Atomic sequential registration ID, e.g. BSE-0001 */
export async function nextRegistrationId(db) {
  const prefix = process.env.REG_ID_PREFIX || "BSE";
  const counter = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "registration" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  const seq = counter?.seq ?? counter?.value?.seq;
  return `${prefix}-${String(seq).padStart(4, "0")}`;
}
