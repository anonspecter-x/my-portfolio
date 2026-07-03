"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Moon, Sun, Music, Menu, X, Play, Pause, Disc3, Code2, ArrowUpRight, Volume2, Home, SkipBack, SkipForward } from "lucide-react";

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
    { _id: "1", title: "Lines Of Light", artist: "Local Playlist", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { _id: "2", title: "Syntax & Soul", artist: "Developer Beats", cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=100&auto=format&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { _id: "3", title: "Deep Focus", artist: "Synthwave", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=100&auto=format&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ];

  const displayTracks = tracks && tracks.length > 0 ? tracks : fallbackTracks;
  const logoText = settings?.developerName ? settings.developerName.split(" ")[0] + "." : "Nazmus.";
  const devFullName = settings?.developerName || "Developer Logo";
  const currentTrack = displayTracks[currentTrackIndex];

  // 📌 Updated Base Navigation Links
  const baseNavLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Brands", href: "/brands" },
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

  // 📌 Dynamic Social Links Logic based on Settings
  const availableSocials = [
    { id: "github", name: "GitHub" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "twitter", name: "Twitter" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "youtube", name: "YouTube" },
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram" },
  ];

  const socialLinks = availableSocials
    .filter(social => settings?.[`social_${social.id}_visible`] === "true" && settings?.[`social_${social.id}`])
    .map(social => ({
      name: social.name,
      href: settings[`social_${social.id}`]
    }));

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

  // ⏱️ Time Update Logic (Dynamic real-time update)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Dhaka', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setLocalTime(formatter.format(new Date()));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
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

  // 🎵 Music Controls Logic
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playSpecificTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
    }, 50);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % displayTracks.length;
    playSpecificTrack(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + displayTracks.length) % displayTracks.length;
    playSpecificTrack(prevIndex);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentTrack?.audioUrl} 
        onEnded={handleNext}
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
            ? "w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] bg-white/70 dark:bg-[#050505]/80 backdrop-blur-2xl saturate-200 border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-w-full md:max-w-[calc(85rem-6rem)] rounded-full mt-4 md:mt-5 py-2.5 md:py-3 px-5 sm:px-6 md:px-8" 
            : "w-full max-w-[85rem] bg-transparent dark:bg-transparent border-transparent rounded-none mt-0 py-4 sm:py-5 md:py-8 px-4 sm:px-6 md:px-12"}`}
        >
          {/* 📌 Dynamic Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-lg md:text-xl tracking-tighter text-black dark:text-white flex items-center gap-2.5 group">
              {settings?.siteLogoLight || settings?.siteLogoDark || settings?.siteLogo ? (
                <>
                  {(settings?.siteLogoLight || settings?.siteLogo) && (
                    <img 
                      src={settings.siteLogoLight || settings.siteLogo} 
                      alt={devFullName} 
                      className={`h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ${settings?.siteLogoDark ? 'block dark:hidden' : ''}`} 
                    />
                  )}
                  {settings?.siteLogoDark && (
                    <img 
                      src={settings.siteLogoDark} 
                      alt={devFullName} 
                      className={`h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ${(settings?.siteLogoLight || settings?.siteLogo) ? 'hidden dark:block' : ''}`} 
                    />
                  )}
                </>
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
            
            {/* ⏱️ Clean Local Time */}
            {localTime && (
              <div className="hidden lg:flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mr-2">
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">UTC +6</span>
                <span className="font-mono text-[13px] font-semibold tracking-widest">{localTime}</span>
              </div>
            )}

            {/* 📌 Contact Logic */}
            {pathname !== "/contact" && (
              <Link href="/contact" className="hidden md:flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-[1.04] active:scale-95 transition-all shadow-sm border border-black/10 dark:border-white/10">
                Let's Talk <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </Link>
            )}

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 hidden md:block mx-1"></div>
            
            {/* 🎵 Dynamic Music Player UI (Redesigned matching image_05044b.png) */}
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
                    className="absolute right-[-40px] sm:right-0 top-[50px] md:top-[56px] w-[310px] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] origin-top-right overflow-hidden flex flex-col"
                  >
                    {/* Top Section - Now Playing Info & Controls */}
                    <div className="p-5 pb-6">
                      {/* Header: NOW PLAYING */}
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Music className="w-3 h-3" /> NOW PLAYING
                        </h4>
                        
                        {/* Blue Equalizer Animation from Image */}
                        {isPlaying ? (
                          <div className="flex items-end gap-[3px] h-[14px]">
                            <motion.span animate={{ height: ["40%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-blue-500 rounded-sm"></motion.span>
                            <motion.span animate={{ height: ["100%", "50%", "100%"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 bg-blue-500 rounded-sm"></motion.span>
                            <motion.span animate={{ height: ["60%", "100%", "60%"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 bg-blue-500 rounded-sm"></motion.span>
                          </div>
                        ) : (
                          <div className="flex items-end gap-[3px] h-[14px] opacity-40 grayscale">
                            <span className="w-1.5 h-2 bg-gray-400 rounded-sm"></span>
                            <span className="w-1.5 h-3 bg-gray-400 rounded-sm"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></span>
                          </div>
                        )}
                      </div>

                      {/* Current Track Details */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-[60px] h-[60px] shrink-0 rounded-2xl overflow-hidden shadow-md">
                          <img 
                            src={currentTrack?.cover} 
                            alt={currentTrack?.title} 
                            className={`w-full h-full object-cover transition-transform duration-[3s] ${isPlaying ? 'scale-110' : 'scale-100'}`} 
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-lg font-bold text-black dark:text-white truncate leading-tight mb-1">{currentTrack?.title}</h3>
                          <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 truncate">{currentTrack?.artist}</p>
                        </div>
                      </div>

                      {/* Media Controls */}
                      <div className="flex items-center justify-center gap-7">
                        <button onClick={handlePrev} className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors">
                          <SkipBack className="w-6 h-6" fill="currentColor" />
                        </button>
                        
                        <button 
                          onClick={togglePlay}
                          className="w-14 h-14 bg-[#111] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" fill="currentColor" />
                          ) : (
                            <Play className="w-6 h-6 ml-1" fill="currentColor" />
                          )}
                        </button>
                        
                        <button onClick={handleNext} className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors">
                          <SkipForward className="w-6 h-6" fill="currentColor" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Section - Up Next Playlist */}
                    <div className="bg-gray-50/80 dark:bg-[#151515]/80 p-5 pt-4 border-t border-gray-100 dark:border-gray-800/60">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/90 dark:text-white/90 mb-3">UP NEXT</h4>
                      
                      <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
                        {displayTracks.map((track, idx) => {
                          const isThisPlaying = currentTrackIndex === idx;
                          return (
                            <div 
                              key={track._id} 
                              onClick={() => playSpecificTrack(idx)} 
                              className={`group flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                                isThisPlaying 
                                  ? 'bg-white dark:bg-[#222] shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/5' 
                                  : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <div className="relative w-9 h-9 shrink-0 rounded-lg overflow-hidden shadow-sm bg-black">
                                <img 
                                  src={track.cover} 
                                  alt={track.title} 
                                  className={`w-full h-full object-cover transition-opacity ${isThisPlaying ? 'opacity-70' : 'opacity-100 group-hover:opacity-80'}`} 
                                />
                                {isThisPlaying && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Volume2 className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 overflow-hidden">
                                <h5 className={`text-[13px] font-bold truncate transition-colors ${
                                  isThisPlaying 
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-800 dark:text-gray-200'
                                  }`}>
                                  {track.title}
                                </h5>
                                {!isThisPlaying && (
                                  <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">{track.artist}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
              
              {/* 📌 Dynamic Social Media Links Container */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {socialLinks.map((social, idx) => (
                    <Link key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-black dark:text-white hover:text-blue-600 transition-colors">
                      {social.name}
                    </Link>
                  ))}
                </div>
              )}
              
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