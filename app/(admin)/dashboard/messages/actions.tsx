"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("messages").deleteOne({ _id: new ObjectId(id) });
  
  await client.close();
  
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard"); // ড্যাশবোর্ডের কাউন্ট কমানোর জন্য
}
