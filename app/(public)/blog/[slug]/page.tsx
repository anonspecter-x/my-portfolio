import { MongoClient } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
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

// 📌 অথর (Settings) ডাটা ফেচিং ফাংশন
const getAuthorInfo = cache(async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();
    
    return {
      name: settings?.developerName || "Md Nazmus Shakib",
      role: settings?.developerRole || "Full Stack Developer",
      photo: settings?.developerPhoto || null,
      bio: settings?.footerDescription || settings?.seoDescription || "Dive into my latest thoughts, technical tutorials, and experiences as a Full Stack Developer building modern web applications."
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
  
  // 📌 সমান্তরালভাবে (Parallel) পোস্ট এবং অথর ডেটা ফেচ করা হচ্ছে পারফরম্যান্সের জন্য
  const [post, authorInfo] = await Promise.all([getPost(slug), getAuthorInfo()]);

  if (!post) {
    notFound(); 
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  // 📌 Google JSON-LD Schema (এসইও-এর জন্য কাস্টম স্কিমা)
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
      "name": authorInfo?.name || "Md Nazmus Shakib",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": authorInfo?.name || "Md Nazmus Shakib",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
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
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10 md:mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </Link>

      <article className="max-w-3xl mx-auto">
        
        {/* ================= 🌟 POST HEADER ================= */}
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center flex-wrap gap-4 text-[12px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-6">
            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3.5 py-1.5 rounded-full">
              {post.category}
            </span>
            <time dateTime={post.rawCreatedAt} className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] px-3.5 py-1.5 rounded-full">
              <Calendar className="w-4 h-4" /> {post.createdAt}
            </time>
            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] px-3.5 py-1.5 rounded-full">
              <Clock className="w-4 h-4" /> {post.readingTime}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15] mb-8">
            {post.title}
          </h1>

          {/* 👨‍💻 Top Author Info (Minimal) */}
          <div className="flex items-center justify-center gap-3">
            {authorInfo?.photo ? (
              <img src={authorInfo.photo} alt={authorInfo.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-bold text-black dark:text-white leading-none">{authorInfo?.name}</p>
              <p className="text-xs text-gray-500 mt-1">{authorInfo?.role}</p>
            </div>
          </div>
        </header>

        {/* ================= 📸 COVER IMAGE ================= */}
        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 border border-gray-200 dark:border-gray-800 shadow-lg">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* ================= 📝 RICH TEXT CONTENT ================= */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* ================= 🏷️ TAGS SECTION ================= */}
        {post.tags.length > 0 && (
          <div className="pt-8 flex items-start gap-3 mb-16">
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

        {/* ================= 👤 BOTTOM AUTHOR CARD ================= */}
        <div className="mt-8 p-6 md:p-8 rounded-3xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-sm">
          {authorInfo?.photo ? (
            <img src={authorInfo.photo} alt={authorInfo.name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white dark:border-[#111] shadow-md shrink-0" />
          ) : (
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-[#111] border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-md shrink-0">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              Written By
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-1">{authorInfo?.name}</h3>
            <p className="text-sm font-semibold text-gray-500 mb-4">{authorInfo?.role}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {authorInfo?.bio}
            </p>
            <Link href="/about" className="inline-block mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
              More about the author &rarr;
            </Link>
          </div>
        </div>

      </article>
      
    </main>
  );
}