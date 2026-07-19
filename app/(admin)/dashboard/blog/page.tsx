import { MongoClient } from "mongodb";
import BlogClient from "./BlogClient";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPosts() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray();
  await client.close();
  
  return posts.map(post => ({
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    coverImage: post.coverImage,
    slug: post.slug,
    // 📌 SEO Data
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    seoKeywords: post.seoKeywords || "",
    // 📌 Advanced Data (Including Reading Time)
    status: post.status || "published",
    category: post.category || "Technology",
    tags: post.tags || [],
    readingTime: post.readingTime || "1 min read",
    createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
  }));
}

export default async function BlogAdminPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-10 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" /> Blog Studio Pro
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your content, set categories, save drafts, and optimize SEO all in one place.
        </p>
      </div>

      <BlogClient posts={posts} />
    </div>
  );
}