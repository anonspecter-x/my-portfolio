"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, BookOpen, Clock, ArrowRight } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  category: string;
  readingTime: string;
  createdAt: string;
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  // 📌 Animation Variants (Matched with About, Contact, Brands)
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    // 📌 Main Container (Background & Text Colors matched exactly with previous pages)
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements (From Contact/Brands Page) */}
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
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <BookOpen className="w-3.5 h-3.5" /> Journal & Insights
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Exploring ideas through <br className="hidden md:block" />
          <span className="text-gray-400">design & code.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Dive into my latest thoughts, technical tutorials, and experiences as a Full Stack Developer building modern web applications.
        </motion.p>
      </motion.div>

      {/* ================= 🌟 BLOG GRID ================= */}
      {posts.length > 0 ? (
        <motion.div 
          initial="hidden" animate="visible" variants={stagger} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {posts.map((post) => (
            <motion.div key={post._id} variants={fadeUp} className="h-full">
              <Link 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-full relative z-10"
              >
                {/* 📸 Cover Image Container */}
                <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 relative overflow-hidden">
                  {post.coverImage ? (
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      // Grayscale effect added to match About & Brands page vibe
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[30%] group-hover:grayscale-0" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#050505]"></div>
                  )}
                </div>

                {/* 📝 Content Area */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  
                  {/* Category Tag */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded border border-blue-100 dark:border-blue-800/30">
                      {post.category}
                    </span>
                    
                    {/* Minimal Arrow on Hover */}
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-black dark:text-white mb-4 group-hover:text-blue-500 transition-colors duration-300 line-clamp-3 leading-snug">
                    {post.title}
                  </h2>

                  <div className="flex-1"></div> {/* Spacer */}

                  {/* Meta Data */}
                  <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> 
                      {post.createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> 
                      {post.readingTime}
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // 🚫 Empty State (Matched with Brands page empty state styling)
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#111]/50">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No articles published yet.</p>
        </motion.div>
      )}

    </main>
  );
}