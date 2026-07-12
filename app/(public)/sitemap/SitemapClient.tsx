"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Map, LayoutGrid, Briefcase, BookOpen, 
  ArrowRight, ShieldCheck, Mail, Star, 
  FileText, Code2
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
  // 📌 Animation Variants (Matched exactly with your other pages)
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // 📌 Static Core Pages Data
  const corePages = [
    { title: "Home", href: "/", icon: LayoutGrid },
    { title: "About Me", href: "/about", icon: User },
    { title: "Projects & Works", href: "/projects", icon: Briefcase },
    { title: "Blog & Journal", href: "/blog", icon: BookOpen },
    { title: "Contact", href: "/contact", icon: Mail },
    { title: "Leave a Review", href: "/leave-review", icon: Star },
  ];

  // 📌 Legal Pages Data
  const legalPages = [
    { title: "Terms of Service", href: "/terms", icon: FileText },
    { title: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { title: "XML Sitemap", href: "/sitemap.xml", icon: Code2 }, // Added a link to the real XML sitemap
  ];

  return (
    // 📌 Main Container (Background, Text Colors, and Selection Color matched perfectly)
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* 🌟 Header Section */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mb-16 md:mb-24">
        {/* 📌 Header Badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <Map className="w-3.5 h-3.5" /> Navigation & Index
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Visual <span className="text-gray-400">Sitemap.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Explore the full directory of my portfolio, including core pages, dynamic projects, articles, and legal documents.
        </motion.p>
      </motion.div>

      {/* 🌟 Content Grid Layout */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10"
      >
        
        {/* 📌 1. Core Pages Section */}
        <motion.div variants={fadeUp}>
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-blue-500" />
              Core Pages
            </h3>
            <div className="space-y-1">
              {corePages.map((page, index) => (
                <Link 
                  key={index} href={page.href}
                  className="group flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-0 hover:pl-2 transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white flex items-center gap-3 transition-colors">
                    <page.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                    {page.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-500 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 📌 2. Legal & Resources Section */}
        <motion.div variants={fadeUp}>
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Legal & Resources
            </h3>
            <div className="space-y-1">
              {legalPages.map((page, index) => (
                <Link 
                  key={index} href={page.href}
                  className="group flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-0 hover:pl-2 transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white flex items-center gap-3 transition-colors">
                    <page.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-purple-500 transition-all" />
                    {page.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-purple-500 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 📌 3. Dynamic Projects Section */}
        <motion.div variants={fadeUp}>
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              Dynamic Projects
            </h3>
            {projects.length > 0 ? (
              <div className="space-y-1">
                {projects.map((project, index) => (
                  <Link 
                    key={index} href={`/projects/${project.slug}`}
                    className="group flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-0 hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white line-clamp-1 pr-4 transition-colors">
                      {project.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-emerald-500 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic py-3">No projects published yet.</p>
            )}
          </div>
        </motion.div>

        {/* 📌 4. Dynamic Blog Posts Section */}
        <motion.div variants={fadeUp}>
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Dynamic Articles
            </h3>
            {posts.length > 0 ? (
              <div className="space-y-1">
                {posts.map((post, index) => (
                  <Link 
                    key={index} href={`/blog/${post.slug}`}
                    className="group flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-0 hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white line-clamp-1 pr-4 transition-colors">
                      {post.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-orange-500 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic py-3">No articles published yet.</p>
            )}
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}

// 📌 Dummy Icon component for user (As lucide-react User icon might be imported differently in some versions)
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}