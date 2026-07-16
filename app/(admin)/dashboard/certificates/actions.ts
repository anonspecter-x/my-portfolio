"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2"; // 📌 আপনার R2 ডিলিট ফাংশন এখানে ইম্পোর্ট করবেন

// 📌 সার্টিফিকেট সেভ এবং আপডেট করার ফাংশন
export async function saveCertificate(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const issuerName = formData.get("issuerName") as string;
  const credentialUrl = formData.get("credentialUrl") as string;

  if (!title || !issuerName) {
    throw new Error("Certificate Title and Issuer Name are required.");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  let existingCertificate: any = null;
  if (id) {
    existingCertificate = await db.collection("certificates").findOne({ _id: new ObjectId(id) });
  }

  const data: any = {
    title,
    issuerName,
    credentialUrl: credentialUrl || "",
    updatedAt: new Date(),
  };

  const issuerLogoFile = formData.get("issuerLogo") as File;
  const certificateImageFile = formData.get("certificateImage") as File;

  // 📌 ১. Issuer Logo Upload & Old File Deletion Logic
  if (issuerLogoFile && issuerLogoFile.size > 0) {
    // আগের লোগো থাকলে সেটা R2 (Cloudflare) থেকে ডিলিট হবে
    if (existingCertificate?.issuerLogo) {
      await deleteFileFromR2(existingCertificate.issuerLogo);
    }
    const logoUrl = await uploadFileToR2(issuerLogoFile, "certificates/logos");
    data.issuerLogo = logoUrl;
  }

  // 📌 ২. Certificate Main Image Upload & Old File Deletion Logic
  if (certificateImageFile && certificateImageFile.size > 0) {
    // আগের মেইন ছবি থাকলে সেটা R2 (Cloudflare) থেকে ডিলিট হবে
    if (existingCertificate?.certificateImage) {
      await deleteFileFromR2(existingCertificate.certificateImage);
    }
    const imageUrl = await uploadFileToR2(certificateImageFile, "certificates/images");
    data.certificateImage = imageUrl;
  }

  // 📌 ডাটাবেজ অপারেশন
  if (id) {
    await db.collection("certificates").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  } else {
    data.createdAt = new Date();
    await db.collection("certificates").insertOne(data);
  }

  await client.close();

  // ক্যাশ ক্লিয়ার করা যাতে ফ্রন্টএন্ডে সাথে সাথে আপডেট দেখায়
  revalidatePath("/dashboard/certificates");
  revalidatePath("/"); // পাবলিক পেজের ক্যাশ রিলিজের জন্য
}

// 📌 ৩. সার্টিফিকেট ডিলিট করার সম্পূর্ণ ফাংশন (R2 ক্লিয়ারেন্স সহ)
export async function deleteCertificate(id: string) {
  if (!id) return;

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();

  // প্রথমে ডাটাবেজ থেকে ফাইলগুলোর URL খুঁজে বের করা
  const certificate = await db.collection("certificates").findOne({ _id: new ObjectId(id) });

  if (certificate) {
    // ক্লাউডফ্লেয়ার R2 থেকে লোগো ডিলিট
    if (certificate.issuerLogo) {
      await deleteFileFromR2(certificate.issuerLogo);
    }
    // ক্লাউডফ্লেয়ার R2 থেকে মেইন সার্টিফিকেট ইমেজ ডিলিট
    if (certificate.certificateImage) {
      await deleteFileFromR2(certificate.certificateImage);
    }

    // সবশেষে ডাটাবেজ থেকে ডকুমেন্ট ডিলিট
    await db.collection("certificates").deleteOne({ _id: new ObjectId(id) });
  }

  await client.close();

  revalidatePath("/dashboard/certificates");
  revalidatePath("/");
}