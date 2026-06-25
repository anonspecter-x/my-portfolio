"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2";

export async function saveProject(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const tagline = formData.get("tagline") as string; // 📌 NEW
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const features = formData.get("features") as string; // 📌 NEW
  const liveLink = formData.get("liveLink") as string;
  const githubLink = formData.get("githubLink") as string;
  const coverImage = formData.get("coverImage") as File;

  // 📌 স্পেশাল ফিল্ডগুলো
  const category = formData.get("category") as string;
  const year = formData.get("year") as string;
  const clientName = formData.get("clientName") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  
  // 📌 টেকনোলজিগুলোকে আলাদা ক্যাটাগরিতে ভাগ করা
  const frontend = (formData.get("frontend") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const backend = (formData.get("backend") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const tools = (formData.get("tools") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  
  // মেইন হোমপেজের কার্ডে দেখানোর জন্য সব টেকনোলজি একসাথে করা হলো
  const techArray = [...frontend, ...backend, ...tools];

  if (!title || !description) {
    throw new Error("Title and Description are required.");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  let updateData: any = {
    title,
    tagline,      // 📌 NEW
    description,
    content,
    features,     // 📌 NEW
    category,
    year,
    clientName,
    role,
    status,
    frontend,
    backend,
    tools,
    tech: techArray, // For homepage preview
    liveLink,
    githubLink,
    updatedAt: new Date(),
  };

  if (coverImage && coverImage.size > 0) {
    updateData.image = await uploadFileToR2(coverImage, "projects");
  }

  if (id) {
    await db.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  } else {
    updateData.createdAt = new Date();
    updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    await db.collection("projects").insertOne(updateData);
  }

  await client.close();
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
  await client.close();

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}