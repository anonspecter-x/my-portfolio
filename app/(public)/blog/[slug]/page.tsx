import { MongoClient } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import { cache } from "react";

export const revalidate = 60;

// 📌 ডাটা ফেচিং ফাংশন (Next.js Cache ব্যবহার করা হলো যেন একই ডাটা দুবার কল না হয়)
const getPost = cache(async (slug: string) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    // 📌 শুধুমাত্র পাবলিশড পোস্ট খুঁজবে
    const post = await db.collection("posts").findOne({ slug, status: "published" });
    await client.close();
    
    if (!post) return null;

    return {
      title: post.title,
      content: post.content,
      coverImage: post.coverImage || null,
      category: post.category || "Uncategorized",
      readingTime: post.readingTime || "1 min read",
      tags: post.tags || [],
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || "",
      seoKeywords: post.seoKeywords || "",
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : "Recently",
    };
  } catch (error) {
    return null;
  }
});

// 📌 Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.seoTitle} | Md Nazmus Shakib`,
    description: post.seoDescription,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// 📌 Next.js App Router Page
export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound(); 
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto">
      
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </Link>

      <article className="max-w-3xl mx-auto">
        
        {/* Post Header */}
        <header className="mb-12 md:mb-16 text-center">
          <div className="flex justify-center items-center flex-wrap gap-4 text-xs font-bold tracking-wider uppercase text-gray-400 mb-6">
            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.createdAt}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readingTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-[1.15] mb-8">
            {post.title}
          </h1>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 md:mb-16 border border-gray-200 dark:border-gray-800 shadow-md">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 📌 Rich Text Content Render */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* 📌 Tags Section (if tags exist) */}
        {post.tags.length > 0 && (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-gray-100 dark:bg-[#111] text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </article>
      
    </main>
  );
}