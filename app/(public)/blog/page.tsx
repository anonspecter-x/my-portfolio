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
    
    // 📌 শুধুমাত্র পাবলিশড পোস্টগুলো আনা হচ্ছে এবং ডেট অনুযায়ী সর্ট করা হচ্ছে
    const posts = await db.collection("posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray();
    
    // 📌 সেটিংস থেকে ডেভেলপারের প্রোফাইল ইনফরমেশন ফেচ করা হচ্ছে
    const settings = await db.collection("settings").findOne({});
    
    await client.close();
    
    const formattedPosts = posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage || null,
      category: post.category || "Uncategorized",
      readingTime: post.readingTime || "1 min read",
      // 📌 কাস্টম ডেট ফরম্যাট করা হচ্ছে
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : "Recently",
    }));

    // 📌 প্রোফাইল অবজেক্ট তৈরি
    const authorProfile = {
      name: settings?.developerName || "Md Nazmus Shakib",
      role: settings?.developerRole || "Full Stack Developer",
      photo: settings?.developerPhoto || "",
      description: settings?.seoDescription || "Read my latest articles, tutorials, and thoughts on modern web development.",
    };

    return { posts: formattedPosts, authorProfile };
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    return { posts: [], authorProfile: null };
  }
}

export default async function BlogPage() {
  const { posts, authorProfile } = await getBlogData();

  return <BlogClient posts={posts} authorProfile={authorProfile} />;
}