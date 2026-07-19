"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, BookOpen, Clock, ArrowRight, User } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  category: string;
  readingTime: string;
  createdAt: string;
}

interface AuthorProfile {
  name: string;
  role: string;
  photo: string;
  description: string;
}

export default function BlogClient({ posts, authorProfile }: { posts: Post[], authorProfile: AuthorProfile | null }) {
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

      {/* ================= 🌟 LAYOUT: BLOGS (LEFT) & PROFILE (RIGHT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
        
        {/* 📝 LEFT: BLOG GRID */}
        <div className="lg:col-span-8 xl:col-span-9">
          {posts.length > 0 ? (
            <motion.div 
              initial="hidden" animate="visible" variants={stagger} 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[30%] group-hover:grayscale-0" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#050505]"></div>
                      )}
                    </div>

                    {/* 📝 Content Area */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      
                      {/* Category Tag & Reading Time */}
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded border border-blue-100 dark:border-blue-800/30">
                          {post.category}
                        </span>
                        
                        <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-gray-50 dark:bg-[#111] px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800">
                          <Clock className="w-3.5 h-3.5" /> {post.readingTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-black dark:text-white mb-4 group-hover:text-blue-500 transition-colors duration-300 line-clamp-3 leading-snug">
                        {post.title}
                      </h2>

                      <div className="flex-1"></div> {/* Spacer */}

                      {/* Publisher / Author & Date */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                        <div className="flex items-center gap-2.5">
                          {authorProfile?.photo && (
                            <img src={authorProfile.photo} alt={authorProfile.name} className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                          )}
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{authorProfile?.name}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {post.createdAt}
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
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No articles published yet.</p>
            </motion.div>
          )}
        </div>

        {/* 👤 RIGHT: PROFILE SIDEBAR CARD */}
        <div className="lg:col-span-4 xl:col-span-3">
          {authorProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="sticky top-32 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm text-center flex flex-col items-center hover:border-blue-500/30 transition-colors duration-500"
            >
              {/* Profile Image */}
              {authorProfile.photo ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                  <img src={authorProfile.photo} alt={authorProfile.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
                  <User className="w-8 h-8" />
                </div>
              )}
              
              {/* Name & Role */}
              <h3 className="text-xl font-bold text-black dark:text-white mb-1 tracking-tight">{authorProfile.name}</h3>
              <p className="text-[13px] font-bold text-blue-500 dark:text-blue-400 mb-5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-md border border-blue-100 dark:border-blue-900/30">
                {authorProfile.role}
              </p>
              
              {/* SEO Description as Bio */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {authorProfile.description}
              </p>
              
              {/* More About Me Button */}
              <Link 
                href="/about" 
                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                More About Me <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>

      </div>
    </main>
  );
}