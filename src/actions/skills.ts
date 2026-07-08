"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Skill {
  id?: string;
  _id?: string;
  name: string;
  icon: string;
  level: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "skills";

export async function getSkills() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const skills = await db.collection(COLLECTION_NAME).find({}).toArray();

    return skills.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      icon: s.icon,
      level: s.level,
    }));
  } catch (e) {
    console.error("Error fetching skills from MongoDB:", e);
    return null;
  }
}

export async function addSkill(skill: Omit<Skill, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne(skill);
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting skill to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateSkill(id: string, skill: Omit<Skill, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: skill }
    );
    return { success: true };
  } catch (e) {
    console.error("Error updating skill in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteSkill(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (e) {
    console.error("Error deleting skill from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
