"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Trophy, Code2, Play, 
  Terminal, Database, Server, 
  Cpu, Globe, Zap, Unlock, Network,
  Activity, Timer, ShieldCheck, Settings, AlertTriangle,
  Wifi, HardDrive, Monitor, Shield, Key, Fingerprint
} from "lucide-react";

type ViewState = "boot" | "menu" | "mem_play" | "mem_over" | "seq_play" | "seq_over";

interface MemoryCard { id: number; iconIndex: number; isFlipped: boolean; isMatched: boolean; }

// 📌 Expanded Icon Pool for True Randomness
const AllMemoryIcons = [Terminal, Database, Server, Cpu, Globe, Zap, Wifi, HardDrive, Monitor, Shield, Key, Fingerprint];

const SeqColorsBase = [
  { id: 0, off: "bg-rose-950/30 border-rose-500/20 text-rose-900", on: "bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.8)] border-rose-400 scale-[0.98] brightness-125" },
  { id: 1, off: "bg-cyan-950/30 border-cyan-500/20 text-cyan-900", on: "bg-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.8)] border-cyan-400 scale-[0.98] brightness-125" },
  { id: 2, off: "bg-emerald-950/30 border-emerald-500/20 text-emerald-900", on: "bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.8)] border-emerald-400 scale-[0.98] brightness-125" },
  { id: 3, off: "bg-violet-950/30 border-violet-500/20 text-violet-900", on: "bg-violet-500 shadow-[0_0_50px_rgba(139,92,246,0.8)] border-violet-400 scale-[0.98] brightness-125" }
];

// 📌 Robust Shuffle Algorithm (Fisher-Yates)
const shuffleArray = (array: any[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("boot");
  const [bootLog, setBootLog] = useState<string[]>([]);

  // ================= STATE: NEURAL MATRIX (MEMORY) =================
  const [currentMemIcons, setCurrentMemIcons] = useState<any[]>([]);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(40);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // ================= STATE: CORE SEQUENCE (SIMON SAYS) =================
  const [gridColors, setGridColors] = useState<any[]>(SeqColorsBase);
  const [seqScore, setSeqScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [isShowingSeq, setIsShowingSeq] = useState(false);

  // 📌 LISTENER
  useEffect(() => {
    const handleTrigger = () => { setIsOpen(true); setView("boot"); startBootSequence(); };
    window.addEventListener("trigger-easter-egg", handleTrigger);
    return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
  }, []);

  // 📌 BOOT SEQUENCE
  const startBootSequence = () => {
    const logs = [
      "INITIALIZING SECURE ENVIRONMENT...",
      "BYPASSING STANDARD PROTOCOLS...",
      "DECRYPTING ADMIN MODULES...",
      "SYSTEM OVERRIDE SUCCESSFUL."
    ];
    setBootLog([]);
    let step = 0;
    const interval = setInterval(() => {
      setBootLog(prev => [...prev, logs[step]]);
      step++;
      if (step === logs.length) {
        clearInterval(interval);
        setTimeout(() => setView("menu"), 1000);
      }
    }, 400);
  };

  // 📌 NEURAL MATRIX LOGIC
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === "mem_play") {
      timer = setInterval(() => setMemTimeLeft((prev) => (prev <= 1 ? (setView("mem_over"), 0) : prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [view]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [first, second] = flippedIndices;
      if (cards[first].iconIndex === cards[second].iconIndex) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second ? { ...c, isMatched: true } : c)));
          setMatchedCount(prev => prev + 1);
          setFlippedIndices([]); setIsChecking(false);
          if (matchedCount + 1 === 6) setTimeout(() => setView("mem_over"), 500); // 6 pairs to win
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second ? { ...c, isFlipped: false } : c)));
          setFlippedIndices([]); setIsChecking(false);
        }, 800);
      }
    }
  }, [flippedIndices, cards, matchedCount]);

  const handleCardFlip = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;
    setCards(prev => prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)));
    setFlippedIndices(prev => [...prev, index]);
    if (flippedIndices.length === 0) setMemMoves(prev => prev + 1);
  };

  // 📌 CORE SEQUENCE LOGIC
  const playSequence = async (seq: number[]) => {
    setIsShowingSeq(true);
    await new Promise(r => setTimeout(r, 600));
    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsShowingSeq(false);
  };

  useEffect(() => {
    if (view === "seq_play" && sequence.length > 0 && playerStep === 0) playSequence(sequence);
  }, [sequence, view]);

  const handleSeqClick = (colorIdx: number) => {
    if (isShowingSeq) return;
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 150);

    if (sequence[playerStep] === colorIdx) {
      if (playerStep + 1 === sequence.length) {
        setSeqScore(sequence.length);
        setPlayerStep(0);
        setTimeout(() => setSequence(prev => [...prev, Math.floor(Math.random() * 4)]), 600);
      } else {
        setPlayerStep(prev => prev + 1);
      }
    } else {
      setTimeout(() => setView("seq_over"), 300);
    }
  };

  // 📌 DYNAMIC STARTERS
  const startMemoryGame = () => {
    const selectedIcons = shuffleArray(AllMemoryIcons).slice(0, 6);
    setCurrentMemIcons(selectedIcons);

    const deck = [...Array(12)].map((_, i) => ({ 
      id: i, 
      iconIndex: i % 6, 
      isFlipped: false, 
      isMatched: false 
    }));
    
    setCards(shuffleArray(deck)); 
    setMemMoves(0); 
    setMemTimeLeft(40); 
    setMatchedCount(0); 
    setFlippedIndices([]); 
    setIsChecking(false); 
    setView("mem_play");
  };

  const startSeqGame = () => {
    setGridColors(shuffleArray(SeqColorsBase));
    setSeqScore(0); 
    setPlayerStep(0); 
    setSequence([Math.floor(Math.random() * 4)]); 
    setView("seq_play"); 
  };

  // ================= RENDER HELPERS =================
  const ResultScreen = ({ title, scoreLabel, score, onRetry, icon: Icon, success = false }: any) => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }} 
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} 
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center w-full max-w-[90%] sm:max-w-sm mx-auto relative overflow-hidden my-auto"
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${success ? "bg-cyan-500" : "bg-rose-500"}`}></div>
      <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none ${success ? "bg-cyan-500/20" : "bg-rose-500/20"}`}></div>
      
      <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl flex items-center justify-center mb-5 md:mb-6 relative z-10 border shadow-inner ${success ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
        <Icon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight relative z-10">{title}</h2>
      
      <div className="bg-white/5 rounded-2xl p-5 md:p-6 my-6 md:my-8 border border-white/5 relative z-10 shadow-inner">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] block mb-2">{scoreLabel}</span>
        <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">{score}</div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 relative z-10">
        <button onClick={onRetry} className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-xs md:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">Retry</button>
        <button onClick={() => setView("menu")} className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 py-3 md:py-4 rounded-xl font-bold transition-all text-xs md:text-sm uppercase tracking-widest">Menu</button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[9999] font-sans bg-[#020202]/90 backdrop-blur-2xl select-none flex flex-col items-center overflow-hidden"
        >
          {/* 🌟 PREMIUM CYBERPUNK BACKGROUND EFFECTS */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none"></div>
          
          {/* Animated Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
            className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"
          />

          {view !== "boot" && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-[#0a0a0a] text-gray-400 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-white transition-all z-50 hover:scale-110 active:scale-95 shadow-2xl"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )}

          {/* INNER SCROLLABLE CONTAINER FOR MOBILE SAFETY */}
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto px-4 py-16 md:py-8 z-10">
            {/* ================= BOOT SCREEN ================= */}
            <AnimatePresence mode="wait">
              {view === "boot" && (
                <motion.div key="boot" exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col justify-center h-full w-full max-w-2xl px-6 font-mono relative z-10">
                  <Unlock className="w-8 h-8 md:w-10 md:h-10 mb-6 md:mb-8 text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse" />
                  <div className="space-y-3 md:space-y-4 border-l-2 border-cyan-500/30 pl-4 md:pl-6 py-2">
                    {bootLog.map((log, i) => (
                      <motion.p key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring" }} className="text-gray-300 text-xs sm:text-sm md:text-base tracking-widest font-medium uppercase drop-shadow-md">
                        <span className="text-cyan-500 mr-3 md:mr-4">❯</span>{log}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ================= MENU SCREEN ================= */}
              {view === "menu" && (
                <motion.div key="menu" initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-4xl px-2 md:px-8 relative z-10 my-auto">
                  <div className="text-center mb-8 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-[0.25em] mb-4 md:mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                      <Settings className="w-3 h-3 md:w-3.5 md:h-3.5" /> Admin Access Granted
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-3 md:mb-4 drop-shadow-xl">Diagnostic Tools</h2>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xs md:max-w-md mx-auto leading-relaxed">Select a restricted module below to test your cognitive processing and system response time.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Protocol 1: Neural Matrix */}
                    <div onClick={startMemoryGame} className="group cursor-pointer bg-[#050505]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-40 h-40 md:w-56 md:h-56 bg-cyan-500/20 blur-[60px] rounded-full transition-transform duration-700 group-hover:scale-150"></div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-300 shadow-inner">
                        <Cpu className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tight">Neural Matrix</h3>
                      <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-10 leading-relaxed font-medium">Establish neural connections by matching encrypted architectural nodes before the server timeout.</p>
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"><Play className="w-3 h-3 md:w-4 md:h-4 ml-0.5" /></span>
                        Initialize
                      </div>
                    </div>

                    {/* Protocol 2: Core Sequence */}
                    <div onClick={startSeqGame} className="group cursor-pointer bg-[#050505]/80 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-40 h-40 md:w-56 md:h-56 bg-violet-500/20 blur-[60px] rounded-full transition-transform duration-700 group-hover:scale-150"></div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-violet-500/20 group-hover:border-violet-500/40 transition-all duration-300 shadow-inner">
                        <Network className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-violet-400 transition-colors" />
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tight">Core Sequence</h3>
                      <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-10 leading-relaxed font-medium">Replicate the secure server ping sequence. A single error will terminate the connection instantly.</p>
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-violet-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(139,92,246,0.5)]"><Play className="w-3 h-3 md:w-4 md:h-4 ml-0.5" /></span>
                        Initialize
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= 1. NEURAL MATRIX GAME ================= */}
              {view === "mem_play" && (
                <motion.div key="mem_play" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-3xl flex flex-col items-center my-auto">
                  
                  {/* Sleek HUD */}
                  <div className="w-full flex items-center justify-between bg-black/40 border border-white/10 px-4 py-3 md:px-8 md:py-5 rounded-2xl md:rounded-[2rem] backdrop-blur-2xl mb-6 md:mb-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-3 md:gap-5 relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-cyan-500/10 border border-cyan-500/20 hidden sm:flex items-center justify-center shadow-inner">
                        <Activity className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] md:tracking-[0.25em]">Moves</span>
                        <span className="text-xl md:text-2xl font-black text-white leading-none mt-1 md:mt-1.5">{memMoves}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-5 relative z-10">
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] md:tracking-[0.25em]">Time</span>
                        <span className={`text-xl md:text-2xl font-black tabular-nums leading-none mt-1 md:mt-1.5 transition-colors ${memTimeLeft <= 10 ? "text-rose-500 animate-pulse" : "text-white"}`}>
                          00:{memTimeLeft.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border hidden sm:flex items-center justify-center shadow-inner transition-colors ${memTimeLeft <= 10 ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-white/5 border-white/10 text-gray-400"}`}>
                        {memTimeLeft <= 10 ? <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" /> : <Timer className="w-4 h-4 md:w-5 md:h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 w-full">
                    {cards.map((card, index) => {
                      const Icon = currentMemIcons[card.iconIndex];
                      return (
                        <div key={card.id} onClick={() => handleCardFlip(index)} className="relative aspect-square cursor-pointer group touch-manipulation" style={{ perspective: "1000px" }}>
                          <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 25 }} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                            
                            {/* FRONT (HIDDEN CARD) */}
                            <div className="absolute inset-0 bg-[#080808] border border-white/10 rounded-xl md:rounded-[1.5rem] flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
                              <Code2 className="w-6 h-6 md:w-10 md:h-10 text-white/10 group-hover:text-white/30 transition-colors relative z-10" />
                            </div>

                            {/* BACK (REVEALED CARD) */}
                            <div className={`absolute inset-0 border rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300 ${card.isMatched ? "bg-emerald-950/40 border-emerald-500/40" : "bg-cyan-950/40 border-cyan-500/40"}`} 
                              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                              <div className={`absolute inset-0 blur-xl opacity-30 ${card.isMatched ? "bg-emerald-500" : "bg-cyan-500"}`}></div>
                              {Icon && <Icon className={`w-8 h-8 md:w-12 md:h-12 relative z-10 ${card.isMatched ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" : "text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"}`} />}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ================= 2. CORE SEQUENCE GAME ================= */}
              {view === "seq_play" && (
                <motion.div key="seq_play" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="relative z-10 flex flex-col items-center w-full my-auto">
                  
                  <div className="bg-black/40 border border-white/10 px-8 py-3 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] backdrop-blur-2xl mb-8 md:mb-12 flex flex-col items-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
                    <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-1.5">Current Level</span>
                    <span className="text-3xl md:text-4xl font-black text-white leading-none">{seqScore}</span>
                  </div>
                   
                  <div className="grid grid-cols-2 gap-4 md:gap-6 p-4 sm:p-6 md:p-8 bg-[#050505]/60 border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative mx-auto">
                    <div className="absolute inset-0 border border-white/5 rounded-[2rem] md:rounded-[3rem] pointer-events-none"></div>
                    {gridColors.map((color) => (
                      <button 
                        key={color.id} disabled={isShowingSeq} onPointerDown={(e) => { e.preventDefault(); handleSeqClick(color.id); }} 
                        className={`w-24 h-24 sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-150 touch-manipulation relative z-10 flex items-center justify-center overflow-hidden outline-none
                        ${activeColor === color.id ? color.on : color.off}
                        ${isShowingSeq ? "cursor-not-allowed" : "cursor-pointer hover:border-white/40"}`} 
                      >
                        <div className={`absolute inset-0 opacity-20 bg-current transition-opacity ${activeColor === color.id ? "opacity-50" : ""}`}></div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-8 md:h-10 mt-8 md:mt-12 flex items-center justify-center">
                    {isShowingSeq ? (
                      <p className="text-violet-400 animate-pulse font-mono tracking-[0.15em] md:tracking-[0.25em] text-[10px] md:text-[11px] font-bold uppercase flex items-center gap-2">
                        <Activity className="w-3 h-3 md:w-4 md:h-4" /> Observing Node Pattern...
                      </p>
                    ) : (
                      <p className="text-gray-400 font-mono tracking-[0.15em] md:tracking-[0.25em] text-[10px] md:text-[11px] font-bold uppercase drop-shadow-md">
                        Awaiting Input...
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* RESULTS SCREEN */}
              {view === "mem_over" && <ResultScreen key="mem_over" title={matchedCount === 6 ? "Matrix Solved" : "Sync Failed"} scoreLabel="Nodes Decrypted" score={`${matchedCount}/6`} icon={matchedCount === 6 ? ShieldCheck : AlertTriangle} onRetry={startMemoryGame} success={matchedCount === 6} />}
              {view === "seq_over" && <ResultScreen key="seq_over" title="Sequence Broken" scoreLabel="Nodes Cleared" score={seqScore} icon={Network} onRetry={startSeqGame} success={false} />}
            
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}