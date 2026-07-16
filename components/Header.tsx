"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Moon, Sun, Music, Menu, X, Play, Pause, Disc3, Code2, ArrowUpRight, Volume2, Home, SkipBack, SkipForward, Volume1, VolumeX } from "lucide-react";

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
  const [volume, setVolume] = useState<number>(0.8); // 🔊 Default Volume 80%
  const [isVolumeChanging, setIsVolumeChanging] = useState(false); // For smart mobile/desktop tooltip indicator
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null); 
  const volumeTimeout = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname(); 

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
    { name: "Brands", href: "/brands" },
    { name: "Blog", href: "/blog" }, 
  ];

  // ⚙️ Logic: Add dynamic links based on pathname
  let desktopNavLinks = [...baseNavLinks];

  // 📌 যদি ইউজার About অথবা Certificates পেজে থাকে, তবে About-এর ঠিক পরেই Certificates অ্যাড হবে
  if (pathname === "/about" || pathname.startsWith("/about/") || pathname === "/certificates" || pathname.startsWith("/certificates/")) {
    desktopNavLinks.splice(1, 0, { name: "Certificates", href: "/certificates" });
  }

  // 📌 Contact page এ থাকলে Contact লিংক দেখাবে
  if (pathname === "/contact") {
    desktopNavLinks.push({ name: "Contact", href: "/contact" });
  }

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
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.innerWidth < 768) {
        if (Math.abs(window.scrollY - lastScrollY) > 10) {
          setIsMusicOpen(false);
        }
      }
      lastScrollY = window.scrollY;
    };
    
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

  // ⏱️ Time Update Logic
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔊 Apply Volume to Audio Element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Visual Volume Feedback trigger
  const showVolumeFeedback = () => {
    setIsVolumeChanging(true);
    if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
    volumeTimeout.current = setTimeout(() => {
      setIsVolumeChanging(false);
    }, 1500); // Hide after 1.5s of inactivity
  };

  // 🎚️ Handle Volume Control (Desktop Scroll + Mobile Touch Swipe)
  useEffect(() => {
    const volElem = volumeRef.current;
    let lastY = 0;

    // --- Desktop: Mouse Wheel (Scroll) ---
    const handleWheel = (e: WheelEvent) => {
      if (!isMusicOpen) return;
      e.preventDefault(); 
      const delta = Math.sign(e.deltaY);
      
      setVolume((prev) => {
        const newVol = prev - delta * 0.05; 
        return Math.max(0, Math.min(newVol, 1));
      });
      showVolumeFeedback();
    };

    // --- Mobile: Touch & Swipe Support (Android/iOS) ---
    const handleTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
      showVolumeFeedback(); // Show tooltip immediately on touch
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMusicOpen) return;
      e.preventDefault(); // Stop main screen/page from scrolling
      const currentY = e.touches[0].clientY;
      const diffY = lastY - currentY; // Positive if swiping UP, Negative if DOWN
      lastY = currentY; 
      
      setVolume((prev) => {
        // Adjust touch sensitivity (0.015 per pixel moved)
        const newVol = prev + (diffY * 0.015); 
        return Math.max(0, Math.min(newVol, 1));
      });
      showVolumeFeedback();
    };

    if (volElem) {
      // passive: false is mandatory to allow preventDefault()
      volElem.addEventListener("wheel", handleWheel, { passive: false });
      volElem.addEventListener("touchstart", handleTouchStart, { passive: false });
      volElem.addEventListener("touchmove", handleTouchMove, { passive: false });
    }
    
    return () => {
      if (volElem) {
        volElem.removeEventListener("wheel", handleWheel);
        volElem.removeEventListener("touchstart", handleTouchStart);
        volElem.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isMusicOpen]); 

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
        onEnded={() => {
          // Auto-play next track
          const nextIndex = currentTrackIndex === displayTracks.length - 1 ? 0 : currentTrackIndex + 1;
          togglePlay(nextIndex);
        }}
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
          {/* 📌 Dynamic Logo: Light & Dark Mode Supported */}
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
              <AnimatePresence mode="popLayout">
                {desktopNavLinks.map((link) => {
                  // 📌 Active Check: Exact match অথবা Sub-route match
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <motion.div
                      key={link.name}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        href={link.href} 
                        className={`relative px-4 py-1.5 rounded-full transition-colors duration-300 flex ${isActive ? "text-black dark:text-white" : "hover:text-black dark:hover:text-white"}`}
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {localTime && (
              <div className="hidden lg:flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mr-2">
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">UTC +6</span>
                <span className="font-mono text-[13px] font-semibold tracking-widest">{localTime}</span>
              </div>
            )}

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
                    className="absolute right-[-60px] sm:right-0 top-[50px] md:top-[56px] w-[320px] sm:w-[350px] bg-[#f8f9fa]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-gray-200/60 dark:border-gray-800/60 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] origin-top-right overflow-hidden flex flex-col"
                  >
                    {/* Soft background glow - Responsive to Volume level */}
                    <div 
                      className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-orange-500/15 to-blue-500/10 blur-[50px] rounded-full pointer-events-none transition-all duration-500 ease-out z-0"
                      style={{ 
                        transform: `scale(${0.85 + volume * 0.3})`, 
                        opacity: 0.3 + volume * 0.7 
                      }}
                    ></div>
                    
                    <div className="p-6 pb-2 flex flex-col items-center relative z-20">
                      
                      {/* Top Bar: Now Playing, Volume Dial & Equalizer */}
                      <div className="w-full flex items-center justify-between mb-6 relative z-50">
                        <div className="bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/40 dark:border-white/5 shadow-sm">
                          <Disc3 className={`w-3.5 h-3.5 text-slate-700 dark:text-slate-300 ${isPlaying ? "animate-spin" : ""}`} />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">Now Playing</span>
                        </div>
                        
                        <div className="flex items-center gap-3 relative">
                          {/* 🎚️ Mobile Swipe & Desktop Scroll Volume Controller */}
                          <div 
                            ref={volumeRef}
                            className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full cursor-ns-resize touch-none group bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm"
                            title="Scroll or Swipe Up/Down to adjust volume"
                          >
                            <div 
                              className="absolute inset-0 rounded-full bg-blue-500/20 blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ opacity: volume * 0.4 }}
                            />
                            
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-1" viewBox="0 0 36 36">
                              <defs>
                                <linearGradient id="premiumVolumeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                              </defs>
                              <path
                                className="text-gray-300/80 dark:text-gray-700/80"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="transition-all duration-150 ease-out"
                                strokeDasharray={`${volume * 100}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="url(#premiumVolumeGradient)"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            
                            <motion.div
                              animate={{ scale: isVolumeChanging ? [1, 1.15, 1] : 1 }}
                              transition={{ duration: 0.2 }}
                              className="relative z-10 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            >
                              {volume === 0 ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : volume < 0.5 ? (
                                <Volume1 className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </motion.div>
                            
                            {/* Z-INDEX FIXED: Smart Glassmorphism Floating Tooltip */}
                            <div className={`absolute -bottom-11 right-[-10px] bg-black/90 dark:bg-white/95 backdrop-blur-xl text-white dark:text-black text-[10px] font-extrabold px-2.5 py-1.5 rounded-full pointer-events-none shadow-[0_8px_16px_rgba(0,0,0,0.2)] tracking-widest flex items-center gap-1.5 border border-white/20 dark:border-black/10 z-[100] transition-all duration-300 ${isVolumeChanging ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 scale-95'}`}>
                              <span>VOL</span>
                              <span className="text-blue-400 dark:text-blue-600 font-mono bg-white/10 dark:bg-black/5 px-1.5 py-0.5 rounded-md">{Math.round(volume * 100)}%</span>
                            </div>
                          </div>

                          {/* Animated Equalizer Bars */}
                          <div className="flex gap-1 items-end h-4 mr-1">
                            <span className={`w-[3px] bg-slate-400 dark:bg-slate-500 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite_0ms] h-full' : 'h-2'}`}></span>
                            <span className={`w-[3px] bg-slate-400 dark:bg-slate-500 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite_200ms] h-3/4' : 'h-3'}`}></span>
                            <span className={`w-[3px] bg-slate-400 dark:bg-slate-500 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite_400ms] h-full' : 'h-1.5'}`}></span>
                          </div>
                        </div>
                      </div>

                      {/* Main Album Art (z-index adjusted to stay below tooltip) */}
                      <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] mb-5 z-10">
                        <img 
                          src={displayTracks[currentTrackIndex]?.cover} 
                          alt="Cover Art" 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                        />
                      </div>

                      {/* Track Details */}
                      <div className="text-center w-full px-4 mb-4 z-20 relative">
                        <h3 className="text-[17px] sm:text-lg font-extrabold text-slate-900 dark:text-white truncate tracking-tight">{displayTracks[currentTrackIndex]?.title}</h3>
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{displayTracks[currentTrackIndex]?.artist}</p>
                      </div>

                      {/* Player Controls */}
                      <div className="flex items-center justify-center gap-8 mb-4 w-full z-20 relative">
                        <button 
                          onClick={() => {
                            const prev = currentTrackIndex === 0 ? displayTracks.length - 1 : currentTrackIndex - 1;
                            togglePlay(prev);
                          }}
                          className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                          <SkipBack className="w-6 h-6" fill="currentColor" />
                        </button>

                        <button 
                          onClick={() => togglePlay(currentTrackIndex)}
                          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0a0a0a] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
                        >
                          {isPlaying 
                            ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" /> 
                            : <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" fill="currentColor" />
                          }
                        </button>

                        <button 
                          onClick={() => {
                            const next = currentTrackIndex === displayTracks.length - 1 ? 0 : currentTrackIndex + 1;
                            togglePlay(next);
                          }}
                          className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                          <SkipForward className="w-6 h-6" fill="currentColor" />
                        </button>
                      </div>
                    </div>

                    {/* Up Next Section */}
                    <div className="bg-[#e9ecef]/60 dark:bg-[#111]/80 p-6 pt-5 flex-1 relative z-10 border-t border-white/50 dark:border-white/5 backdrop-blur-lg">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-4">Up Next</h4>
                      
                      {/* Styled Scrollable List */}
                      <div className="flex flex-col gap-4 max-h-[160px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {displayTracks.map((track, idx) => {
                          if (idx === currentTrackIndex) return null; 
                          return (
                            <div key={track._id} onClick={() => togglePlay(idx)} className="group flex items-center gap-4 cursor-pointer">
                              <img 
                                src={track.cover} 
                                alt={track.title} 
                                className="w-[42px] h-[42px] rounded-xl object-cover shadow-sm group-hover:opacity-80 transition-opacity" 
                              />
                              <div className="flex-1 overflow-hidden">
                                <h5 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{track.title}</h5>
                                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-500 truncate">{track.artist}</p>
                              </div>
                            </div>
                          );
                        })}
                        {displayTracks.length === 1 && (
                          <div className="text-[12px] text-slate-400 text-center py-2">No more tracks in queue.</div>
                        )}
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
              
              <AnimatePresence mode="popLayout">
                {mobileNavLinks.map((link, idx) => {
                  const isActive = pathname === link.href || (pathname === "/" && link.href === "/");
                  return (
                    <motion.div 
                      key={link.name} 
                      layout
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
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
              </AnimatePresence>
            </div>

            {/* Bottom Mobile Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="p-8 pb-10 border-t border-gray-200/50 dark:border-gray-800/50 relative z-10 bg-white/50 dark:bg-[#0a0a0a]/50"
            >
              <p className="text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase mb-5">Connect</p>
              
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {socialLinks.map((social, idx) => (
                    <Link key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-black dark:text-white hover:text-blue-600 transition-colors">
                      {social.name}
                    </Link>
                  ))}
                </div>
              )}
              
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