import { MongoClient } from "mongodb";
import HomeClient from "./HomeClient";

// প্রতি ৬০ সেকেন্ডে ডাটা আপডেট হবে (ISR), তাই ওয়েবসাইট সুপারফাস্ট থাকবে
export const revalidate = 60; 

async function getRealProjects() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // ডাটাবেজের 'projects' কালেকশন থেকে সব প্রজেক্ট আনা হচ্ছে (নতুনগুলো আগে)
    const rawProjects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    await client.close();

    // ডাটাগুলো ফ্রন্টএন্ডের জন্য সুন্দরভাবে ফরম্যাট করা হচ্ছে
    return rawProjects.map((p) => {
      // যদি tech স্ট্রিং হিসেবে সেভ থাকে (যেমন: "React, Node"), তবে সেটাকে Array করা হচ্ছে
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
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getRealProjects();

  // ডাটাগুলো ক্লায়েন্ট কম্পোনেন্টে পাস করা হচ্ছে
  return <HomeClient realProjects={projects} />;
}