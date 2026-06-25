import { MongoClient } from "mongodb";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Sparkles } from "lucide-react";
import type { Metadata } from "next"; // 📌 মেটাডাটা ইমপোর্ট করা হলো

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
      tagline: p.tagline || "", // 📌 Added Tagline
      slug: p.slug,
      description: p.description,
      image: p.image || null,
      category: p.category || "Project",
      year: p.year || new Date(p.createdAt).getFullYear().toString(),
      status: p.status || "Completed", // 📌 Added Status
      tech: p.tech ? p.tech.slice(0, 4) : [] // 📌 Fetching max 4 tech stacks for preview
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto">
      
      {/* 📌 Header */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <Briefcase className="w-3.5 h-3.5" /> Selected Works
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Crafting digital <span className="text-gray-400">experiences</span> that matter.
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          A collection of my recent work, side projects, and open-source contributions.
        </p>
      </div>

      {/* 📌 Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <Link 
              key={project._id} 
              href={`/projects/${project.slug}`}
              className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* --- Cover Image --- */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gray-50 dark:bg-[#050505] relative overflow-hidden border-b border-gray-200 dark:border-gray-800 p-6 md:p-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-xl shadow-lg group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-800" />
                  </div>
                )}
                {/* Status Badge (Top Left) */}
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{project.status}</span>
                </div>
                {/* Arrow Icon (Top Right) */}
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 z-20">
                  <ArrowUpRight className="w-5 h-5 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              {/* --- Content --- */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-[#111] px-2 py-1 rounded border border-gray-200 dark:border-gray-800">{project.year}</span>
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  {project.title}
                </h2>
                
                {project.tagline && (
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wide">
                    {project.tagline}
                  </p>
                )}
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* --- Tech Stack Preview (Footer of Card) --- */}
                {project.tech && project.tech.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800/60 flex items-center gap-2 flex-wrap">
                    {project.tech.map((t: string, i: number) => (
                      <span key={i} className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                    {project.tech.length === 4 && (
                      <span className="text-[10px] font-bold text-gray-400 px-1">+ more</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#111]/50">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No projects published yet.</p>
        </div>
      )}

    </main>
  );
}