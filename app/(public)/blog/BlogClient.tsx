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
  // 📌 Smooth Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="relative min-h-screen pt-32 pb-24 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden">
      
      {/* 📌 Elegant Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 blur-[120px] rounded-full translate-y-[-20%]"
        />
      </div>

      {/* 📌 Minimal Header Section */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mb-20 md:mb-28">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 text-[11px] font-bold tracking-widest uppercase mb-8 text-blue-600 dark:text-blue-400">
          <BookOpen className="w-3.5 h-3.5" /> Journal & Insights
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-[4rem] font-extrabold tracking-tight text-[#0A0A0B] dark:text-white leading-[1.05] mb-6">
          Exploring ideas through <span className="text-gray-400 dark:text-gray-500 font-medium italic">design</span> & code.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          Dive into my latest thoughts, technical tutorials, and experiences as a Full Stack Developer building modern web applications.
        </motion.p>
      </motion.div>

      {/* 📌 Premium Grid Layout */}
      {posts.length > 0 ? (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {posts.map((post) => (
            <motion.div key={post._id} variants={fadeUp} className="h-full">
              <Link 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-[#09090B] border border-gray-200/80 dark:border-white/10 rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.02)] hover:-translate-y-1.5 h-full relative z-10"
              >
                {/* 📌 Cover Image Container */}
                <div className="w-full aspect-[16/9] bg-gray-50 dark:bg-[#111] relative overflow-hidden">
                  {post.coverImage ? (
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-[1.05] transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#151515]"></div>
                  )}
                  {/* Subtle Inner Shadow for Depth */}
                  <div className="absolute inset-0 border-b border-gray-100 dark:border-white/5 pointer-events-none mix-blend-overlay"></div>
                </div>

                {/* 📌 Content Area */}
                <div className="p-7 sm:p-8 flex flex-col flex-1 bg-white dark:bg-[#09090B]">
                  
                  {/* Category Tag */}
                  <div className="mb-5 flex items-center justify-between">
                    <span className="inline-flex text-[11px] font-bold tracking-[0.15em] uppercase text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                    
                    {/* Minimal Arrow on Hover */}
                    <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.35] mb-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-3">
                    {post.title}
                  </h2>

                  <div className="flex-1"></div> {/* Spacer to push metadata to the bottom if title is short */}

                  {/* Meta Data */}
                  <div className="flex items-center gap-4 text-[13px] font-medium text-gray-500 dark:text-gray-400/80 pt-5 border-t border-gray-100 dark:border-white/5 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 stroke-[2] opacity-70" /> 
                      {post.createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 stroke-[2] opacity-70" /> 
                      {post.readingTime}
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 dark:border-white/10 rounded-[24px] bg-gray-50/50 dark:bg-white/[0.02]">
          <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No articles published yet.</p>
        </motion.div>
      )}

    </main>
  );
}