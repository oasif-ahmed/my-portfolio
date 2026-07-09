"use server";

import clientPromise from "@/lib/mongodb";

const DB_NAME = "portfolio";
const COLLECTION_NAME = "resume";

export async function getResumeUrl() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const docs = await db.collection(COLLECTION_NAME).find({}).limit(1).toArray();
    return docs.length > 0 ? (docs[0].url || "") : "";
  } catch (e) {
    console.error("Error fetching resume URL:", e);
    return "";
  }
}

export async function updateResumeUrl(url: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteMany({});
    await db.collection(COLLECTION_NAME).insertOne({ url, updatedAt: new Date() });
    return { success: true };
  } catch (e) {
    console.error("Error updating resume URL:", e);
    return { success: false, error: "Failed to update resume URL" };
  }
}
