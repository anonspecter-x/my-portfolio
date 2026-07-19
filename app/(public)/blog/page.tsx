import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const revalidate = 60; // ISR

// 📌 স্ট্যাটিক পেজের এসইও এবং ক্যানোনিকাল ট্যাগ
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Blog & Articles | Md Nazmus Shakib",
    description: "Read the latest articles, tutorials, and thoughts on web development, MERN stack, Next.js, and software engineering by Md Nazmus Shakib.",
    keywords: "Web Development Blog, MERN Stack Tutorials, Next.js Guide, Software Engineering Articles",
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: "Blog & Articles | Md Nazmus Shakib",
      description: "Read the latest articles, tutorials, and thoughts on web development and software engineering.",
      url: `${siteUrl}/blog`,
    }
  };
}

async function getBlogData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // 📌 পোস্ট এবং সেটিংস একই সাথে ফেচ করা হচ্ছে
    const postsData = await db.collection("posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray();
    const settingsData = await db.collection("settings").findOne({});
    
    await client.close();
    
    const posts = postsData.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage || null,
      category: post.category || "Uncategorized",
      readingTime: post.readingTime || "1 min read",
      createdAtRaw: post.createdAt || new Date().toISOString(),
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : "Recently",
    }));

    // 📌 সেটিংস থেকে আপনার প্রোফাইল ডেটা নেওয়া হচ্ছে
    const authorInfo = {
      name: settingsData?.developerName || "Md Nazmus Shakib",
      role: settingsData?.developerRole || "Full Stack Developer",
      photo: settingsData?.developerPhoto || null,
      bio: settingsData?.seoDescription || "Dive into my latest thoughts, technical tutorials, and experiences as a Full Stack Developer building modern web applications."
    };

    return { posts, authorInfo };
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    return { posts: [], authorInfo: null };
  }
}

export default async function BlogPage() {
  const { posts, authorInfo } = await getBlogData();

  return <BlogClient posts={posts} authorInfo={authorInfo} />;
}