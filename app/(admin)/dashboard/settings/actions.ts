"use server";

import { MongoClient } from "mongodb";
import { revalidatePath } from "next/cache";

// 📌 সেটিংস আপডেট করার ফাংশন
export async function updateSettings(formData: FormData) {
  const data = {
    developerName: formData.get("developerName") as string,
    developerRole: formData.get("developerRole") as string,
    developerEmail: formData.get("developerEmail") as string,
    developerPhone: formData.get("developerPhone") as string,
    developerRegion: formData.get("developerRegion") as string,
    seoTitle: formData.get("seoTitle") as string,
    seoDescription: formData.get("seoDescription") as string,
    seoKeywords: formData.get("seoKeywords") as string,
    updatedAt: new Date(),
  };

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  // আমরা শুধু একটিমাত্র সেটিংস ডকুমেন্ট রাখব, তাই upsert ব্যবহার করছি
  await db.collection("settings").updateOne(
    {}, // সব ডকুমেন্টের জন্য
    { $set: data }, // ডাটা সেট করা
    { upsert: true } // যদি আগে থেকে না থাকে, তবে নতুন তৈরি করবে
  );
  
  await client.close();
  
  // পেজ রিফ্রেশ করার জন্য
  revalidatePath("/dashboard/settings");
  revalidatePath("/"); // হোমপেজও আপডেট হবে
}