import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import TerminalClient from "./TerminalClient";

export const revalidate = 60; // ISR - 60s cache

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: "Terminal Console | Md Nazmus Shakib",
    description: "Advanced interactive command-line interface to explore the digital ecosystem, projects, and skills of Md Nazmus Shakib.",
    keywords: [
      "Terminal Portfolio",
      "Command Line Interface",
      "Interactive Developer Portfolio",
      "Md Nazmus Shakib"
    ],
    alternates: {
      canonical: `${siteUrl}/terminal`,
    }
  };
}

// 📌 MongoDB Connection Caching for better performance
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (cachedClient) return cachedClient.db();
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  return client.db();
}

async function getHeavyTerminalData() {
  try {
    const db = await getDb();
    
    // 📌 Fetching Everything Needed for a Realistic File System
    const [rawProjects, rawPosts, rawSkills, rawCertificates, rawBrands, rawTestimonials] = await Promise.all([
      db.collection("projects").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray(),
      db.collection("skills").find({}).sort({ percentage: -1 }).toArray(),
      db.collection("certificates").find({}).sort({ _id: 1 }).toArray(),
      db.collection("brands").find({}).sort({ _id: 1 }).toArray(),
      db.collection("testimonials").find({}).sort({ _id: 1 }).toArray()
    ]);
    
    return {
      projects: rawProjects.map(p => ({
        slug: p.slug || p._id.toString(),
        title: p.title,
        tech: p.tech || [],
        description: p.description
      })),
      posts: rawPosts.map(p => ({
        slug: p.slug || p._id.toString(),
        title: p.title,
        category: p.category || "Uncategorized"
      })),
      skills: rawSkills.map(s => ({
        name: s.name,
        percentage: s.percentage
      })),
      certificates: rawCertificates.map(c => ({
        title: c.title,
        issuer: c.issuerName
      })),
      brands: rawBrands.map(b => ({
        name: b.name,
        website: b.website
      })),
      testimonials: rawTestimonials.map(t => ({
        name: t.name,
        role: t.role,
        review: t.review
      }))
    };
  } catch (error) {
    console.error("Terminal Database Fetch Error:", error);
    return { projects: [], posts: [], skills: [], certificates: [], brands: [], testimonials: [] };
  }
}

export default async function TerminalPage() {
  const data = await getHeavyTerminalData();

  return <TerminalClient data={data} />;
}