import { MongoClient } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  ArrowLeft, Code2, Layers, Wrench, BarChart2, 
  ExternalLink, GitBranch, Zap, Info 
} from "lucide-react";

export const revalidate = 60;

async function getProject(slug: string) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const project = await db.collection("projects").findOne({ slug });
    await client.close();
    
    if (!project) return null;
    return project;
  } catch (error) {
    return null;
  }
}

// 📌 ডায়নামিক SEO মেটাডাটা জেনারেট করা (For Projects)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meetsakib.com";
  const projectUrl = `${siteUrl}/projects/${slug}`;

  return {
    title: `${project.title} | Md Nazmus Shakib`,
    description: project.description,
    alternates: {
      canonical: projectUrl, // গুগলের ডুপ্লিকেট ইস্যু ফিক্স
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: projectUrl,
      type: "article",
      images: project.image ? [{ url: project.image, width: 1200, height: 630, alt: project.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  // Features string কে Array তে কনভার্ট করা (যদি থাকে)
  const featuresArray = project.features 
    ? project.features.split('\n').filter((f: string) => f.trim() !== '')
    : [];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto selection:bg-blue-500/30">
      
      {/* 📌 Navigation: Back Button */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12 group w-fit">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        Back to Portfolio
      </Link>

      {/* 📌 Hero Header Section */}
      <header className="mb-16">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md border border-blue-100 dark:border-blue-900/30">
            {project.category || "PROJECT"}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 dark:bg-[#111] px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800">
            {project.year || new Date(project.createdAt).getFullYear()}
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          {project.title}
          {project.tagline && (
            <span className="block text-2xl sm:text-3xl md:text-4xl text-gray-400 dark:text-gray-500 font-bold mt-2 sm:mt-3">
              — {project.tagline}
            </span>
          )}
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl leading-relaxed font-medium">
          {project.description}
        </p>
      </header>

      {/* 📌 Massive Hero Image (Full width of container) */}
      {project.image && (
        <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-16 md:mb-24 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-black/5 dark:shadow-black/40 bg-gray-50 dark:bg-[#050505] relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
          <img src={project.image} alt={`${project.title} Cover`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-in-out" />
        </div>
      )}

      {/* 📌 Main Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 md:gap-20">
        
        {/* ================= LEFT SIDEBAR (Meta, Tech & Buttons) ================= */}
        <aside className="xl:col-span-4 flex flex-col gap-10 order-2 xl:order-1">
          
          {/* Action Buttons (Moved top for better UX) */}
          <div className="flex flex-col gap-4 bg-gray-50 dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold text-sm px-5 py-4 rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 group">
                Visit Live Site <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#111] text-black dark:text-white font-bold text-sm px-5 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                <GitBranch className="w-4 h-4 text-gray-500" /> View Source Code
              </a>
            )}
          </div>

          {/* General Info */}
          <div className="space-y-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Info className="w-4 h-4 text-blue-500" /> Project Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Client</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{project.clientName || "Personal"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Role</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{project.role || "Full-Stack"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Status</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {project.status || "Completed"}
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack Sections */}
          <div className="space-y-8">
            {/* Front-End */}
            {(project.frontend && project.frontend.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <Layers className="w-4 h-4 text-purple-500" /> Frontend Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.frontend.map((tech: string, i: number) => (
                    <span key={i} className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-3.5 py-2 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back-End */}
            {(project.backend && project.backend.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <Code2 className="w-4 h-4 text-blue-500" /> Backend Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.backend.map((tech: string, i: number) => (
                    <span key={i} className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-3.5 py-2 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {(project.tools && project.tools.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <Wrench className="w-4 h-4 text-orange-500" /> Tools & DevOps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tech: string, i: number) => (
                    <span key={i} className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-3.5 py-2 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT MAIN CONTENT (Features & Prose) ================= */}
        <div className="xl:col-span-8 order-1 xl:order-2 space-y-16">
          
          {/* 📌 Key Features Section (If available) */}
          {featuresArray.length > 0 && (
            <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3 mb-8">
                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500/20" /> Key Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {featuresArray.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 📌 Rich Text / Deep Dive Case Study */}
          {project.content && (
            <section>
              <h2 className="text-3xl font-black text-black dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                Project Overview
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert prose-blue max-w-none 
                  prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-loose
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                  prose-img:rounded-2xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-800 prose-img:shadow-lg prose-img:my-10
                  prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
                  prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-6
                  prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[12px] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-blue-500 prose-li:before:rounded-full
                  prose-table:border-collapse prose-table:w-full prose-table:overflow-hidden prose-table:rounded-xl prose-table:shadow-sm
                  prose-th:bg-gray-100 dark:prose-th:bg-[#111] prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-800
                  prose-td:p-4 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-800 prose-td:text-gray-600 dark:prose-td:text-gray-400"
                dangerouslySetInnerHTML={{ __html: project.content }} 
              />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}