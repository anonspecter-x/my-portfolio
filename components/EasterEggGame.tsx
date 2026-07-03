"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bug, X, Trophy, Code2, Play, RotateCcw, 
  ShieldCheck, Terminal, Database, Server, 
  Cpu, Globe, Layout, Sparkles, Gamepad2, Timer
} from "lucide-react";

// ==========================================
// 📌 TYPES & INTERFACES
// ==========================================
type ViewState = "menu" | "bug_play" | "bug_over" | "mem_play" | "mem_over";

interface BugEntity {
  id: number;
  top: number;
  left: number;
}

interface MemoryCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

// 📌 Memory Game Icons
const MemoryIcons = [Terminal, Database, Server, Cpu, Globe, Layout];

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("menu");

  // ================= BUG SQUASHER STATE =================
  const [bugScore, setBugScore] = useState(0);
  const [bugTimeLeft, setBugTimeLeft] = useState(15);
  const [bugs, setBugs] = useState<BugEntity[]>([]);
  const bugIdCounter = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ================= MEMORY MATRIX STATE =================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(30);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);

  // 📌 1. TRIGGER LISTENER
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setView("menu");
    };
    window.addEventListener("trigger-easter-egg", handleTrigger);
    return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
  }, []);

  // 📌 2. BUG SQUASHER LOGIC
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let bugInterval: NodeJS.Timeout;

    if (view === "bug_play") {
      timerInterval = setInterval(() => {
        setBugTimeLeft((prev) => {
          if (prev <= 1) {
            setView("bug_over");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      bugInterval = setInterval(() => {
        if (gameAreaRef.current) {
          const { clientWidth, clientHeight } = gameAreaRef.current;
          const top = Math.floor(Math.random() * (clientHeight - 80)) + 20;
          const left = Math.floor(Math.random() * (clientWidth - 80)) + 20;
          const newBug = { id: ++bugIdCounter.current, top, left };
          
          setBugs((prev) => [...prev, newBug]);
          setTimeout(() => setBugs((prev) => prev.filter((b) => b.id !== newBug.id)), 1200);
        }
      }, 500); 
    }
    return () => { clearInterval(timerInterval); clearInterval(bugInterval); };
  }, [view]);

  // 📌 3. MEMORY MATRIX LOGIC
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (view === "mem_play") {
      timerInterval = setInterval(() => {
        setMemTimeLeft((prev) => {
          if (prev <= 1) {
            setView("mem_over");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [view]);

  // Check Matches
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].iconIndex === cards[second].iconIndex) {
        setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isMatched: true } : card)));
        setMatchedCount((prev) => prev + 1);
        setFlippedIndices([]);
        if (matchedCount + 1 === MemoryIcons.length) {
          setTimeout(() => setView("mem_over"), 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isFlipped: false } : card)));
          setFlippedIndices([]);
        }, 800);
      }
    }
  }, [flippedIndices, cards, matchedCount]);

  // 📌 4. HANDLERS
  const startBugGame = () => {
    setBugScore(0); setBugTimeLeft(15); setBugs([]); setView("bug_play");
  };

  const squashBug = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setBugScore((prev) => prev + 1);
  };

  const startMemoryGame = () => {
    // Generate and shuffle cards
    const deck = [...Array(MemoryIcons.length * 2)].map((_, i) => ({
      id: i,
      iconIndex: i % MemoryIcons.length,
      isFlipped: false,
      isMatched: false,
    })).sort(() => Math.random() - 0.5);

    setCards(deck); setMemMoves(0); setMemTimeLeft(30); setMatchedCount(0); setFlippedIndices([]); setView("mem_play");
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
    setFlippedIndices((prev) => [...prev, index]);
    if (flippedIndices.length === 1) setMemMoves((prev) => prev + 1);
  };

  const closeGame = () => { setIsOpen(false); setView("menu"); };

  // ================= UI COMPONENTS =================
  const MenuScreen = () => (
    <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-3xl relative z-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl backdrop-blur-md">
          <Gamepad2 className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Secret Console Unlocked</h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">You've found the hidden developer arcade. Select a module to test your reflexes or memory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bug Squasher Card */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startBugGame} className="group cursor-pointer relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 overflow-hidden backdrop-blur-xl shadow-2xl hover:border-red-500/50 transition-colors">
          <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Bug className="w-12 h-12 text-red-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Bug Squasher</h3>
          <p className="text-gray-400 text-sm mb-8">The system is infected! Squash as many bugs as possible in 15 seconds.</p>
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            <Play className="w-4 h-4" /> Play Now
          </div>
        </motion.div>

        {/* Memory Matrix Card */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startMemoryGame} className="group cursor-pointer relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 overflow-hidden backdrop-blur-xl shadow-2xl hover:border-blue-500/50 transition-colors">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Cpu className="w-12 h-12 text-blue-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Memory Matrix</h3>
          <p className="text-gray-400 text-sm mb-8">Test your stack knowledge. Match all the tech icons before the timer runs out.</p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            <Play className="w-4 h-4" /> Play Now
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
          {/* Million-Dollar Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>

          {/* Close Button */}
          <button onClick={closeGame} className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all z-50 backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>

          {/* VIEW ROUTER */}
          {view === "menu" && <MenuScreen />}

          {/* ================= BUG SQUASHER GAME ================= */}
          {view === "bug_play" && (
            <div ref={gameAreaRef} className="absolute inset-0 z-10">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/10 border border-white/20 px-8 py-4 rounded-full backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3"><Trophy className="w-5 h-5 text-yellow-400" /><span className="text-2xl font-bold text-white">{bugScore}</span></div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-3"><Timer className={`w-5 h-5 ${bugTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-300"}`} /><span className={`text-2xl font-bold ${bugTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{bugTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>

              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button key={bug.id} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} onMouseDown={(e) => squashBug(bug.id, e)} onTouchStart={(e) => squashBug(bug.id, e)} className="absolute w-16 h-16 bg-red-500/20 border-2 border-red-500 text-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-75 transition-transform backdrop-blur-sm" style={{ top: bug.top, left: bug.left }}>
                    <Bug className="w-8 h-8" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}

          {view === "bug_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/10 border border-white/20 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 backdrop-blur-2xl z-20 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(34,197,94,0.3)]"><ShieldCheck className="w-10 h-10" /></div>
              <h2 className="text-3xl font-black text-white mt-6 mb-2">Debug Complete</h2>
              <p className="text-gray-400 text-sm mb-8">System optimization successful.</p>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8"><span className="text-xs uppercase font-bold text-gray-500 tracking-[0.2em] block mb-2">Bugs Squashed</span><div className="text-6xl font-black text-white">{bugScore}</div></div>
              <div className="flex gap-4"><button onClick={startBugGame} className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">Menu</button></div>
            </motion.div>
          )}

          {/* ================= MEMORY MATRIX GAME ================= */}
          {view === "mem_play" && (
            <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
              <div className="flex w-full items-center justify-between bg-white/10 border border-white/20 px-8 py-4 rounded-full backdrop-blur-xl shadow-2xl mb-10">
                <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-blue-400" /><div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Moves</span><span className="text-xl font-bold text-white leading-none">{memMoves}</span></div></div>
                <div className="flex items-center gap-3"><Timer className={`w-5 h-5 ${memTimeLeft <= 10 ? "text-red-500" : "text-gray-300"}`} /><div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Time</span><span className={`text-xl font-bold leading-none ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{memTimeLeft.toString().padStart(2, "0")}</span></div></div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full">
                {cards.map((card, index) => {
                  const Icon = MemoryIcons[card.iconIndex];
                  return (
                    <div key={card.id} onClick={() => handleCardClick(index)} className="relative aspect-square cursor-pointer group perspective-1000">
                      <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }} className="w-full h-full preserve-3d relative">
                        {/* Front (Hidden) */}
                        <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">
                          <Code2 className="w-8 h-8 text-white/20" />
                        </div>
                        {/* Back (Revealed) */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]" style={{ transform: "rotateY(180deg)" }}>
                          <Icon className={`w-10 h-10 ${card.isMatched ? "text-green-400" : "text-blue-400"}`} />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "mem_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/10 border border-white/20 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm mx-4 backdrop-blur-2xl z-20 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.3)]"><Cpu className="w-10 h-10" /></div>
              <h2 className="text-3xl font-black text-white mt-6 mb-2">{matchedCount === MemoryIcons.length ? "Matrix Solved!" : "Time's Up!"}</h2>
              <p className="text-gray-400 text-sm mb-8">{matchedCount === MemoryIcons.length ? "Impressive memory skills." : "System synchronization failed."}</p>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
                <div><span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Matches</span><div className="text-3xl font-black text-white">{matchedCount}/{MemoryIcons.length}</div></div>
                <div><span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Moves</span><div className="text-3xl font-black text-white">{memMoves}</div></div>
              </div>
              <div className="flex gap-4"><button onClick={startMemoryGame} className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">Menu</button></div>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}