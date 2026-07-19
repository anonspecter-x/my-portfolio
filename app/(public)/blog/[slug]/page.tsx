import { MongoClient } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import type { Metadata } from "next";
import { cache } from "react";

export const revalidate = 60;

const getPost = cache(async (slug: string) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
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

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const [post, authorInfo] = await Promise.all([getPost(slug), getAuthorInfo()]);

  if (!post) {
    notFound(); 
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

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
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10 md:mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </Link>

      <article className="max-w-3xl mx-auto">
        
        {/* ================= 🌟 NEW UPDATED POST HEADER ================= */}
        <header className="mb-12 md:mb-16 text-center">
          
          {/* 1. Category Tag At Top */}
          <div className="flex justify-center mb-6">
            <span className="text-[12px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm">
              {post.category}
            </span>
          </div>
          
          {/* 2. Blog Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15] mb-8 max-w-4xl mx-auto">
            {post.title}
          </h1>

          {/* 3. Sleek Author & Meta Data Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
            
            {/* Author Section */}
            <div className="flex items-center gap-3">
              {authorInfo?.photo ? (
                <img src={authorInfo.photo} alt={authorInfo.name} className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-800 shadow-sm" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div className="text-left leading-tight">
                <p className="text-[15px] font-bold text-gray-900 dark:text-white">{authorInfo?.name}</p>
                <p className="text-[13px] font-medium text-gray-500 mt-0.5">{authorInfo?.role}</p>
              </div>
            </div>

            {/* Separator Dot (Hidden on mobile) */}
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>

            {/* Date & Read Time Section */}
            <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#111] px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
              <time dateTime={post.rawCreatedAt} className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> {post.createdAt}
              </time>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" /> {post.readingTime}
              </span>
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