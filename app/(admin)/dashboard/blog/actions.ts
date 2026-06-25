"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2";

// 📌 ব্লগ সেভ বা আপডেট করার ফাংশন
export async function saveBlogPost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as File;
  
  // 📌 নতুন SEO ফিল্ডগুলো ধরা হলো
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const seoKeywords = formData.get("seoKeywords") as string;

  if (!title || !content) {
    throw new Error("Title and Content are required.");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  let updateData: any = { 
    title, 
    content, 
    seoTitle,          // 📌 SEO Title
    seoDescription,    // 📌 SEO Description
    seoKeywords,       // 📌 SEO Keywords
    updatedAt: new Date() 
  };

  // যদি নতুন কভার ইমেজ দেয়, তবে R2 তে আপলোড করবে
  if (coverImage && coverImage.size > 0) {
    const imageUrl = await uploadFileToR2(coverImage, "blog-covers");
    updateData.coverImage = imageUrl;
  }

  if (id) {
    // ✏️ Edit Mode
    await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  } else {
    // ➕ Add New Mode
    updateData.createdAt = new Date();
    // টাইটেল থেকে সুন্দর URL Friendly Slug তৈরি
    updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    await db.collection("posts").insertOne(updateData);
  }

  await client.close();
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
}

// 📌 ব্লগ ডিলিট করার ফাংশন
export async function deleteBlogPost(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
  await client.close();

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
}