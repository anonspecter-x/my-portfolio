"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2";

export async function saveBlogPost(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as File;
    
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoKeywords = formData.get("seoKeywords") as string;

    // 📌 নতুন যুক্ত হওয়া ফিল্ডগুলো
    const status = formData.get("status") as string || "published";
    const category = formData.get("category") as string || "Uncategorized";
    const tagsString = formData.get("tags") as string || "";
    const tags = tagsString.split(",").map(tag => tag.trim()).filter(Boolean); // কমা দিয়ে ট্যাগ আলাদা করা

    // 📌 কাস্টম পাবলিশ ডেট রিসিভ করা (অ্যাডমিন প্যানেল থেকে)
    const customCreatedAt = formData.get("createdAt") as string;
    const createdAtDate = customCreatedAt ? new Date(customCreatedAt) : new Date();

    // 📌 টোটাল ভিউ টাইম রিসিভ করা (অ্যাডমিন প্যানেল থেকে)
    const totalViewTime = Number(formData.get("totalViewTime")) || 0;

    if (!title || !content) {
      throw new Error("Title and Content are required.");
    }

    // ⏱️ Reading Time Calculation (HTML ট্যাগ রিমুভ করে ওয়ার্ড কাউন্ট)
    const plainText = content.replace(/<[^>]*>?/gm, '');
    const wordCount = plainText.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    let updateData: any = { 
      title, 
      content, 
      seoTitle,          
      seoDescription,    
      seoKeywords,
      status,
      category,
      tags,
      readingTime,
      totalViewTime, // 📌 ডাটাবেসে সেভ করার জন্য অ্যাড করা হলো
      createdAt: createdAtDate, // 📌 কাস্টম ডেট এখানে অ্যাড করা হলো
      updatedAt: new Date() 
    };

    if (coverImage && coverImage.size > 0) {
      const imageUrl = await uploadFileToR2(coverImage, "blog-covers");
      updateData.coverImage = imageUrl;
    }

    if (id) {
      await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } else {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await db.collection("posts").insertOne(updateData);
    }

    await client.close();
    revalidatePath("/dashboard/blog");
    revalidatePath("/blog");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving blog post:", error);
    throw new Error("Failed to save post");
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    await client.close();

    revalidatePath("/dashboard/blog");
    revalidatePath("/blog");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw new Error("Failed to delete post");
  }
}