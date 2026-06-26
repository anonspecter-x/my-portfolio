"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Moon, Sun, Music, Menu, X, Play, Pause, Disc3, Code2, ArrowUpRight, Volume2, Home } from "lucide-react";

interface TrackType {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

interface HeaderProps {
  settings: any;
  tracks: TrackType[];
}

export default function Header({ settings, tracks }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ⏱️ Local Time State
  const [localTime, setLocalTime] = useState<string>("");

  // 🎵 Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname(); 
  const musicRef = useRef<HTMLDivElement>(null);

  const fallbackTracks = [
    { _id: "1", title: "Lofi Chill Vibes", artist: "Developer Beats", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { _id: "2", title: "Deep Focus Coding", artist: "Synthwave", cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=100&auto=format&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  ];

  const displayTracks = tracks && tracks.length > 0 ? tracks : fallbackTracks;
  const logoText = settings?.developerName ? settings.developerName.split(" ")[0] + "." : "Nazmus.";
  const devFullName = settings?.developerName || "Developer Logo";

  // 📌 Updated Base Navigation Links
  const baseNavLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
  ];

  // ⚙️ Logic: Add Contact only if on /contact page
  const desktopNavLinks = pathname === "/contact" 
    ? [...baseNavLinks, { name: "Contact", href: "/contact" }] 
    : baseNavLinks;

  // Mobile menu should always show Home if not on Home page
  const mobileNavLinks = pathname === "/" 
    ? desktopNavLinks 
    : [{ name: "Home", href: "/" }, ...desktopNavLinks];

  const socialLinks = [
    { name: "GitHub", href: "#" },
    { name: "LinkedIn", href: "#" },
    { name: "Twitter", href: "#" },
  ];

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Logic
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  // ⏱️ Time Update Logic (Hydration Safe)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Dhaka', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setLocalTime(`Dhaka ${formatter.format(new Date())}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Click Outside Music Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (musicRef.current && !musicRef.current.contains(event.target as Node)) {
        setIsMusicOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile Menu Resize Fix
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎵 Play/Pause Logic
  const togglePlay = (index: number) => {
    if (!audioRef.current) return;
    
    if (currentTrackIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
        }
      }, 50);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={displayTracks[currentTrackIndex]?.audioUrl} 
        onEnded={() => setIsPlaying(false)}
      />

      {/* ================= DESKTOP & MOBILE HEADER ================= */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none"
      >
        <header 
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border flex items-center justify-between
          ${isScrolled 
            ? "w-[calc(100%-2rem)] max-w-[80rem] mx-auto bg-white/70 dark:bg-[#050505]/80 backdrop-blur-2xl saturate-200 border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full mt-4 md:mt-5 py-2.5 md:py-3 px-5 sm:px-6 md:px-8" 
            : "w-full max-w-[85rem] mx-auto bg-transparent dark:bg-transparent border-transparent rounded-none mt-0 py-4 sm:py-5 md:py-8 px-4 sm:px-6 md:px-12"}`}
        >
          {/* 📌 Dynamic Logo: Original Size and Shape */}
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-lg md:text-xl tracking-tighter text-black dark:text-white flex items-center gap-2.5 group">
              {settings?.siteLogo ? (
                <img src={settings.siteLogo} alt={devFullName} className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <>
                  <span className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <Code2 className="w-4 h-4" />
                  </span>
                  {logoText}
                </>
              )}
            </Link>
          </div>

          {/* 📌 Desktop Navigation */}
          <nav className="hidden md:flex items-center text-[13px] font-bold text-gray-500 dark:text-gray-400 relative">
            <AnimatePresence>
              {pathname !== "/" && (
                <motion.div 
                  initial={{ opacity: 0, width: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, width: "auto", scale: 1 }} 
                  exit={{ opacity: 0, width: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden flex items-center"
                >
                  <Link href="/" className="flex items-center justify-center p-2 mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group/home">
                    <Home className="w-4 h-4 text-gray-500 group-hover/home:text-black dark:text-gray-400 dark:group-hover/home:text-white transition-colors" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/5">
              {desktopNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`relative px-4 py-1.5 rounded-full transition-colors duration-300 ${isActive ? "text-black dark:text-white" : "hover:text-black dark:hover:text-white"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-white dark:bg-[#222] rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* ⏱️ Pro Feature: Clean & Minimal Local Time */}
            {localTime && (
              <div className="hidden lg:flex items-center gap-2 text-[12px] font-medium tracking-wide text-gray-500 dark:text-gray-400 mr-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="font-mono">{localTime}</span>
              </div>
            )}

            {/* 📌 Contact Logic */}
            {pathname !== "/contact" && (
              <Link href="/contact" className="hidden md:flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-[1.04] active:scale-95 transition-all shadow-sm border border-black/10 dark:border-white/10">
                Let's Talk <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </Link>
            )}

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 hidden md:block mx-1"></div>
            
            {/* 🎵 Dynamic Music Player */}
            <div className="relative" ref={musicRef}>
              <button 
                onClick={() => setIsMusicOpen(!isMusicOpen)}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full transition-all flex items-center justify-center relative overflow-hidden group border
                  ${isMusicOpen 
                    ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-sm" 
                    : "bg-white border-gray-200/80 text-gray-600 dark:bg-[#111] dark:border-gray-800/80 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"}`}
              >
                {isPlaying && <span className="absolute inset-0 bg-blue-500/20 animate-ping rounded-full"></span>}
                {isPlaying 
                  ? <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 text-blue-600 dark:text-blue-400 animate-pulse" /> 
                  : <Music className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 group-hover:scale-110 transition-transform" />
                }
              </button>

              <AnimatePresence>
                {isMusicOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-[-40px] sm:right-0 top-[50px] md:top-[56px] w-[280px] sm:w-[320px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 origin-top-right overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin text-blue-500" : ""}`} /> 
                        {isPlaying ? "Now Playing" : "Vibe Station"}
                      </h4>
                      {isPlaying && <div className="flex gap-1">
                        <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>}
                    </div>
                    
                    <div className="flex flex-col gap-2 relative z-10 max-h-[250px] overflow-y-auto pr-1">
                      {displayTracks.map((track, idx) => {
                        const isThisPlaying = currentTrackIndex === idx && isPlaying;
                        return (
                          <div key={track._id} onClick={() => togglePlay(idx)} className={`group flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border ${isThisPlaying ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30' : 'border-transparent hover:bg-gray-50 dark:hover:bg-[#111] hover:border-gray-200/50 dark:hover:border-gray-800/50'}`}>
                            <div className="relative">
                              <img src={track.cover} alt={track.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                              {isThisPlaying && <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-[2px]">
                                <Pause className="w-4 h-4 text-white" />
                              </div>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h5 className={`text-[12px] sm:text-[13px] font-bold leading-tight truncate ${isThisPlaying ? 'text-blue-600 dark:text-blue-400' : 'text-black dark:text-white'}`}>{track.title}</h5>
                              <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 truncate mt-0.5">{track.artist}</p>
                            </div>
                            <button className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm ${isThisPlaying ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}>
                              {isThisPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200/80 text-gray-600 dark:bg-[#111] dark:border-gray-800/80 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-all overflow-hidden relative flex items-center justify-center group shadow-sm"
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
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-100/50 dark:from-gray-900/50 to-transparent pointer-events-none"></div>

            <div className="flex flex-col pt-28 px-8 gap-5 relative z-10">
              <p className="text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase mb-2">Navigation</p>
              
              {mobileNavLinks.map((link, idx) => {
                const isActive = pathname === link.href || (pathname === "/" && link.href === "/");
                return (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1, duration: 0.4 }}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-3xl font-extrabold tracking-tight flex items-center justify-between group transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-black dark:text-white"}`}
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
              <div className="flex items-center gap-5 mb-6">
                {socialLinks.map((social, idx) => (
                  <Link key={idx} href={social.href} className="text-[14px] font-bold text-black dark:text-white hover:text-blue-600 transition-colors">
                    {social.name}
                  </Link>
                ))}
              </div>
              
              {/* 📌 Contact Logic for Mobile Footer */}
              {pathname !== "/contact" && (
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl active:scale-95 transition-transform">
                  Let's Talk <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}