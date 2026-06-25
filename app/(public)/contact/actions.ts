"use server";

import { MongoClient } from "mongodb";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  // ডাটাবেজে নতুন মেসেজ ইনসার্ট করা হচ্ছে (সাথে সময় যুক্ত করে)
  await db.collection("messages").insertOne({
    name,
    email,
    message,
    createdAt: new Date(),
  });
  
  await client.close();
  
  // ড্যাশবোর্ডের ইনবক্স যেন সাথে সাথে আপডেট হয়
  revalidatePath("/dashboard/messages"); 
}