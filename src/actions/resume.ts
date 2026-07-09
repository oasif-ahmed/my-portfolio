"use server";

import clientPromise from "@/lib/mongodb";

const DB_NAME = "portfolio";
const COLLECTION_NAME = "resume";

export async function getResumeUrl() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doc = await db.collection(COLLECTION_NAME).findOne({ _id: "resume_url" as any });
    return doc?.url || "";
  } catch (e) {
    console.error("Error fetching resume URL:", e);
    return "";
  }
}

export async function updateResumeUrl(url: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: "resume_url" as any },
      { $set: { url } },
      { upsert: true }
    );
    return { success: true };
  } catch (e) {
    console.error("Error updating resume URL:", e);
    return { success: false, error: "Failed to update resume URL" };
  }
}
