"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface JourneyItem {
  id?: string;
  _id?: string;
  title: string;
  period: string;
  description: string;
  highlights?: string[];
  icons: string[];
  order: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "journey";

export async function getJourney() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const items = await db.collection(COLLECTION_NAME).find({}).sort({ order: 1 }).toArray();

    return items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      period: item.period,
      description: item.description,
      highlights: item.highlights,
      icons: item.icons,
      order: item.order,
    }));
  } catch (e) {
    console.error("Error fetching journey from MongoDB:", e);
    return null;
  }
}

export async function addJourneyItem(item: Omit<JourneyItem, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne(item);
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting journey item to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateJourneyItem(id: string, item: Omit<JourneyItem, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: item }
    );
    return { success: true };
  } catch (e) {
    console.error("Error updating journey item in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteJourneyItem(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (e) {
    console.error("Error deleting journey item from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
