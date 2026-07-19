"use server";

import { MongoClient } from "mongodb";

export async function incrementViewTime(slug: string, minutes: number) {
  if (!slug || minutes <= 0) return;
  
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // 📌 $inc ব্যবহার করে বর্তমান totalViewTime এর সাথে নতুন মিনিট যোগ করা হচ্ছে
    await db.collection("posts").updateOne(
      { slug },
      { $inc: { totalViewTime: minutes } }
    );
    
    await client.close();
  } catch (error) {
    console.error("Failed to increment view time", error);
  }
}