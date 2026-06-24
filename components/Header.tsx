"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 Active মেনু ট্র্যাক করার জন্য
import { Moon, Sun, Music, Menu, X, Play, Pause, Disc3, Code2, ArrowUpRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname(); // 👈 বর্তমান URL বের করার হুক
  const musicRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 🗄️ DYNAMIC BACKEND DATA (Admin Panel Ready)
  // ==========================================
  const siteData = {
    logoName: "Nazmus.",
    navLinks: [
      { name: "Home", href: "/" },
      { name: "About", href: "/#about" }, // 👈 Contact পেজ থেকে কাজ করার জন্য /#about দেওয়া হয়েছে
      { name: "Skills", href: "/#skills" },
      { name: "Projects", href: "/#projects" },
      { name: "Contact", href: "/contact" },
    ],
    socialLinks: [
      { name: "GitHub", href: "#" },
      { name: "LinkedIn", href: "#" },
      { name: "Twitter", href: "#" },
    ],
    musicTracks: [
      { id: 1, title: "Lofi Chill Vibes", artist: "Developer Beats", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop" },
      { id: 2, title: "Deep Focus Coding", artist: "Synthwave", cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=100&auto=format&fit=crop" },
    ]
  };

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Dark Mode Logic with LocalStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // Outside Click Handle for Music Player
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (musicRef.current && !musicRef.current.contains(event.target as Node)) {
        setIsMusicOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ================= DESKTOP & MOBILE HEADER ================= */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-0 left-0 w-full z-50 px-4 pt-4 flex justify-center pointer-events-none"
      >
        <header 
          className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 ease-in-out border flex items-center justify-between px-6 md:px-8 py-2.5 md:py-3
          ${isScrolled 
            ? "bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-2xl border-gray-200/80 dark:border-gray-800/80 shadow-md" 
            : "bg-transparent border-transparent"}`}
        >
          {/* Logo */}
          <Link href="/" className="font-extrabold text-xl md:text-2xl tracking-tighter text-black dark:text-white flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Code2 className="w-4 h-4" />
            </span>
            {siteData.logoName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-gray-600 dark:text-gray-300">
            {siteData.navLinks.map((link, idx) => {
              // 👈 Active Menu লজিক
              // যদি বর্তমান পাথ আর লিংকের পাথ সমান হয়, অথবা হোমপেজে থাকলে হোম অ্যাকটিভ হবে
              const isActive = pathname === link.href || (pathname === "/" && link.href === "/");

              return (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className={`transition-colors relative group py-1 ${isActive ? "text-black dark:text-white font-bold" : "hover:text-black dark:hover:text-white"}`}
                >
                  {link.name}
                  {/* 👈 Active হলে আন্ডারলাইন পুরোটাই দেখাবে */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-black dark:bg-white transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Music Player Button & Dropdown */}
            <div className="relative" ref={musicRef}>
              <button 
                onClick={() => setIsMusicOpen(!isMusicOpen)}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full transition-all flex items-center justify-center relative overflow-hidden group border
                  ${isMusicOpen 
                    ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-sm" 
                    : "bg-white border-gray-200 text-gray-600 dark:bg-[#111] dark:border-gray-800 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"}`}
              >
                {isPlaying && <span className="absolute inset-0 bg-blue-500/20 animate-ping rounded-full"></span>}
                <Music className={`w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 ${isPlaying ? "animate-pulse text-blue-500 dark:text-blue-600" : ""} group-hover:scale-110 transition-transform`} />
              </button>

              {/* Music Dropdown */}
              <AnimatePresence>
                {isMusicOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[50px] md:top-[56px] w-[300px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 origin-top-right overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                    
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                      <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin text-blue-500" : ""}`} /> 
                      Dynamic Vibes
                    </h4>
                    
                    <div className="flex flex-col gap-2">
                      {siteData.musicTracks.map((track, idx) => (
                        <div key={track.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#111] transition-colors cursor-pointer border border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50">
                          <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                          <div className="flex-1 overflow-hidden">
                            <h5 className="text-[14px] font-semibold text-black dark:text-white leading-tight truncate">{track.title}</h5>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{track.artist}</p>
                          </div>
                          <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0 shadow-sm">
                            {idx === 0 && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 text-gray-600 dark:bg-[#111] dark:border-gray-800 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-all overflow-hidden relative flex items-center justify-center group shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 text-white group-hover:scale-110 transition-transform" /> : <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 text-black group-hover:scale-110 transition-transform" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </header>
      </motion.div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl md:hidden flex flex-col justify-between"
          >
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-100/50 dark:from-gray-900/50 to-transparent pointer-events-none"></div>

            <div className="flex flex-col pt-32 px-8 gap-5 relative z-10">
              <p className="text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase mb-4">Navigation</p>
              
              {siteData.navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (pathname === "/" && link.href === "/");

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-3xl sm:text-4xl font-bold tracking-tight flex items-center justify-between group transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-black dark:text-white"}`}
                    >
                      {link.name}
                      <ArrowUpRight className={`w-5 h-5 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"} text-gray-400`} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Mobile Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="p-8 pb-10 border-t border-gray-200/50 dark:border-gray-800/50 relative z-10 bg-white/50 dark:bg-[#0a0a0a]/50"
            >
              <p className="text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase mb-5">Connect</p>
              <div className="flex items-center gap-5">
                {siteData.socialLinks.map((social, idx) => (
                  <Link 
                    key={idx} 
                    href={social.href}
                    className="text-[14px] font-semibold text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                  >
                    {social.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}