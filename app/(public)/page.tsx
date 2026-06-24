import { MongoClient } from "mongodb";
import HomeClient from "./HomeClient";

// প্রতি ৬০ সেকেন্ডে ডাটা আপডেট হবে (ISR), তাই ওয়েবসাইট সুপারফাস্ট থাকবে
export const revalidate = 60; 

async function getPageData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // 📌 ১. ডাটাবেজ থেকে প্রজেক্টগুলো আনা হচ্ছে
    const rawProjects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    
    // 📌 ২. ডাটাবেজ থেকে সেটিংস আনা হচ্ছে
    const settingsData = await db.collection("settings").findOne({});

    await client.close();

    // প্রজেক্টগুলো ফরম্যাট করা
    const formattedProjects = rawProjects.map((p) => {
      let techArray: string[] = [];
      if (Array.isArray(p.tech)) {
        techArray = p.tech;
      } else if (typeof p.tech === 'string') {
        techArray = p.tech.split(',').map((t: string) => t.trim());
      }

      return {
        id: p._id.toString(),
        title: p.title || "Untitled Project",
        description: p.description || "",
        tech: techArray,
        link: p.link || "#",
      };
    });

    // 📌 সেটিংস ফরম্যাট করা (যাতে Client Component এ পাস করা যায়)
    const formattedSettings = settingsData ? {
      developerName: settingsData.developerName || "Nazmus Shakib",
      developerRole: settingsData.developerRole || "Full Stack Developer",
    } : null;

    return { projects: formattedProjects, settings: formattedSettings };

  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { projects: [], settings: null };
  }
}

export default async function Home() {
  const { projects, settings } = await getPageData();

  // 📌 ডাটাগুলো ক্লায়েন্ট কম্পোনেন্টে পাস করা হচ্ছে
  return <HomeClient realProjects={projects} settings={settings} />;
}