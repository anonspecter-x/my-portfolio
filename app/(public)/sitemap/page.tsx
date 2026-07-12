import { MongoClient } from "mongodb";
import type { Metadata } from "next"; 
import SitemapClient from "./SitemapClient";

export const revalidate = 60; // ISR - 60s cache

// 📌 স্ট্যাটিক পেজের এসইও এবং ক্যানোনিকাল ট্যাগ
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Sitemap | Md Nazmus Shakib",
    description: "Visual sitemap to easily navigate through all pages, projects, and blog posts on meetsakib.com.",
    alternates: {
      canonical: `${siteUrl}/sitemap`,
    }
  };
}

async function getVisualSitemapData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined. Check your environment variables.");
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // 📌 ডাটাবেস থেকে শুধু UI এর জন্য প্রয়োজনীয় ফিল্ডগুলো (title, slug) ফেচ করা হচ্ছে
    const projectsData = await db.collection("projects").find({}).project({ title: 1, slug: 1 }).sort({ createdAt: -1 }).toArray();
    const postsData = await db.collection("posts").find({}).project({ title: 1, slug: 1 }).sort({ createdAt: -1 }).toArray();
    
    await client.close();
    
    return {
      projects: projectsData.map(p => ({
        title: p.title || "Untitled Project",
        slug: p.slug || "",
      })),
      posts: postsData.map(p => ({
        title: p.title || "Untitled Post",
        slug: p.slug || "",
      }))
    };
  } catch (error) {
    console.error("❌ Database Fetch Error in Visual Sitemap:", error);
    return { projects: [], posts: [] };
  }
}

export default async function VisualSitemapPage() {
  const { projects, posts } = await getVisualSitemapData();

  return <SitemapClient projects={projects} posts={posts} />;
}