"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Trophy, Code2, Play, RotateCcw, 
  ShieldCheck, Terminal, Database, Server, 
  Cpu, Globe, Zap, Unlock, Keyboard, Network,
  AlertTriangle, Crosshair, Sparkles, Activity
} from "lucide-react";

type ViewState = "boot" | "menu" | "bug_play" | "bug_over" | "mem_play" | "mem_over" | "type_play" | "type_over" | "seq_play" | "seq_over";

interface Anomaly { id: number; startX: number; startY: number; targetX: number; targetY: number; }
interface MemoryCard { id: number; iconIndex: number; isFlipped: boolean; isMatched: boolean; }

// Reduced to 6 pairs (12 cards) for perfect Mobile & Desktop Grid
const MemoryIcons = [Terminal, Database, Server, Cpu, Globe, Zap];
const CodeWords = ["function", "async", "await", "Promise", "return", "export", "import", "interface", "payload", "middleware", "deploy", "scalable"];
const SeqColors = [
  { id: 0, bg: "bg-red-500", glow: "shadow-[0_0_40px_rgba(239,68,68,0.8)]" },
  { id: 1, bg: "bg-blue-500", glow: "shadow-[0_0_40px_rgba(59,130,246,0.8)]" },
  { id: 2, bg: "bg-green-500", glow: "shadow-[0_0_40px_rgba(34,197,94,0.8)]" },
  { id: 3, bg: "bg-purple-500", glow: "shadow-[0_0_40px_rgba(168,85,247,0.8)]" }
];

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("boot");
  const [bootLog, setBootLog] = useState<string[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ================= STATE: PHANTOM PROTOCOL (GLITCH HUNTER) =================
  const [bugScore, setBugScore] = useState(0);
  const [bugTimeLeft, setBugTimeLeft] = useState(20);
  const [bugs, setBugs] = useState<Anomaly[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const bugIdCounter = useRef(0);

  // ================= STATE: NEURAL MATRIX (MEMORY) =================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(40);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // ================= STATE: SYNTAX UPLINK (TYPER) =================
  const [typeScore, setTypeScore] = useState(0);
  const [typeTimeLeft, setTypeTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const typeInputRef = useRef<HTMLInputElement>(null);

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

  // 📌 BOOT SEQUENCE (CINEMATIC)
  const startBootSequence = () => {
    const logs = [
      "INITIATING OVERRIDE PROTOCOL...",
      "BYPASSING FRONTEND FIREWALL...",
      "DECRYPTING CORE ASSETS...",
      "ESTABLISHING SECURE CONNECTION...",
      "ACCESS GRANTED. WELCOME, ADMIN."
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
    }, 600);
  };

  // 📌 PHANTOM PROTOCOL LOGIC
  useEffect(() => {
    let timer: NodeJS.Timeout, spawner: NodeJS.Timeout;
    if (view === "bug_play") {
      timer = setInterval(() => setBugTimeLeft((prev) => (prev <= 1 ? (setView("bug_over"), 0) : prev - 1)), 1000);
      spawner = setInterval(() => {
        if (gameAreaRef.current && bugs.length < 7) {
          const { clientWidth, clientHeight } = gameAreaRef.current;
          // Responsive bounds mapping
          const startX = Math.random() * (clientWidth - 80);
          const startY = Math.random() * (clientHeight - 80);
          const targetX = Math.random() * (clientWidth - 80);
          const targetY = Math.random() * (clientHeight - 80);
          
          const newBug = { id: ++bugIdCounter.current, startX, startY, targetX, targetY };
          setBugs(prev => [...prev, newBug]);
          setTimeout(() => setBugs(prev => prev.filter(b => b.id !== newBug.id)), 2000); // Disappear fast
        }
      }, 600);
    }
    return () => { clearInterval(timer); clearInterval(spawner); };
  }, [view, bugs.length]);

  const squashAnomaly = (id: number, e: React.MouseEvent | React.TouchEvent, x: number, y: number) => {
    e.stopPropagation(); e.preventDefault();
    setBugs(prev => prev.filter(bug => bug.id !== id));
    setBugScore(prev => prev + 1);
    const pId = Date.now();
    setParticles(prev => [...prev, { id: pId, x, y }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== pId)), 400);
  };

  // 📌 NEURAL MATRIX LOGIC (FIXED)
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

  // 📌 SYNTAX UPLINK LOGIC
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === "type_play") {
      setTimeout(() => typeInputRef.current?.focus(), 100);
      timer = setInterval(() => setTypeTimeLeft((prev) => (prev <= 1 ? (setView("type_over"), 0) : prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [view]);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.trim() === currentWord) {
      setTypeScore(prev => prev + 1);
      setInputValue("");
      setCurrentWord(CodeWords[Math.floor(Math.random() * CodeWords.length)]);
    }
  };

  // 📌 CORE SEQUENCE LOGIC
  const playSequence = async (seq: number[]) => {
    setIsShowingSeq(true);
    await new Promise(r => setTimeout(r, 500));
    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, 500));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, 300));
    }
    setIsShowingSeq(false);
  };

  useEffect(() => {
    if (view === "seq_play" && sequence.length > 0 && playerStep === 0) playSequence(sequence);
  }, [sequence, view]);

  const handleSeqClick = (colorIdx: number) => {
    if (isShowingSeq) return;
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 200);

    if (sequence[playerStep] === colorIdx) {
      if (playerStep + 1 === sequence.length) {
        setSeqScore(sequence.length);
        setPlayerStep(0);
        setTimeout(() => setSequence(prev => [...prev, Math.floor(Math.random() * 4)]), 800);
      } else {
        setPlayerStep(prev => prev + 1);
      }
    } else {
      setTimeout(() => setView("seq_over"), 400);
    }
  };

  // 📌 STARTERS
  const startBugGame = () => { setBugScore(0); setBugTimeLeft(20); setBugs([]); setParticles([]); setView("bug_play"); };
  const startMemoryGame = () => {
    const deck = [...Array(MemoryIcons.length * 2)].map((_, i) => ({ id: i, iconIndex: i % MemoryIcons.length, isFlipped: false, isMatched: false })).sort(() => Math.random() - 0.5);
    setCards(deck); setMemMoves(0); setMemTimeLeft(40); setMatchedCount(0); setFlippedIndices([]); setIsChecking(false); setView("mem_play");
  };
  const startTypeGame = () => { setTypeScore(0); setTypeTimeLeft(30); setInputValue(""); setCurrentWord(CodeWords[Math.floor(Math.random() * CodeWords.length)]); setView("type_play"); };
  const startSeqGame = () => { setSeqScore(0); setPlayerStep(0); setSequence([Math.floor(Math.random() * 4)]); setView("seq_play"); };

  // ================= RENDER HELPERS =================
  const ResultScreen = ({ title, scoreLabel, score, onRetry, icon: Icon, success = false }: any) => (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a0a]/90 border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center backdrop-blur-3xl w-full max-w-sm mx-4 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${success ? "bg-blue-500" : "bg-red-500"}`}></div>
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${success ? "bg-blue-500/10 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]"}`}>
        <Icon className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{title}</h2>
      <div className="bg-white/5 rounded-2xl p-6 my-8 border border-white/5">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] block mb-2">{scoreLabel}</span>
        <div className="text-5xl font-black text-white">{score}</div>
      </div>
      <div className="flex gap-3">
        <button onClick={onRetry} className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider">Retry</button>
        <button onClick={() => setView("menu")} className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10 py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-wider">Menu</button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans bg-[#030303]/95 backdrop-blur-3xl">
          
          {/* 🌟 BILLION DOLLAR BACKGROUND EFFECTS */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-[0.1] mix-blend-overlay pointer-events-none"></div>

          {view !== "boot" && (
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/5 text-gray-400 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-white transition-all z-50">
              <X className="w-5 h-5" />
            </button>
          )}

          {/* ================= BOOT SCREEN ================= */}
          {view === "boot" && (
            <div className="flex flex-col justify-center h-full w-full max-w-2xl px-6 font-mono">
              <Unlock className="w-12 h-12 mb-8 animate-pulse text-blue-500" />
              <div className="space-y-3">
                {bootLog.map((log, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-blue-400 text-sm md:text-lg tracking-widest">{log}</motion.p>
                ))}
              </div>
            </div>
          )}

          {/* ================= MENU SCREEN ================= */}
          {view === "menu" && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl px-4 md:px-8 max-h-screen overflow-y-auto py-12 custom-scrollbar relative z-10">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">SYSTEM PROTOCOLS</h2>
                <p className="text-gray-400 text-sm md:text-base">Select a diagnostic module to begin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-10">
                {/* Protocol 1 */}
                <div onClick={startBugGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/5 hover:border-red-500/30 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <Crosshair className="w-10 h-10 text-red-500 mb-5" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Phantom Protocol</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">Intercept and neutralize unauthorized anomalies moving across the DOM.</p>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2"><Play className="w-3 h-3" /> Execute</span>
                </div>

                {/* Protocol 2 */}
                <div onClick={startMemoryGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <Cpu className="w-10 h-10 text-blue-500 mb-5" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Neural Matrix</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">Establish neural connections by matching encrypted architectural nodes.</p>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2"><Play className="w-3 h-3" /> Execute</span>
                </div>

                {/* Protocol 3 */}
                <div onClick={startTypeGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/5 hover:border-green-500/30 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <Terminal className="w-10 h-10 text-green-500 mb-5" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Syntax Uplink</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">Calibrate input speeds. Type the required syntax blocks accurately.</p>
                  <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-2"><Play className="w-3 h-3" /> Execute</span>
                </div>

                {/* Protocol 4 */}
                <div onClick={startSeqGame} className="group cursor-pointer bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <Network className="w-10 h-10 text-purple-500 mb-5" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Core Sequence</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">Replicate the secure server ping sequence without a single error.</p>
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2"><Play className="w-3 h-3" /> Execute</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= 1. PHANTOM PROTOCOL GAME ================= */}
          {view === "bug_play" && (
            <div ref={gameAreaRef} className="absolute inset-0 z-10">
              <div className="absolute top-6 md:top-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-between md:justify-center md:gap-8 bg-[#0a0a0a]/80 border border-white/10 px-6 py-3 rounded-2xl md:rounded-full backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest md:hidden">Kills</span><span className="text-xl md:text-2xl font-black text-white">{bugScore}</span></div>
                <div className="w-px h-6 bg-white/20 hidden md:block"></div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest md:hidden">Time</span><span className={`text-xl md:text-2xl font-black tabular-nums ${bugTimeLeft <= 5 ? "text-red-500" : "text-white"}`}>00:{bugTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>

              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button 
                    key={bug.id} 
                    initial={{ x: bug.startX, y: bug.startY, scale: 0, opacity: 0 }} 
                    animate={{ x: bug.targetX, y: bug.targetY, scale: 1, opacity: 1 }} 
                    exit={{ scale: 0, opacity: 0 }} 
                    transition={{ duration: 2.5, ease: "linear" }}
                    onMouseDown={(e) => squashAnomaly(bug.id, e, bug.targetX, bug.targetY)} 
                    onTouchStart={(e) => squashAnomaly(bug.id, e, bug.targetX, bug.targetY)} 
                    className="absolute w-14 h-14 md:w-16 md:h-16 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl flex items-center justify-center backdrop-blur-md cursor-crosshair" 
                  >
                    <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.button>
                ))}
              </AnimatePresence>
              {particles.map(p => (
                <motion.div key={p.id} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.4 }} className="absolute w-16 h-16 bg-red-500 rounded-full pointer-events-none blur-md mix-blend-screen" style={{ left: p.x, top: p.y }} />
              ))}
            </div>
          )}
          {view === "bug_over" && <ResultScreen title="Area Secured" scoreLabel="Anomalies Destroyed" score={bugScore} icon={ShieldCheck} onRetry={startBugGame} success={true} />}

          {/* ================= 2. NEURAL MATRIX GAME ================= */}
          {view === "mem_play" && (
            <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
              <div className="flex w-full items-center justify-between bg-[#0a0a0a]/80 border border-white/10 px-6 py-4 rounded-2xl md:rounded-full backdrop-blur-xl mb-8">
                <div className="flex items-center gap-3"><Activity className="w-5 h-5 text-blue-500 hidden md:block" /><div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Moves</span><span className="text-xl font-bold text-white leading-none">{memMoves}</span></div></div>
                <div className="flex items-center gap-3"><Timer className={`w-5 h-5 hidden md:block ${memTimeLeft <= 10 ? "text-red-500" : "text-gray-400"}`} /><div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Time</span><span className={`text-xl font-bold tabular-nums leading-none ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{memTimeLeft.toString().padStart(2, "0")}</span></div></div>
              </div>
              
              {/* Responsive Grid: 3 cols mobile, 4 cols desktop for 12 cards */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 w-full">
                {cards.map((card, index) => {
                  const Icon = MemoryIcons[card.iconIndex];
                  return (
                    <div key={card.id} onClick={() => handleCardFlip(index)} className="relative aspect-square cursor-pointer group" style={{ perspective: "1000px" }}>
                      <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                        
                        {/* FRONT */}
                        <div className="absolute inset-0 bg-[#111] border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#1a1a1a] transition-colors shadow-lg" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                          <Code2 className="w-6 h-6 md:w-8 md:h-8 text-white/10" />
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 bg-blue-900/20 border rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl" 
                          style={{ 
                            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
                            borderColor: card.isMatched ? "rgba(34,197,94,0.4)" : "rgba(59,130,246,0.3)"
                          }}>
                          <Icon className={`w-8 h-8 md:w-10 md:h-10 ${card.isMatched ? "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" : "text-blue-400"}`} />
                        </div>

                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {view === "mem_over" && <ResultScreen title={matchedCount === MemoryIcons.length ? "Matrix Solved" : "Sync Failed"} scoreLabel="Matches Found" score={`${matchedCount}/${MemoryIcons.length}`} icon={matchedCount === MemoryIcons.length ? Trophy : X} onRetry={startMemoryGame} success={matchedCount === MemoryIcons.length} />}

          {/* ================= 3. SYNTAX UPLINK GAME ================= */}
          {view === "type_play" && (
            <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
              <div className="w-full flex justify-between items-center bg-[#0a0a0a]/80 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-xl mb-12">
                <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Syntax</span><span className="text-xl font-bold text-white">{typeScore}</span></div>
                <div className="flex flex-col text-right"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Time</span><span className="text-xl font-bold text-white tabular-nums">00:{typeTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>
              
              <div className="text-3xl md:text-5xl font-mono text-green-400 font-bold mb-10 tracking-widest break-all text-center">{currentWord}</div>
              
              <input 
                ref={typeInputRef} type="text" value={inputValue} onChange={handleType} placeholder="Type syntax..." 
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-green-500/50 text-white font-mono text-lg md:text-xl p-5 md:p-6 rounded-2xl outline-none text-center shadow-2xl transition-all" 
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
              />
            </div>
          )}
          {view === "type_over" && <ResultScreen title="Uplink Terminated" scoreLabel="Lines Written" score={typeScore} icon={Keyboard} onRetry={startTypeGame} success={true} />}

          {/* ================= 4. CORE SEQUENCE GAME ================= */}
          {view === "seq_play" && (
            <div className="relative z-10 flex flex-col items-center w-full px-4">
              <div className="bg-[#0a0a0a]/80 border border-white/10 px-8 py-3 rounded-full backdrop-blur-xl mb-12 flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Sequence Level</span>
                <span className="text-2xl font-black text-white">{seqScore}</span>
              </div>
               
              <div className="grid grid-cols-2 gap-4 md:gap-6 p-6 md:p-8 bg-white/5 border border-white/5 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-2xl">
                {SeqColors.map((color, idx) => (
                  <button 
                    key={idx} disabled={isShowingSeq} onPointerDown={() => handleSeqClick(idx)} 
                    className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl md:rounded-3xl ${color.bg} transition-all duration-200 
                    ${activeColor === idx ? `brightness-150 scale-105 ${color.glow}` : "opacity-40 hover:opacity-70"}
                    ${isShowingSeq ? "cursor-not-allowed" : "cursor-pointer"}`} 
                  />
                ))}
              </div>
              <div className="h-10 mt-8 flex items-center justify-center">
                {isShowingSeq && <p className="text-white animate-pulse font-mono tracking-widest text-sm uppercase">Observing Pattern...</p>}
              </div>
            </div>
          )}
          {view === "seq_over" && <ResultScreen title="Sequence Broken" scoreLabel="Nodes Cleared" score={seqScore} icon={Network} onRetry={startSeqGame} success={false} />}

        </motion.div>
      )}
    </AnimatePresence>
  );
}