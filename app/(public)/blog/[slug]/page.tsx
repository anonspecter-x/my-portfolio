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
      // 📌 Raw Dates for Schema & UI
      rawCreatedAt: post.createdAt,
      rawUpdatedAt: post.updatedAt || post.createdAt,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: `${post.seoTitle} | Md Nazmus Shakib`,
    description: post.seoDescription,
    keywords: post.seoKeywords,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.rawCreatedAt ? new Date(post.rawCreatedAt).toISOString() : undefined,
      modifiedTime: post.rawUpdatedAt ? new Date(post.rawUpdatedAt).toISOString() : undefined,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  // 📌 Google JSON-LD Schema (এসইও-এর জন্য কাস্টম পাবলিশ ডেট গুগলকে বোঝানোর জন্য)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`
    },
    "headline": post.seoTitle,
    "description": post.seoDescription,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.rawCreatedAt ? new Date(post.rawCreatedAt).toISOString() : new Date().toISOString(),
    "dateModified": post.rawUpdatedAt ? new Date(post.rawUpdatedAt).toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Md Nazmus Shakib",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Md Nazmus Shakib",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png` // আপনার সাইটের লোগো ইউআরএল দিতে পারেন
      }
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto">
      
      {/* 📌 Injecting Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </Link>

      <article className="max-w-3xl mx-auto">
        
        {/* Post Header */}
        <header className="mb-12 md:mb-16 text-center">
          <div className="flex justify-center items-center flex-wrap gap-4 text-[13px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-6">
            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3.5 py-1.5 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] px-3.5 py-1.5 rounded-full">
              <Calendar className="w-4 h-4" /> {post.createdAt}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] px-3.5 py-1.5 rounded-full">
              <Clock className="w-4 h-4" /> {post.readingTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15] mb-8">
            {post.title}
          </h1>
        </header>

        {/* Cover Image (16:9 Aspect Ratio) */}
        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 md:mb-16 border border-gray-200 dark:border-gray-800 shadow-lg">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 📌 Rich Text Content Render */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* 📌 Tags Section */}
        {post.tags.length > 0 && (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-gray-50 hover:bg-gray-100 dark:bg-[#111] dark:hover:bg-[#222] text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors cursor-pointer">
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