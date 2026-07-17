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

async function getHeavyTerminalData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // 📌 Fetching Everything Needed for a Realistic File System
    const rawProjects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    const rawPosts = await db.collection("posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray();
    const rawSkills = await db.collection("skills").find({}).sort({ percentage: -1 }).toArray();
    const rawCertificates = await db.collection("certificates").find({}).sort({ _id: 1 }).toArray();
    
    await client.close();
    
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
      }))
    };
  } catch (error) {
    console.error("Terminal Database Fetch Error:", error);
    return { projects: [], posts: [], skills: [], certificates: [] };
  }
}

export default async function TerminalPage() {
  const data = await getHeavyTerminalData();

  return <TerminalClient data={data} />;
}