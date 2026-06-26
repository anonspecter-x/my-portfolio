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

    if (!title || !content) {
      throw new Error("Title and Content are required.");
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    let updateData: any = { 
      title, 
      content, 
      seoTitle,          
      seoDescription,    
      seoKeywords,       
      updatedAt: new Date() 
    };

    if (coverImage && coverImage.size > 0) {
      const imageUrl = await uploadFileToR2(coverImage, "blog-covers");
      updateData.coverImage = imageUrl;
    }

    if (id) {
      await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } else {
      updateData.createdAt = new Date();
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