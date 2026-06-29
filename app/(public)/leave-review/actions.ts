"use server";

import { MongoClient } from "mongodb";
// 📌 R2 আপলোডারটি ইমপোর্ট করুন (আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী)
import { uploadFileToR2 } from "@/lib/r2"; 

export async function submitPublicReview(formData: FormData) {
  // 1. Extract Turnstile Token
  const turnstileToken = formData.get("cf-turnstile-response") as string;
  
  if (!turnstileToken) {
    throw new Error("Security verification failed. Please check the CAPTCHA.");
  }

  // 2. Validate Turnstile Token
  const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secretKey = process.env.TURNSTILE_SECRET_KEY; 

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

  if (!name || !review || isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Invalid input data provided.");
  }

  // 📌 4. Handle Image Upload (FIXED)
  let photoUrl = "";
  if (photoFile && photoFile.size > 0) {
    // এখানে আপনার আসল R2 ফাংশনটি কল করা হলো
    photoUrl = await uploadFileToR2(photoFile, "testimonials");
  }

  // 5. Save to MongoDB Securely
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  try {
    await db.collection("testimonials").insertOne({
      name,
      role: role || "Client",
      review,
      rating,
      priority: 0,
      photoUrl, // 📌 এখন আসল URL ডেটাবেজে সেভ হবে
      approved: false, 
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