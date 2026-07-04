import { MongoClient } from "mongodb";
import type { Metadata } from "next"; 
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60; // ISR - 60s cache

// 📌 স্ট্যাটিক পেজের এসইও এবং ক্যানোনিকাল ট্যাগ
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Projects & Selected Works | Md Nazmus Shakib",
    description: "Explore a curated collection of my recent web development projects, side projects, SaaS applications, and open-source contributions.",
    keywords: "Web Development Projects, MERN Stack Portfolio, Next.js Apps, SaaS Projects",
    alternates: {
      canonical: `${siteUrl}/projects`,
    },
    openGraph: {
      title: "Projects & Selected Works | Md Nazmus Shakib",
      description: "Explore a curated collection of my recent web development projects and SaaS applications.",
      url: `${siteUrl}/projects`,
    }
  };
}

async function getProjects() {
  try {
    // 📌 চেক করা হচ্ছে MONGODB_URI ঠিকমতো পাচ্ছে কি না
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined. Check your environment variables.");
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // 📌 ডাটাবেস থেকে ডেটা ফেচ করা
    const projectsData = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    await client.close();
    
    // 📌 ডাটা সিকিউরলি ম্যাপ করা (যাতে কোনো ফিল্ড মিসিং থাকলেও ক্র্যাশ না করে)
    return projectsData.map(p => ({
      _id: p._id.toString(),
      title: p.title || "Untitled Project",
      tagline: p.tagline || "",
      slug: p.slug || "",
      description: p.description || "",
      image: p.image || null,
      category: p.category || "Project",
      year: p.year || (p.createdAt ? new Date(p.createdAt).getFullYear().toString() : new Date().getFullYear().toString()),
      status: p.status || "Completed",
      tech: Array.isArray(p.tech) ? p.tech.slice(0, 4) : []
    }));
  } catch (error) {
    // 📌 ডাটাবেসে সমস্যা হলে টার্মিনালে এরর প্রিন্ট করবে, ফলে আপনি বুঝতে পারবেন কেন প্রজেক্ট দেখাচ্ছে না।
    console.error("❌ Database Fetch Error in ProjectsPage:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}