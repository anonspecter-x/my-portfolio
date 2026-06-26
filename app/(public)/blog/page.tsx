import { MongoClient } from "mongodb";
import Link from "next/link";
import { ArrowUpRight, Calendar, BookOpen, Clock } from "lucide-react";
import type { Metadata } from "next";

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

async function getPosts() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    // 📌 শুধুমাত্র পাবলিশড পোস্টগুলো আনা হচ্ছে
    const posts = await db.collection("posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray();
    await client.close();
    
    return posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage || null,
      category: post.category || "Uncategorized", // 📌 নতুন ফিল্ড
      readingTime: post.readingTime || "1 min read", // 📌 নতুন ফিল্ড
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : "Recently",
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto">
      
      {/* 📌 Header */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <BookOpen className="w-3.5 h-3.5" /> Thoughts & Insights
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Writing about <span className="text-gray-400">code, design,</span> and building products.
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Dive into my latest articles, tutorials, and experiences as a Full Stack Developer.
        </p>
      </div>

      {/* 📌 Blog List Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link 
              key={post._id} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-[#111] relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <ArrowUpRight className="w-4 h-4 text-black dark:text-white" />
                </div>
                {/* 📌 Category Badge Over Image */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[11px] font-bold tracking-wider uppercase text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.createdAt}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles published yet. Check back soon!</p>
        </div>
      )}

    </main>
  );
}