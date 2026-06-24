"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

// ডাটাবেজ কানেকশন হেল্পার
async function connectDB() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  return { client, db: client.db() };
}

// 🟢 ১. নতুন প্রজেক্ট ডাটাবেজে অ্যাড করার ফাংশন
export async function addProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const techString = formData.get("tech") as string;
  const liveLink = formData.get("liveLink") as string;
  const githubLink = formData.get("githubLink") as string;

  // টেকনোলজিগুলোকে কমা (,) দিয়ে আলাদা করে একটি Array তে কনভার্ট করা হচ্ছে
  const techArray = techString.split(",").map((t) => t.trim()).filter(Boolean);

  const { client, db } = await connectDB();
  
  await db.collection("projects").insertOne({
    title,
    description,
    tech: techArray,
    liveLink,
    githubLink,
    createdAt: new Date(),
  });

  await client.close();

  // ডাটা অ্যাড হওয়ার পর পেজ রিলোড ছাড়াই নতুন ডাটা দেখানোর জন্য
  revalidatePath("/dashboard/projects");
  revalidatePath("/"); // মেইন ওয়েবসাইটের হোমপেজও আপডেট হয়ে যাবে
}

// 🔴 ২. প্রজেক্ট ডিলিট করার ফাংশন
export async function deleteProject(id: string) {
  const { client, db } = await connectDB();
  
  await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
  
  await client.close();

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}