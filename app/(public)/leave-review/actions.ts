"use server";

import { MongoClient } from "mongodb";
// আপনার যদি S3 বা R2 আপলোডের আলাদা ইউটিলিটি থাকে, তবে সেটি ইমপোর্ট করে নিন। 
// উদাহরণস্বরূপ: import { uploadToR2 } from "@/lib/r2";

export async function submitPublicReview(formData: FormData) {
  // 1. Extract Turnstile Token
  const turnstileToken = formData.get("cf-turnstile-response") as string;
  
  if (!turnstileToken) {
    throw new Error("Security verification failed. Please check the CAPTCHA.");
  }

  // 2. Validate Turnstile Token with Cloudflare
  const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secretKey = process.env.TURNSTILE_SECRET_KEY; // .env.local থেকে আসবে

  const verificationResponse = await fetch(verifyEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${turnstileToken}`,
  });

  const verificationResult = await verificationResponse.json();

  if (!verificationResult.success) {
    throw new Error("Bot activity detected. Verification failed.");
  }

  // 3. Extract and Validate Form Data
  const name = (formData.get("name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const review = (formData.get("review") as string)?.trim();
  const rating = parseInt(formData.get("rating") as string, 10);
  const photoFile = formData.get("photo") as File;

  // Basic Server-Side Validation (Prevents malicious empty inputs)
  if (!name || !review || isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Invalid input data provided.");
  }

  // 4. Handle Image Upload (Cloudflare R2 / AWS S3)
  let photoUrl = "";
  if (photoFile && photoFile.size > 0) {
    // 📌 আপনার সার্ভারের ইমেজ আপলোডের লজিক এখানে বসাবেন
    // উদাহরণস্বরূপ:
    // const buffer = Buffer.from(await photoFile.arrayBuffer());
    // photoUrl = await uploadToR2(buffer, `reviews/${uuidv4()}-${photoFile.name}`);
    
    photoUrl = "https://your-cdn.com/placeholder.jpg"; // আপলোডের পর পাওয়া URL এখানে বসবে
  }

  // 5. Save to MongoDB Securely
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  try {
    await db.collection("testimonials").insertOne({
      name,
      role: role || "Client", // Optional fallback
      review,
      rating,
      priority: 0, // ডিফল্ট 0, যাতে আপনি পরে এডমিন প্যানেল থেকে প্রায়োরিটি সেট করতে পারেন
      photoUrl,
      approved: false, // 📌 সিকিউরিটির জন্য ডিফল্টভাবে 'false' রাখতে পারেন, যেন এডমিন এপ্রুভ করার আগে লাইভ না হয়
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to submit review.");
  } finally {
    await client.close();
  }

  return { success: true };
}