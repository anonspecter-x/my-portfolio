import { MongoClient } from "mongodb";
import ProjectsClient from "./ProjectsClient";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProjects() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  const projects = await db.collection("projects").find().sort({ createdAt: -1 }).toArray();
  await client.close();
  
  return projects.map((p) => ({ 
    _id: p._id.toString(),
    title: p.title,
    tagline: p.tagline, // 📌 Added tagline
    slug: p.slug,
    description: p.description,
    content: p.content,
    features: p.features, // 📌 Added features
    tech: p.tech,
    liveLink: p.liveLink,
    githubLink: p.githubLink,
    image: p.image,
    // 📌 Added all new meta & tech stack fields
    category: p.category,
    year: p.year,
    clientName: p.clientName,
    role: p.role,
    status: p.status,
    frontend: p.frontend,
    backend: p.backend,
    tools: p.tools,
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-10 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-500" /> Project Studio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add deep-dive case studies, screenshots, and details for your portfolio projects.
        </p>
      </div>

      <ProjectsClient projects={projects} />
    </div>
  );
}