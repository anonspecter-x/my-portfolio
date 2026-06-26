"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2";

// 📌 Global Settings Update korar function
export async function updateSettings(formData: FormData) {
  const data: any = {
    developerName: formData.get("developerName") as string,
    developerRole: formData.get("developerRole") as string,
    developerEmail: formData.get("developerEmail") as string,
    developerPhone: formData.get("developerPhone") as string,
    developerRegion: formData.get("developerRegion") as string,
    footerDescription: formData.get("footerDescription") as string, // 📌 নতুন ফিল্ড: Footer Description
    seoTitle: formData.get("seoTitle") as string,
    seoDescription: formData.get("seoDescription") as string,
    seoKeywords: formData.get("seoKeywords") as string,
    updatedAt: new Date(),
  };

  // 📌 Social Media Links & Visibility Handle
  const socialPlatforms = [
    "github", "linkedin", "twitter", "whatsapp", 
    "youtube", "facebook", "instagram"
  ];
  
  socialPlatforms.forEach(platform => {
    const linkKey = `social_${platform}`;
    const visibilityKey = `social_${platform}_visible`;
    
    // লিংক সেভ করা
    data[linkKey] = formData.get(linkKey) as string || "";
    
    // চেকবক্স যদি অন থাকে তাহলে "true" আসবে, অফ থাকলে formData-তে আসবে না তাই "false" সেভ হবে
    data[visibilityKey] = formData.get(visibilityKey) === "true" ? "true" : "false";
  });

  const developerPhoto = formData.get("developerPhoto") as File;
  const siteLogo = formData.get("siteLogo") as File;
  const siteFavicon = formData.get("siteFavicon") as File; // 📌 Favicon ফিল্ড যুক্ত করা হলো

  if (developerPhoto && developerPhoto.size > 0) {
    const photoUrl = await uploadFileToR2(developerPhoto, "settings");
    data.developerPhoto = photoUrl;
  }

  if (siteLogo && siteLogo.size > 0) {
    const logoUrl = await uploadFileToR2(siteLogo, "settings");
    data.siteLogo = logoUrl;
  }

  // 📌 Favicon R2 তে আপলোড করার লজিক
  if (siteFavicon && siteFavicon.size > 0) {
    const faviconUrl = await uploadFileToR2(siteFavicon, "settings");
    data.siteFavicon = faviconUrl;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("settings").updateOne({}, { $set: data }, { upsert: true });
  await client.close();
  
  revalidatePath("/dashboard/settings");
  revalidatePath("/");
}

// 📌 1. Noutun Music Track Upload korar function
export async function addMusicTrack(formData: FormData) {
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const coverFile = formData.get("cover") as File;
  const audioFile = formData.get("audio") as File;

  if (!title || !artist || !audioFile || audioFile.size === 0) {
    throw new Error("Title, Artist and Audio file are required.");
  }

  let coverUrl = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop"; // Default cover
  let audioUrl = "";

  // Cover image upload hole R2-te jabe
  if (coverFile && coverFile.size > 0) {
    coverUrl = await uploadFileToR2(coverFile, "music/covers");
  }

  // Audio MP3 file upload hole R2-te jabe
  if (audioFile && audioFile.size > 0) {
    audioUrl = await uploadFileToR2(audioFile, "music/audio");
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("tracks").insertOne({
    title,
    artist,
    cover: coverUrl,
    audioUrl,
    createdAt: new Date()
  });

  await client.close();

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
}

// 📌 2. Music Track Delete korar function
export async function deleteMusicTrack(id: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  await db.collection("tracks").deleteOne({ _id: new ObjectId(id) });
  await client.close();

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
}