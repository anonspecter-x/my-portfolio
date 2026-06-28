"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, BookOpen, Clock } from "lucide-react";

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
    <main className="relative min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* 📌 Header */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mb-16 md:mb-24">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400 shadow-sm">
          <BookOpen className="w-3.5 h-3.5" /> Thoughts & Insights
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Writing about <span className="text-gray-400">code, design,</span> and building products.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Dive into my latest articles, tutorials, and experiences as a Full Stack Developer.
        </motion.p>
      </motion.div>

      {/* 📌 Blog List Grid */}
      {posts.length > 0 ? (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <motion.div key={post._id} variants={fadeUp}>
              <Link 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-full"
              >
                {/* Cover Image */}
                <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-[#111] relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <ArrowUpRight className="w-4 h-4 text-black dark:text-white" />
                  </div>
                  {/* 📌 Category Badge Over Image */}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[11px] font-bold tracking-wider uppercase text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.createdAt}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles published yet. Check back soon!</p>
        </motion.div>
      )}

    </main>
  );
}