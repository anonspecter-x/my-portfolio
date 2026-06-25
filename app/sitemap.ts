import { MetadataRoute } from 'next';
import { MongoClient } from 'mongodb';

// 📌 টাইপ ডিফাইন করা যাতে বিল্ড এরর না দেয়
interface DynamicRoute {
  slug: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.meetsakib.com';

  // 📌 টাইপ explicitly বলে দেওয়া হলো
  let projects: DynamicRoute[] = [];
  let posts: DynamicRoute[] = [];

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // ডাটাবেজ থেকে ডাটা আনা
    projects = await db.collection("projects").find({}).project({ slug: 1, updatedAt: 1, createdAt: 1 }).toArray() as DynamicRoute[];
    posts = await db.collection("posts").find({}).project({ slug: 1, updatedAt: 1, createdAt: 1 }).toArray() as DynamicRoute[];
    
    await client.close();
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
  }

  // ১. স্ট্যাটিক পেজগুলো 
  const staticRoutes = ['', '/about', '/projects', '/blog', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // ২. ডায়নামিক প্রজেক্ট পেজগুলো 
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || project.createdAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ৩. ডায়নামিক ব্লগ পেজগুলো
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}