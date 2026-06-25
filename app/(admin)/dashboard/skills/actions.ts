"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2"; // 📌 R2 Uploader (Project এর মতো)

// ==========================================
// 🛠️ SKILLS ACTIONS
// ==========================================

export async function saveSkill(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const subtitle = formData.get("subtitle") as string; // 📌 New Field
  const percentage = parseInt(formData.get("percentage") as string, 10);
  const icon = formData.get("icon") as string;

  if (!name || !percentage || !icon) {
    throw new Error("Required fields are missing.");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  if (id) {
    await db.collection("skills").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, subtitle, percentage, icon } }
    );
  } else {
    await db.collection("skills").insertOne({
      name,
      subtitle,
      percentage,
      icon,
      createdAt: new Date()
    });
  }

  await client.close();
  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("skills").deleteOne({ _id: new ObjectId(id) });
  await client.close();

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}


// ==========================================
// 💼 SERVICES / EXPERIENCE ACTIONS
// ==========================================

export async function saveService(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  if (!title || !description) {
    throw new Error("Title and Description are required.");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  let updateData: any = {
    title,
    description,
    updatedAt: new Date(),
  };

  // 📌 যদি নতুন ইমেজ আপলোড করা হয়
  if (imageFile && imageFile.size > 0) {
    updateData.image = await uploadFileToR2(imageFile, "services");
  }

  if (id) {
    await db.collection("services").updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updateData }
    );
  } else {
    updateData.createdAt = new Date();
    // 📌 নতুন তৈরি করার সময় ইমেজ বাধ্যতামূলক ছিল ফ্রন্টএন্ডে
    await db.collection("services").insertOne(updateData);
  }

  await client.close();
  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("services").deleteOne({ _id: new ObjectId(id) });
  await client.close();

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}