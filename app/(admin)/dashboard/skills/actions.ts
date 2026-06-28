"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2"; // 📌 R2 Uploader

// MongoDB কানেকশন হেল্পার (কানেকশন পুলিং অপ্টিমাইজ করার জন্য)
async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  return { client, db: client.db() };
}

// ==========================================
// 🛠️ SKILLS ACTIONS
// ==========================================

export async function saveSkill(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const subtitle = formData.get("subtitle") as string;
  const percentage = parseInt(formData.get("percentage") as string, 10);
  const icon = formData.get("icon") as string;

  if (!name || isNaN(percentage) || !icon) {
    throw new Error("Required fields are missing or invalid.");
  }

  const { client, db } = await connectToDatabase();

  try {
    if (id && ObjectId.isValid(id)) {
      await db.collection("skills").updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, subtitle, percentage, icon, updatedAt: new Date() } }
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
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  if (!id || !ObjectId.isValid(id)) throw new Error("Invalid ID provided.");
  
  const { client, db } = await connectToDatabase();
  try {
    await db.collection("skills").deleteOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }

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
  const imageFile = formData.get("image") as File | null;

  if (!title || !description) {
    throw new Error("Title and Description are required.");
  }

  const { client, db } = await connectToDatabase();

  try {
    let updateData: any = {
      title,
      description,
      updatedAt: new Date(),
    };

    // 📌 নতুন ইমেজ আপলোড করা হলে
    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadFileToR2(imageFile, "services");
    }

    if (id && ObjectId.isValid(id)) {
      await db.collection("services").updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updateData }
      );
    } else {
      updateData.createdAt = new Date();
      await db.collection("services").insertOne(updateData);
    }
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  if (!id || !ObjectId.isValid(id)) throw new Error("Invalid ID provided.");

  const { client, db } = await connectToDatabase();
  try {
    await db.collection("services").deleteOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

// ==========================================
// 🏆 TRUSTED BRANDS ACTIONS
// ==========================================

export async function saveBrand(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const order = parseInt(formData.get("order") as string, 10) || 0;
  const logoFile = formData.get("logo") as File | null;

  if (!name) {
    throw new Error("Brand name is required.");
  }

  const { client, db } = await connectToDatabase();

  try {
    let updateData: any = {
      name,
      order,
      updatedAt: new Date(),
    };

    // 📌 নতুন লোগো আপলোড করা হলে Cloudflare R2 তে সেভ হবে
    if (logoFile && logoFile.size > 0) {
      updateData.logo = await uploadFileToR2(logoFile, "brands");
    }

    if (id && ObjectId.isValid(id)) {
      await db.collection("brands").updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updateData }
      );
    } else {
      updateData.createdAt = new Date();
      await db.collection("brands").insertOne(updateData);
    }
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

export async function deleteBrand(id: string) {
  if (!id || !ObjectId.isValid(id)) throw new Error("Invalid ID provided.");

  const { client, db } = await connectToDatabase();
  try {
    await db.collection("brands").deleteOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}

// ==========================================
// 📌 NEW: FOOTER ICONS VISIBILITY ACTION
// ==========================================

export async function saveFooterIcons(formData: FormData) {
  // চেকবক্স থেকে সিলেক্ট করা সব আইকনের নাম অ্যারে হিসেবে নেওয়া হলো
  const selectedIcons = formData.getAll("footerIcons") as string[];
  const { client, db } = await connectToDatabase();

  try {
    // সেটিংস কালেকশনে আইকনের লিস্ট সেভ করা হলো
    await db.collection("settings").updateOne(
      {}, 
      { $set: { footerIcons: selectedIcons } },
      { upsert: true }
    );
  } finally {
    await client.close();
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/");
}