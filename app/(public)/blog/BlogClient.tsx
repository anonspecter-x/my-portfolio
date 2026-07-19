"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Calendar, BookOpen, ArrowRight, Search, ChevronLeft, ChevronRight, User, X, Eye } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  category: string;
  totalViewTime: number;
  createdAt: string;
  createdAtRaw: string;
}

interface AuthorInfo {
  name: string;
  role: string;
  photo: string | null;
  bio: string;
}

export default function BlogClient({ posts, authorInfo }: { posts: Post[], authorInfo: AuthorInfo | null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6; 

  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // 📌 সার্চ ফিল্টার
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, posts]);

  // 📌 পেজিনেশন লজিক
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-x-clip selection:bg-blue-500/30">
      
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
        className="mb-16 md:mb-20"
      >
        <div className="max-w-3xl">
          <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
            <BookOpen className="w-3.5 h-3.5" /> Journal & Insights
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
            Exploring ideas through <br className="hidden md:block" />
            <span className="text-gray-400">design & code.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
            Dive into my latest thoughts, technical tutorials, and experiences as a Full Stack Developer.
          </motion.p>
        </div>
      </motion.div>

      {/* ================= 🌟 MAIN GRID LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative items-start">
        
        {/* 📝 LEFT AREA: BLOG POSTS */}
        <div className="lg:col-span-2 order-1 flex flex-col gap-10">
          {filteredPosts.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage + searchQuery} 
                initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={stagger} 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {paginatedPosts.map((post) => (
                  <motion.article key={post._id} variants={fadeUp} className="h-full">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-full relative z-10"
                    >
                      {/* 📸 Cover Image */}
                      <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 relative overflow-hidden">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[30%] group-hover:grayscale-0" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#050505]"></div>
                        )}
                      </div>

                      {/* 📝 Content Area */}
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        
                        <div className="mb-5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded border border-blue-100 dark:border-blue-800/30">
                            {post.category}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-black dark:text-white mb-6 group-hover:text-blue-500 transition-colors duration-300 line-clamp-3 leading-snug">
                          {post.title}
                        </h2>

                        <div className="flex-1"></div>

                        {/* 👨‍💻 Author Info in Card */}
                        <div className="flex items-center gap-3 mb-5">
                          {authorInfo?.photo ? (
                            <img src={authorInfo.photo} alt={authorInfo.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-gray-800">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-black dark:text-white leading-none">{authorInfo?.name || "Author"}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{authorInfo?.role || "Content Creator"}</span>
                          </div>
                        </div>

                        {/* 📅 Meta Data (পুরাতন রিডিং টাইম রিমুভ করে শুধু নতুনটা রাখা হলো) */}
                        <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-500 dark:text-gray-400 pt-5 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                          <time dateTime={post.createdAtRaw} className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> 
                            {post.createdAt}
                          </time>
                          
                          {/* 📌 শুধু টোটাল রিডিং টাইম এখানে রাখা হলো */}
                          <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 ml-auto" title="Total Accumulated Read Time">
                            <Eye className="w-4 h-4" /> 
                            {post.totalViewTime}m read
                          </span>
                        </div>

                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#111]/50">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No articles found.</p>
            </motion.div>
          )}

          {/* 🔢 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:border-blue-500 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentPage === i + 1 
                      ? "bg-blue-500 text-white border-transparent shadow-md scale-105" 
                      : "bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:border-blue-500 shadow-sm"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:border-blue-500 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-black dark:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* ================= 👤 RIGHT AREA: FIXED SIDEBAR (SEARCH + PROFILE) ================= */}
        <div className="lg:col-span-1 order-2 lg:sticky lg:top-32 h-fit z-10 flex flex-col gap-6">
          
          {/* 🔍 PREMIUM SEARCH BAR */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            <div className="relative flex items-center w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <Search className="w-5 h-5 text-gray-400 ml-6 shrink-0" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-transparent py-4 px-4 text-sm outline-none text-black dark:text-white placeholder:text-gray-400 font-medium"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="mr-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 👤 PROFILE CARD */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center">
            
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
              {authorInfo?.photo ? (
                <img src={authorInfo.photo} alt={authorInfo.name} className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#111] shadow-lg" />
              ) : (
                <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-[#111] border-4 border-white dark:border-[#111] flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-black dark:text-white mb-1.5">{authorInfo?.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-5">
              {authorInfo?.role}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {authorInfo?.bio}
            </p>

            <Link href="/about" className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm">
              <User className="w-4 h-4" /> Know More About Me
            </Link>

          </div>
        </div>

      </div>

    </main>
  );
}