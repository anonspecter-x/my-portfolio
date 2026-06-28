import { MongoClient } from "mongodb";
import type { Metadata } from "next"; 
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60; // ISR - 60s cache

// 📌 স্ট্যাটিক পেজের এসইও এবং ক্যানোনিকাল ট্যাগ (For Projects List Page)
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Projects & Selected Works | Md Nazmus Shakib",
    description: "Explore a curated collection of my recent web development projects, side projects, SaaS applications, and open-source contributions.",
    keywords: "Web Development Projects, MERN Stack Portfolio, Next.js Apps, SaaS Projects",
    alternates: {
      canonical: `${siteUrl}/projects`,
    },
    openGraph: {
      title: "Projects & Selected Works | Md Nazmus Shakib",
      description: "Explore a curated collection of my recent web development projects and SaaS applications.",
      url: `${siteUrl}/projects`,
    }
  };
}

async function getProjects() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const projects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    await client.close();
    
    return projects.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      tagline: p.tagline || "",
      slug: p.slug,
      description: p.description,
      image: p.image || null,
      category: p.category || "Project",
      year: p.year || new Date(p.createdAt).getFullYear().toString(),
      status: p.status || "Completed",
      tech: p.tech ? p.tech.slice(0, 4) : []
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}