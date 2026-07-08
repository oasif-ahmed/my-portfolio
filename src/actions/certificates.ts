"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Certificate {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "certificates";

export async function getCertificates() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const certs = await db.collection(COLLECTION_NAME).find({}).toArray();
    return certs.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      image: c.image,
      credentialUrl: c.credentialUrl || "",
    }));
  } catch (e) {
    console.error("Error fetching certificates from MongoDB:", e);
    return null;
  }
}

export async function addCertificate(cert: Omit<Certificate, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne(cert);
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting certificate to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateCertificate(id: string, cert: Omit<Certificate, "id" | "_id">) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: cert }
    );
    return { success: true };
  } catch (e) {
    console.error("Error updating certificate in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteCertificate(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (e) {
    console.error("Error deleting certificate from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
