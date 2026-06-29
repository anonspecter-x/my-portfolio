"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2";

const uri = process.env.MONGODB_URI as string;

// 📌 ১. নতুন টেস্টিমোনিয়াল অ্যাড করা
export async function addTestimonial(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const review = formData.get("review") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const priority = parseInt(formData.get("priority") as string) || 0;
  const photoFile = formData.get("photo") as File;

  if (!name || !review) {
    throw new Error("Name and Review are required.");
  }

  let photoUrl = "";
  if (photoFile && photoFile.size > 0) {
    photoUrl = await uploadFileToR2(photoFile, "testimonials");
  }

  const client = await MongoClient.connect(uri);
  const db = client.db();
  
  await db.collection("testimonials").insertOne({
    name,
    role,
    review,
    rating,
    priority,
    photoUrl,
    approved: true, // 📌 অ্যাডমিন প্যানেল থেকে অ্যাড করলে সরাসরি লাইভ হবে
    createdAt: new Date()
  });

  await client.close();
  revalidatePath("/dashboard/testimonials");
}

// 📌 ২. টেস্টিমোনিয়াল আপডেট করা (R2 থেকে পুরনো ছবি রিমুভ সহ)
export async function updateTestimonial(id: string, formData: FormData) {
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const collection = db.collection("testimonials");

  const existingTestimonial = await collection.findOne({ _id: new ObjectId(id) });
  if (!existingTestimonial) throw new Error("Testimonial not found");

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const review = formData.get("review") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const priority = parseInt(formData.get("priority") as string) || 0;
  const photoFile = formData.get("photo") as File;

  let photoUrl = existingTestimonial.photoUrl;

  // নতুন ছবি আপলোড হলে আগের ছবি ডিলিট করা হবে
  if (photoFile && photoFile.size > 0) {
    if (existingTestimonial.photoUrl) {
      await deleteFileFromR2(existingTestimonial.photoUrl);
    }
    photoUrl = await uploadFileToR2(photoFile, "testimonials");
  }

  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        role,
        review,
        rating,
        priority,
        photoUrl,
        updatedAt: new Date()
      }
    }
  );

  await client.close();
  revalidatePath("/dashboard/testimonials");
}

// 📌 ৩. টেস্টিমোনিয়াল ডিলিট করা (R2 থেকে ছবি রিমুভ সহ)
export async function deleteTestimonial(id: string) {
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const collection = db.collection("testimonials");

  const existingTestimonial = await collection.findOne({ _id: new ObjectId(id) });
  
  if (existingTestimonial) {
    if (existingTestimonial.photoUrl) {
      await deleteFileFromR2(existingTestimonial.photoUrl);
    }
    await collection.deleteOne({ _id: new ObjectId(id) });
  }

  await client.close();
  revalidatePath("/dashboard/testimonials");
}

// 📌 ৪. নতুন অ্যাকশন: পাবলিক পেজ থেকে আসা পেন্ডিং রিভিউ এপ্রুভ করা
export async function approveTestimonial(id: string) {
  const client = await MongoClient.connect(uri);
  const db = client.db();
  
  await db.collection("testimonials").updateOne(
    { _id: new ObjectId(id) },
    { $set: { approved: true, priority: 0 } } // এপ্রুভ হওয়ার পর ডিফল্ট প্রায়োরিটি ০ থাকবে
  );

  await client.close();
  revalidatePath("/dashboard/testimonials");
}