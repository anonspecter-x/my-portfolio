"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Trophy, Code2, Play, 
  Terminal, Database, Server, 
  Cpu, Globe, Zap, Unlock, Network,
  Activity, Timer, ShieldCheck
} from "lucide-react";

type ViewState = "boot" | "menu" | "mem_play" | "mem_over" | "seq_play" | "seq_over";

interface MemoryCard { id: number; iconIndex: number; isFlipped: boolean; isMatched: boolean; }

const MemoryIcons = [Terminal, Database, Server, Cpu, Globe, Zap];
const SeqColors = [
  { id: 0, bg: "bg-red-500", glow: "shadow-[0_0_50px_rgba(239,68,68,0.6)]", border: "border-red-500/50" },
  { id: 1, bg: "bg-blue-500", glow: "shadow-[0_0_50px_rgba(59,130,246,0.6)]", border: "border-blue-500/50" },
  { id: 2, bg: "bg-green-500", glow: "shadow-[0_0_50px_rgba(34,197,94,0.6)]", border: "border-green-500/50" },
  { id: 3, bg: "bg-purple-500", glow: "shadow-[0_0_50px_rgba(168,85,247,0.6)]", border: "border-purple-500/50" }
];

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("boot");
  const [bootLog, setBootLog] = useState<string[]>([]);

  // ================= STATE: NEURAL MATRIX (MEMORY) =================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(40);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // ================= STATE: CORE SEQUENCE (SIMON SAYS) =================
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
        setTimeout(() => setView("menu"), 800);
      }
    }, 500);
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
          if (matchedCount + 1 === MemoryIcons.length) setTimeout(() => setView("mem_over"), 500);
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

  // 📌 STARTERS
  const startMemoryGame = () => {
    const deck = [...Array(MemoryIcons.length * 2)].map((_, i) => ({ id: i, iconIndex: i % MemoryIcons.length, isFlipped: false, isMatched: false })).sort(() => Math.random() - 0.5);
    setCards(deck); setMemMoves(0); setMemTimeLeft(40); setMatchedCount(0); setFlippedIndices([]); setIsChecking(false); setView("mem_play");
  };
  const startSeqGame = () => { setSeqScore(0); setPlayerStep(0); setSequence([Math.floor(Math.random() * 4)]); setView("seq_play"); };

  // ================= RENDER HELPERS =================
  const ResultScreen = ({ title, scoreLabel, score, onRetry, icon: Icon, success = false }: any) => (
    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-[#0a0a0a]/95 border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center backdrop-blur-3xl w-full max-w-sm mx-4 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${success ? "bg-blue-500" : "bg-red-500"}`}></div>
      <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[80px] ${success ? "bg-blue-500/20" : "bg-red-500/20"}`}></div>
      
      <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 relative z-10 border ${success ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
        <Icon className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 tracking-tight relative z-10">{title}</h2>
      
      <div className="bg-white/5 rounded-2xl p-6 my-8 border border-white/5 relative z-10">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] block mb-2">{scoreLabel}</span>
        <div className="text-5xl font-black text-white">{score}</div>
      </div>
      
      <div className="flex gap-3 relative z-10">
        <button onClick={onRetry} className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg">Retry</button>
        <button onClick={() => setView("menu")} className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10 py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-wider">Menu</button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans bg-[#030303]/95 backdrop-blur-3xl select-none">
          
          {/* 🌟 PREMIUM BACKGROUND EFFECTS */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
          <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          {view !== "boot" && (
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/5 text-gray-400 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-white transition-all z-50 hover:scale-105 active:scale-95 shadow-lg">
              <X className="w-5 h-5" />
            </button>
          )}

          {/* ================= BOOT SCREEN ================= */}
          {view === "boot" && (
            <div className="flex flex-col justify-center h-full w-full max-w-2xl px-6 font-mono relative z-10">
              <Unlock className="w-10 h-10 mb-8 text-blue-500 animate-pulse" />
              <div className="space-y-4 border-l-2 border-blue-500/30 pl-6 py-2">
                {bootLog.map((log, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-gray-300 text-sm md:text-base tracking-widest font-medium">
                    <span className="text-blue-500 mr-3">❯</span>{log}
                  </motion.p>
                ))}
              </div>
            </div>
          )}

          {/* ================= MENU SCREEN ================= */}
          {view === "menu" && (
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-4xl px-4 md:px-8 relative z-10">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
                  <Settings className="w-3.5 h-3.5" /> Admin Access Granted
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Diagnostic Tools</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">Select a restricted module to test your cognitive processing speed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Protocol 1: Neural Matrix */}
                <div onClick={startMemoryGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/10 hover:border-blue-500/50 rounded-[2rem] p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full transition-transform group-hover:scale-150"></div>
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                    <Cpu className="w-7 h-7 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Neural Matrix</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">Establish neural connections by matching encrypted architectural nodes before time runs out.</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-white uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Play className="w-3 h-3 ml-0.5" /></span>
                    Initialize
                  </div>
                </div>

                {/* Protocol 2: Core Sequence */}
                <div onClick={startSeqGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/10 hover:border-purple-500/50 rounded-[2rem] p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full transition-transform group-hover:scale-150"></div>
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors">
                    <Network className="w-7 h-7 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Core Sequence</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">Replicate the secure server ping sequence. One single error will terminate the connection instantly.</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-white uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white"><Play className="w-3 h-3 ml-0.5" /></span>
                    Initialize
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= 1. NEURAL MATRIX GAME ================= */}
          {view === "mem_play" && (
            <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
              <div className="flex w-full items-center justify-between bg-[#0a0a0a]/90 border border-white/10 px-6 py-4 rounded-[1.5rem] md:rounded-full backdrop-blur-xl mb-8 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center hidden md:flex">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Moves</span>
                    <span className="text-xl font-bold text-white leading-none mt-1">{memMoves}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex flex-col text-right md:text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Time Left</span>
                    <span className={`text-xl font-bold tabular-nums leading-none mt-1 ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{memTimeLeft.toString().padStart(2, "0")}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center hidden md:flex ${memTimeLeft <= 10 ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"}`}>
                    <Timer className={`w-4 h-4 ${memTimeLeft <= 10 ? "text-red-500" : "text-gray-400"}`} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full">
                {cards.map((card, index) => {
                  const Icon = MemoryIcons[card.iconIndex];
                  return (
                    <div key={card.id} onClick={() => handleCardFlip(index)} className="relative aspect-square cursor-pointer group touch-manipulation" style={{ perspective: "1000px" }}>
                      <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                        
                        {/* FRONT (HIDDEN CARD) */}
                        <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center hover:bg-white/5 transition-colors shadow-lg" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                          <Code2 className="w-6 h-6 md:w-8 md:h-8 text-white/10 group-hover:text-white/20 transition-colors" />
                        </div>

                        {/* BACK (REVEALED CARD) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0a0a0a] border rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-2xl overflow-hidden" 
                          style={{ 
                            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
                            borderColor: card.isMatched ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"
                          }}>
                          {card.isMatched && <div className="absolute inset-0 bg-green-500/10"></div>}
                          <Icon className={`w-8 h-8 md:w-10 md:h-10 relative z-10 ${card.isMatched ? "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "text-blue-400"}`} />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {view === "mem_over" && <ResultScreen title={matchedCount === MemoryIcons.length ? "Matrix Solved" : "Sync Failed"} scoreLabel="Matches Found" score={`${matchedCount}/${MemoryIcons.length}`} icon={matchedCount === MemoryIcons.length ? ShieldCheck : X} onRetry={startMemoryGame} success={matchedCount === MemoryIcons.length} />}

          {/* ================= 2. CORE SEQUENCE GAME ================= */}
          {view === "seq_play" && (
            <div className="relative z-10 flex flex-col items-center w-full px-4">
              <div className="bg-[#0a0a0a]/90 border border-white/10 px-10 py-4 rounded-[1.5rem] md:rounded-full backdrop-blur-xl mb-12 flex flex-col items-center shadow-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Sequence Level</span>
                <span className="text-3xl font-black text-white">{seqScore}</span>
              </div>
               
              <div className="grid grid-cols-2 gap-4 md:gap-6 p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-2xl shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] md:rounded-[3rem] pointer-events-none"></div>
                {SeqColors.map((color, idx) => (
                  <button 
                    key={idx} disabled={isShowingSeq} onPointerDown={(e) => { e.preventDefault(); handleSeqClick(idx); }} 
                    className={`w-28 h-28 md:w-40 md:h-40 rounded-2xl md:rounded-3xl border transition-all duration-200 touch-manipulation relative z-10
                    ${activeColor === idx ? `brightness-150 scale-95 ${color.bg} ${color.border} ${color.glow}` : `bg-[#0a0a0a] ${color.border} opacity-50 hover:opacity-80`}
                    ${isShowingSeq ? "cursor-not-allowed" : "cursor-pointer"}`} 
                  />
                ))}
              </div>
              <div className="h-10 mt-10 flex items-center justify-center">
                {isShowingSeq ? (
                  <p className="text-blue-400 animate-pulse font-mono tracking-[0.2em] text-xs font-bold uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Observing Pattern...
                  </p>
                ) : (
                  <p className="text-gray-400 font-mono tracking-[0.2em] text-xs font-bold uppercase">
                    Your Turn
                  </p>
                )}
              </div>
            </div>
          )}
          {view === "seq_over" && <ResultScreen title="Sequence Broken" scoreLabel="Nodes Cleared" score={seqScore} icon={Network} onRetry={startSeqGame} success={false} />}

        </motion.div>
      )}
    </AnimatePresence>
  );
}