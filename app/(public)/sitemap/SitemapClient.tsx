"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Map, LayoutGrid, Briefcase, BookOpen, 
  ArrowUpRight, ShieldCheck, Mail, Star, 
  FileText, Code2, Folder, User, Terminal
} from "lucide-react";

interface SitemapItem {
  title: string;
  slug: string;
}

interface SitemapClientProps {
  projects: SitemapItem[];
  posts: SitemapItem[];
}

export default function SitemapClient({ projects, posts }: SitemapClientProps) {
  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // 📌 Primary Routes
  const corePages = [
    { title: "Homepage", href: "/", icon: LayoutGrid, desc: "The main entry point of the portfolio." },
    { title: "About the Developer", href: "/about", icon: User, desc: "My background, tech stack, and engineering manifesto." },
    { title: "Selected Works", href: "/projects", icon: Briefcase, desc: "A curated list of my web applications and projects." },
    { title: "Journal & Insights", href: "/blog", icon: BookOpen, desc: "Technical articles, tutorials, and thoughts." },
    { title: "Contact & Collaboration", href: "/contact", icon: Mail, desc: "Get in touch for project inquiries." },
    { title: "Client Feedback", href: "/leave-review", icon: Star, desc: "Submit a review about our collaboration." },
  ];

  // 📌 Legal & Architecture
  const legalPages = [
    { title: "Terms of Service", href: "/terms", icon: FileText },
    { title: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { title: "XML Sitemap", href: "/sitemap.xml", icon: Code2 }, 
  ];

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* 🌟 Left Side: Sticky Header / Intro */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-5 sticky top-32 self-start"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
            <Map className="w-3.5 h-3.5" /> Site Index & Directory
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
            Explore the <br className="hidden lg:block" />
            <span className="text-gray-400">ecosystem.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md">
            A comprehensive, structural overview of all primary routes, project case studies, publications, and legal documentation available on this platform.
          </motion.p>
          
          <motion.div variants={fadeUp} className="hidden lg:flex items-center gap-4 p-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm max-w-md">
            <Terminal className="w-8 h-8 text-blue-500 shrink-0" />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Looking for the automated search engine index? Navigate directly to the <a href="/sitemap.xml" className="text-blue-500 hover:underline">XML Sitemap</a>.
            </p>
          </motion.div>
        </motion.div>

        {/* 🌟 Right Side: Directory Content */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-7 space-y-8"
        >
          
          {/* 📌 1. Primary Routes */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <Folder className="w-5 h-5 text-blue-500" /> Primary Routes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {corePages.map((page, index) => (
                <Link 
                  key={index} href={page.href}
                  className="group flex flex-col p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                      <page.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      {page.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-500 transition-all duration-300" />
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed pl-6">
                    {page.desc}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 📌 2. Project Archive */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-500" /> Project Archive
            </h2>
            {projects.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {projects.map((project, index) => (
                  <Link 
                    key={index} href={`/projects/${project.slug}`}
                    className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {project.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-emerald-500 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No projects indexed yet.</p>
              </div>
            )}
          </motion.div>

          {/* 📌 3. Publications */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-orange-500" /> Publications
            </h2>
            {posts.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {posts.map((post, index) => (
                  <Link 
                    key={index} href={`/blog/${post.slug}`}
                    className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {post.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No articles indexed yet.</p>
              </div>
            )}
          </motion.div>

          {/* 📌 4. Legal & Compliance */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-500" /> Legal & Compliance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {legalPages.map((page, index) => (
                <Link 
                  key={index} href={page.href}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#050505] border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300"
                >
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white flex items-center gap-2 transition-colors">
                    <page.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                    {page.title}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-purple-500 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}