"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, ArrowUpRight, Calendar, Sparkles } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  tagline: string;
  slug: string;
  description: string;
  image: string | null;
  category: string;
  year: string;
  status: string;
  tech: string[];
}

// 📌 FIX 1: Default empty array (= []) deya hoyeche jeno data na asle page crash na kore.
export default function ProjectsClient({ projects = [] }: { projects: Project[] }) {
  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    // 📌 Main Container (Theme matched)
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

      {/* ================= 🌟 THE HERO SECTION ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24"
      >
        {/* 📌 FIX 2: Badge theke shadow remove kora hoyeche abong flat border/bg add kora hoyeche */}
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <Layers className="w-3.5 h-3.5" /> Selected Works
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Engineering scalable <br className="hidden md:block" />
          <span className="text-gray-400">digital solutions.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Explore a curated collection of my recent web development projects, SaaS applications, and high-performance system architectures.
        </motion.p>
      </motion.div>

      {/* ================= 🌟 PROJECTS GRID ================= */}
      {/* 📌 FIX 3: Safely checking length with optional chaining `?.` */}
      {(projects?.length ?? 0) > 0 ? (
        <motion.div 
          initial="hidden" animate="visible" variants={stagger} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-10"
        >
          {projects?.map((project) => (
            <motion.div key={project._id} variants={fadeUp} className="h-full">
              <Link 
                href={`/projects/${project.slug}`}
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-full relative z-10"
              >
                {/* 📸 Project Image Container */}
                <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 relative overflow-hidden">
                  
                  {/* Floating Action Button (Arrow) */}
                  <div className="absolute top-6 right-6 bg-white dark:bg-[#111] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 border border-gray-200 dark:border-gray-800 shadow-lg z-20">
                    <ArrowUpRight className="w-5 h-5 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                  </div>

                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
                       <Layers className="w-12 h-12 text-gray-200 dark:text-gray-800" />
                    </div>
                  )}
                </div>

                {/* 📝 Content Area */}
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  
                  {/* Top Meta: Category & Status */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded border border-blue-100 dark:border-blue-800/30">
                      {project.category}
                    </span>
                    
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {project.status === "Completed" ? (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                      )}
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-500 transition-colors duration-300">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed line-clamp-2 mb-8">
                    {project.tagline || project.description}
                  </p>

                  <div className="flex-1"></div> {/* Spacer */}

                  {/* Bottom Meta: Tech Stack & Year */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                    
                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 📌 FIX 4: Safe mapping over tech array */}
                      {project.tech?.map((t, i) => (
                        <span key={i} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-2.5 py-1 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Year */}
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                      <Calendar className="w-4 h-4" /> 
                      {project.year}
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // 🚫 Empty State
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#111]/50">
          <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">New projects are being crafted. Check back soon.</p>
        </motion.div>
      )}

    </main>
  );
}