import { MongoClient } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";

export const revalidate = 60;

// 📌 নির্দিষ্ট URL (slug) অনুযায়ী ডাটাবেজ থেকে পোস্ট আনা
async function getPost(slug: string) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const post = await db.collection("posts").findOne({ slug });
    await client.close();
    
    if (!post) return null;

    return post; // রিচ মেটাডাটার জন্য পুরো অবজেক্ট পাঠানো হলো
  } catch (error) {
    return null;
  }
}

// 📌 ডায়নামিক SEO মেটাডাটা জেনারেট করা (For Blogs)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const postUrl = `${siteUrl}/blog/${slug}`;
  
  // ধাপ ৪ এর জন্য এসইও ফিল্ডগুলো চেক করা হচ্ছে
  const seoTitle = post.seoTitle || post.title;
  const seoDesc = post.seoDescription || `Read ${post.title} by Md Nazmus Shakib.`;

  return {
    title: `${seoTitle} | Blog`,
    description: seoDesc,
    keywords: post.seoKeywords || "Next.js, Web Development, Programming",
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: postUrl,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const rawPost = await getPost(slug);

  if (!rawPost) {
    notFound(); 
  }

  // ডেট ফরম্যাট করা
  const formattedDate = rawPost.createdAt ? new Date(rawPost.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : "Recently published";

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
          <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-wider uppercase text-gray-400 mb-6">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-[1.15] mb-8">
            {rawPost.title}
          </h1>
        </header>

        {/* Cover Image (If available) */}
        {rawPost.coverImage && (
          <div className="w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 md:mb-16 border border-gray-200 dark:border-gray-800 shadow-md">
            <img src={rawPost.coverImage} alt={rawPost.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 📌 Rich Text Content Render */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: rawPost.content }} 
        />
        
      </article>
      
    </main>
  );
}