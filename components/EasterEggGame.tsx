"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bug, X, Trophy, Code2, Play, RotateCcw, 
  ShieldCheck, Terminal, Database, Server, 
  Cpu, Globe, Layout, Sparkles, Gamepad2, Timer,
  Zap, Unlock
} from "lucide-react";

// ==========================================
// 📌 TYPES & INTERFACES
// ==========================================
type ViewState = "boot" | "menu" | "bug_play" | "bug_over" | "mem_play" | "mem_over";

interface BugEntity {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface MemoryCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

// 📌 Memory Game Icons
const MemoryIcons = [Terminal, Database, Server, Cpu, Globe, Layout, Zap, ShieldCheck];

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("boot");
  const [bootText, setBootText] = useState("");

  // ================= GLITCH HUNTER STATE =================
  const [bugScore, setBugScore] = useState(0);
  const [bugTimeLeft, setBugTimeLeft] = useState(20);
  const [bugs, setBugs] = useState<BugEntity[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const bugIdCounter = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ================= NEURAL LINK STATE =================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(45);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // 📌 1. TRIGGER LISTENER
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setView("boot");
      startBootSequence();
    };
    window.addEventListener("trigger-easter-egg", handleTrigger);
    return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
  }, []);

  // 📌 BOOT SEQUENCE ANIMATION
  const startBootSequence = () => {
    const sequence = [
      "INITIALIZING NEURAL OVERRIDE...",
      "BYPASSING SECURITY PROTOCOLS...",
      "ACCESSING DEVELOPER MAINFRAME...",
      "ACCESS GRANTED."
    ];
    let currentLine = 0;
    setBootText(sequence[0]);

    const interval = setInterval(() => {
      currentLine++;
      if (currentLine < sequence.length) {
        setBootText(sequence[currentLine]);
      } else {
        clearInterval(interval);
        setTimeout(() => setView("menu"), 800);
      }
    }, 800);
  };

  // 📌 2. GLITCH HUNTER LOGIC
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let bugInterval: NodeJS.Timeout;

    if (view === "bug_play") {
      // Countdown
      timerInterval = setInterval(() => {
        setBugTimeLeft((prev) => {
          if (prev <= 1) {
            setView("bug_over");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawner (Bugs now move to random targets)
      bugInterval = setInterval(() => {
        if (gameAreaRef.current && bugs.length < 8) { // Max 8 bugs on screen
          const { clientWidth, clientHeight } = gameAreaRef.current;
          const startX = Math.floor(Math.random() * (clientWidth - 60));
          const startY = Math.floor(Math.random() * (clientHeight - 60));
          const targetX = Math.floor(Math.random() * (clientWidth - 60));
          const targetY = Math.floor(Math.random() * (clientHeight - 60));
          
          const newBug = { id: ++bugIdCounter.current, startX, startY, targetX, targetY };
          setBugs((prev) => [...prev, newBug]);
          
          // Auto remove bug if missed
          setTimeout(() => setBugs((prev) => prev.filter((b) => b.id !== newBug.id)), 2500);
        }
      }, 700); 
    }
    return () => { clearInterval(timerInterval); clearInterval(bugInterval); };
  }, [view, bugs.length]);

  // 📌 3. NEURAL LINK LOGIC
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

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [first, second] = flippedIndices;
      
      if (cards[first].iconIndex === cards[second].iconIndex) {
        // Match!
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isMatched: true } : card)));
          setMatchedCount((prev) => prev + 1);
          setFlippedIndices([]);
          setIsChecking(false);
          if (matchedCount + 1 === MemoryIcons.length) {
            setTimeout(() => setView("mem_over"), 500);
          }
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isFlipped: false } : card)));
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, matchedCount]);

  // 📌 4. HANDLERS
  const startBugGame = () => {
    setBugScore(0); setBugTimeLeft(20); setBugs([]); setParticles([]); setView("bug_play");
  };

  const squashBug = (id: number, e: React.MouseEvent | React.TouchEvent, currentX: number, currentY: number) => {
    e.stopPropagation();
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setBugScore((prev) => prev + 1);
    
    // Create explosion particle
    const pId = Date.now();
    setParticles((prev) => [...prev, { id: pId, x: currentX, y: currentY }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== pId)), 500);
  };

  const startMemoryGame = () => {
    const deck = [...Array(MemoryIcons.length * 2)].map((_, i) => ({
      id: i,
      iconIndex: i % MemoryIcons.length,
      isFlipped: false,
      isMatched: false,
    })).sort(() => Math.random() - 0.5);

    setCards(deck); setMemMoves(0); setMemTimeLeft(45); setMatchedCount(0); setFlippedIndices([]); setIsChecking(false); setView("mem_play");
  };

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;
    
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
    setFlippedIndices((prev) => [...prev, index]);
    if (flippedIndices.length === 0) setMemMoves((prev) => prev + 1);
  };

  const closeGame = () => { setIsOpen(false); setView("boot"); };

  // ================= UI COMPONENTS =================
  const BootScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-green-400 font-mono text-center px-6">
      <Unlock className="w-16 h-16 mb-8 animate-pulse text-green-500" />
      <p className="text-xl md:text-2xl tracking-widest">{bootText}</p>
      <div className="w-64 h-1 bg-green-900 mt-8 overflow-hidden rounded-full">
        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.2, ease: "linear" }} className="h-full bg-green-400 shadow-[0_0_10px_#4ade80]"></motion.div>
      </div>
    </div>
  );

  const MenuScreen = () => (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl relative z-10 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-3xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <Terminal className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-4">DEV_CONSOLE</h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium">You have bypassed the frontend UI. Select a module below to test system reflexes or neural retention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Glitch Hunter Card */}
        <motion.div whileHover={{ y: -5 }} onClick={startBugGame} className="group cursor-pointer relative bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-red-500/50 rounded-[2.5rem] p-8 md:p-10 overflow-hidden backdrop-blur-2xl transition-all shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Bug className="w-14 h-14 text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
          <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Glitch Hunter</h3>
          <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed">The DOM is infested with moving glitches. Eliminate as many as possible before the mainframe collapses in 20 seconds.</p>
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 font-bold px-6 py-3 rounded-full uppercase tracking-widest text-xs group-hover:bg-red-500 group-hover:text-white transition-all">
            <Play className="w-4 h-4" /> Initiate Sequence
          </div>
        </motion.div>

        {/* Neural Link Card */}
        <motion.div whileHover={{ y: -5 }} onClick={startMemoryGame} className="group cursor-pointer relative bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-blue-500/50 rounded-[2.5rem] p-8 md:p-10 overflow-hidden backdrop-blur-2xl transition-all shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Cpu className="w-14 h-14 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
          <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Neural Link</h3>
          <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed">A core memory retention test. Map out the hidden tech-stack architecture before the 45-second timer runs out.</p>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 font-bold px-6 py-3 rounded-full uppercase tracking-widest text-xs group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Play className="w-4 h-4" /> Initiate Sequence
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
          
          {/* 🌟 MILLION DOLLAR BACKDROP */}
          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

          {/* Close Button (Hidden during boot) */}
          {view !== "boot" && (
            <button onClick={closeGame} className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 bg-white/5 text-gray-300 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-white hover:scale-110 transition-all z-50 backdrop-blur-xl shadow-2xl">
              <X className="w-6 h-6" />
            </button>
          )}

          {/* VIEW ROUTER */}
          {view === "boot" && <BootScreen />}
          {view === "menu" && <MenuScreen />}

          {/* ================= GLITCH HUNTER GAME ================= */}
          {view === "bug_play" && (
            <div ref={gameAreaRef} className="absolute inset-0 z-10 w-full h-full">
              {/* HUD */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/50 border border-white/10 px-10 py-4 rounded-full backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4"><Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" /><span className="text-3xl font-black text-white">{bugScore}</span></div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex items-center gap-4"><Timer className={`w-6 h-6 ${bugTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]"}`} /><span className={`text-3xl font-black tabular-nums ${bugTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{bugTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>

              {/* Floating Bugs */}
              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button 
                    key={bug.id} 
                    initial={{ x: bug.startX, y: bug.startY, scale: 0, opacity: 0 }} 
                    animate={{ x: bug.targetX, y: bug.targetY, scale: 1, opacity: 1 }} 
                    exit={{ scale: 0, opacity: 0 }} 
                    transition={{ duration: 2.5, ease: "linear" }}
                    onMouseDown={(e) => squashBug(bug.id, e, bug.targetX, bug.targetY)} 
                    onTouchStart={(e) => squashBug(bug.id, e, bug.targetX, bug.targetY)} 
                    className="absolute w-16 h-16 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-500/30 transition-colors backdrop-blur-md cursor-crosshair" 
                  >
                    <Bug className="w-8 h-8 animate-pulse" />
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Particles on squash */}
              {particles.map(p => (
                <motion.div key={p.id} initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} className="absolute w-16 h-16 bg-red-500 rounded-full pointer-events-none mix-blend-screen blur-md" style={{ left: p.x, top: p.y }} />
              ))}
            </div>
          )}

          {view === "bug_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/40 border border-white/10 p-12 rounded-[3rem] shadow-2xl text-center max-w-md mx-4 backdrop-blur-3xl z-20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
              <div className="w-24 h-24 mx-auto bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.2)] mb-8"><ShieldCheck className="w-12 h-12" /></div>
              <h2 className="text-4xl font-black text-white mb-2">Threat Neutralized</h2>
              <p className="text-gray-400 text-base mb-8 font-medium">System integrity restored.</p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-[0.3em] block mb-2 relative z-10">Glitch Count</span>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 relative z-10">{bugScore}</div>
              </div>

              <div className="flex gap-4">
                <button onClick={startBugGame} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Restart</button>
                <button onClick={() => setView("menu")} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-2xl font-bold transition-all">Main Menu</button>
              </div>
            </motion.div>
          )}

          {/* ================= NEURAL LINK GAME ================= */}
          {view === "mem_play" && (
            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
              {/* HUD */}
              <div className="flex w-full items-center justify-between bg-black/50 border border-white/10 px-8 py-5 rounded-full backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-12">
                <div className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" /><div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Moves</span><span className="text-2xl font-black text-white leading-none">{memMoves}</span></div></div>
                <div className="flex items-center gap-4"><Timer className={`w-6 h-6 ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-300"}`} /><div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Time</span><span className={`text-2xl font-black tabular-nums leading-none ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}>00:{memTimeLeft.toString().padStart(2, "0")}</span></div></div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-4 gap-4 md:gap-6 w-full">
                {cards.map((card, index) => {
                  const Icon = MemoryIcons[card.iconIndex];
                  return (
                    <div key={card.id} onClick={() => handleCardClick(index)} className="relative aspect-square cursor-pointer group perspective-1000">
                      <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }} className="w-full h-full preserve-3d relative">
                        
                        {/* Front (Hidden state) */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg backdrop-blur-md">
                          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-black/20">
                            <Code2 className="w-5 h-5 text-white/20" />
                          </div>
                        </div>

                        {/* Back (Revealed state) */}
                        <div className="absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl overflow-hidden" 
                          style={{ 
                            transform: "rotateY(180deg)", 
                            background: card.isMatched ? "linear-gradient(135deg, rgba(34,197,94,0.1), transparent)" : "linear-gradient(135deg, rgba(59,130,246,0.1), transparent)",
                            borderColor: card.isMatched ? "rgba(34,197,94,0.5)" : "rgba(59,130,246,0.3)",
                            borderWidth: "1px"
                          }}>
                          {card.isMatched && <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>}
                          <Icon className={`w-12 h-12 relative z-10 ${card.isMatched ? "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" : "text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"}`} />
                        </div>

                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "mem_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/40 border border-white/10 p-12 rounded-[3rem] shadow-2xl text-center max-w-md mx-4 backdrop-blur-3xl z-20 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent ${matchedCount === MemoryIcons.length ? "via-blue-500" : "via-red-500"} to-transparent`}></div>
              
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${matchedCount === MemoryIcons.length ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.2)]" : "bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_50px_rgba(239,68,68,0.2)]"}`}>
                <Database className="w-12 h-12" />
              </div>

              <h2 className="text-4xl font-black text-white mb-2">{matchedCount === MemoryIcons.length ? "Matrix Solved" : "Time Expired"}</h2>
              <p className="text-gray-400 text-base mb-8 font-medium">{matchedCount === MemoryIcons.length ? "Perfect neural synchronization achieved." : "Failed to map the architecture."}</p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5"><span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Matches</span><div className="text-4xl font-black text-white">{matchedCount}/{MemoryIcons.length}</div></div>
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5"><span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Moves</span><div className="text-4xl font-black text-white">{memMoves}</div></div>
              </div>

              <div className="flex gap-4">
                <button onClick={startMemoryGame} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Restart</button>
                <button onClick={() => setView("menu")} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-2xl font-bold transition-all">Main Menu</button>
              </div>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}