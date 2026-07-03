"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bug, X, Trophy, Code2, Play, RotateCcw, 
  ShieldCheck, Terminal, Database, Server, 
  Cpu, Globe, Layout, Sparkles, Gamepad2, Timer,
  Zap, Unlock, Keyboard, Network
} from "lucide-react";

type ViewState = "boot" | "menu" | "bug_play" | "bug_over" | "mem_play" | "mem_over" | "type_play" | "type_over" | "seq_play" | "seq_over";

interface BugEntity { id: number; startX: number; startY: number; targetX: number; targetY: number; }
interface MemoryCard { id: number; iconIndex: number; isFlipped: boolean; isMatched: boolean; }

const MemoryIcons = [Terminal, Database, Server, Cpu, Globe, Layout, Zap, ShieldCheck];
const CodeWords = ["const", "let", "function", "console.log", "useEffect", "useState", "return", "async", "await", "Promise", "interface", "export", "import", "fetch", "Array.map"];
const SeqColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>("boot");
  const [bootText, setBootText] = useState("");

  // ================= 1. GLITCH HUNTER STATE =================
  const [bugScore, setBugScore] = useState(0);
  const [bugTimeLeft, setBugTimeLeft] = useState(20);
  const [bugs, setBugs] = useState<BugEntity[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const bugIdCounter = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // ================= 2. NEURAL LINK (MEMORY) STATE =================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [memTimeLeft, setMemTimeLeft] = useState(45);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // ================= 3. TERMINAL TYPER STATE =================
  const [typeScore, setTypeScore] = useState(0);
  const [typeTimeLeft, setTypeTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const typeInputRef = useRef<HTMLInputElement>(null);

  // ================= 4. SEQUENCE BREAKER STATE =================
  const [seqScore, setSeqScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [isShowingSeq, setIsShowingSeq] = useState(false);

  // 📌 EVENT LISTENER
  useEffect(() => {
    const handleTrigger = () => { setIsOpen(true); setView("boot"); startBootSequence(); };
    window.addEventListener("trigger-easter-egg", handleTrigger);
    return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
  }, []);

  // 📌 BOOT SEQUENCE
  const startBootSequence = () => {
    const sequence = ["INITIALIZING NEURAL OVERRIDE...", "BYPASSING SECURITY PROTOCOLS...", "ACCESSING DEVELOPER MAINFRAME...", "ACCESS GRANTED."];
    let currentLine = 0;
    setBootText(sequence[0]);
    const interval = setInterval(() => {
      currentLine++;
      if (currentLine < sequence.length) setBootText(sequence[currentLine]);
      else { clearInterval(interval); setTimeout(() => setView("menu"), 800); }
    }, 800);
  };

  // 📌 GLITCH HUNTER LOGIC
  useEffect(() => {
    let timerInterval: NodeJS.Timeout, bugInterval: NodeJS.Timeout;
    if (view === "bug_play") {
      timerInterval = setInterval(() => {
        setBugTimeLeft((prev) => {
          if (prev <= 1) { setView("bug_over"); return 0; } return prev - 1;
        });
      }, 1000);
      bugInterval = setInterval(() => {
        if (gameAreaRef.current && bugs.length < 8) {
          const { clientWidth, clientHeight } = gameAreaRef.current;
          const startX = Math.floor(Math.random() * (clientWidth - 60));
          const startY = Math.floor(Math.random() * (clientHeight - 60));
          const targetX = Math.floor(Math.random() * (clientWidth - 60));
          const targetY = Math.floor(Math.random() * (clientHeight - 60));
          const newBug = { id: ++bugIdCounter.current, startX, startY, targetX, targetY };
          setBugs((prev) => [...prev, newBug]);
          setTimeout(() => setBugs((prev) => prev.filter((b) => b.id !== newBug.id)), 2500);
        }
      }, 700); 
    }
    return () => { clearInterval(timerInterval); clearInterval(bugInterval); };
  }, [view, bugs.length]);

  const squashBug = (id: number, e: React.MouseEvent | React.TouchEvent, currentX: number, currentY: number) => {
    e.stopPropagation();
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setBugScore((prev) => prev + 1);
    const pId = Date.now();
    setParticles((prev) => [...prev, { id: pId, x: currentX, y: currentY }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== pId)), 500);
  };

  // 📌 NEURAL LINK (MEMORY) LOGIC - FIXED CSS 3D
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (view === "mem_play") {
      timerInterval = setInterval(() => {
        setMemTimeLeft((prev) => {
          if (prev <= 1) { setView("mem_over"); return 0; } return prev - 1;
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
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isMatched: true } : card)));
          setMatchedCount((prev) => prev + 1);
          setFlippedIndices([]); setIsChecking(false);
          if (matchedCount + 1 === MemoryIcons.length) setTimeout(() => setView("mem_over"), 500);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isFlipped: false } : card)));
          setFlippedIndices([]); setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, matchedCount]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
    setFlippedIndices((prev) => [...prev, index]);
    if (flippedIndices.length === 0) setMemMoves((prev) => prev + 1);
  };

  // 📌 TERMINAL TYPER LOGIC
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (view === "type_play") {
      typeInputRef.current?.focus();
      timerInterval = setInterval(() => {
        setTypeTimeLeft((prev) => {
          if (prev <= 1) { setView("type_over"); return 0; } return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [view]);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.trim() === currentWord) {
      setTypeScore((prev) => prev + 1);
      setInputValue("");
      setCurrentWord(CodeWords[Math.floor(Math.random() * CodeWords.length)]);
    }
  };

  // 📌 SEQUENCE BREAKER LOGIC
  const playSequence = async (seq: number[]) => {
    setIsShowingSeq(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, 600));
      setActiveColor(null);
    }
    setIsShowingSeq(false);
  };

  useEffect(() => {
    if (view === "seq_play" && sequence.length > 0 && playerStep === 0) {
      playSequence(sequence);
    }
  }, [sequence, view]);

  const handleSeqClick = (colorIdx: number) => {
    if (isShowingSeq) return;
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 200);

    if (sequence[playerStep] === colorIdx) {
      if (playerStep + 1 === sequence.length) {
        setSeqScore(sequence.length);
        setPlayerStep(0);
        setTimeout(() => setSequence(prev => [...prev, Math.floor(Math.random() * 4)]), 1000);
      } else {
        setPlayerStep(prev => prev + 1);
      }
    } else {
      setTimeout(() => setView("seq_over"), 500);
    }
  };

  // 📌 GAME STARTERS
  const startBugGame = () => { setBugScore(0); setBugTimeLeft(20); setBugs([]); setParticles([]); setView("bug_play"); };
  const startMemoryGame = () => {
    const deck = [...Array(MemoryIcons.length * 2)].map((_, i) => ({ id: i, iconIndex: i % MemoryIcons.length, isFlipped: false, isMatched: false })).sort(() => Math.random() - 0.5);
    setCards(deck); setMemMoves(0); setMemTimeLeft(45); setMatchedCount(0); setFlippedIndices([]); setIsChecking(false); setView("mem_play");
  };
  const startTypeGame = () => { setTypeScore(0); setTypeTimeLeft(30); setInputValue(""); setCurrentWord(CodeWords[Math.floor(Math.random() * CodeWords.length)]); setView("type_play"); };
  const startSeqGame = () => { setSeqScore(0); setPlayerStep(0); setSequence([Math.floor(Math.random() * 4)]); setView("seq_play"); };

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
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl relative z-10 px-4 max-h-screen overflow-y-auto py-10 custom-scrollbar">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-3xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <Terminal className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-4">ARCADE CONSOLE</h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium">Bypass successful. Select a module to test your system proficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10">
        {/* Game 1: Glitch Hunter */}
        <motion.div whileHover={{ y: -5 }} onClick={startBugGame} className="group cursor-pointer bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-red-500/50 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-xl transition-all shadow-xl">
          <Bug className="w-12 h-12 text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
          <h3 className="text-2xl font-bold text-white mb-2">Glitch Hunter</h3>
          <p className="text-gray-400 text-sm mb-8 line-clamp-2">Squash the moving DOM glitches before time runs out.</p>
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 font-bold px-5 py-2.5 rounded-full uppercase tracking-widest text-[10px] group-hover:bg-red-500 group-hover:text-white transition-all"><Play className="w-3 h-3" /> Execute</div>
        </motion.div>

        {/* Game 2: Neural Link (Fixed) */}
        <motion.div whileHover={{ y: -5 }} onClick={startMemoryGame} className="group cursor-pointer bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-blue-500/50 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-xl transition-all shadow-xl">
          <Cpu className="w-12 h-12 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
          <h3 className="text-2xl font-bold text-white mb-2">Neural Link</h3>
          <p className="text-gray-400 text-sm mb-8 line-clamp-2">Match the architecture icons. Test your core memory retention.</p>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 font-bold px-5 py-2.5 rounded-full uppercase tracking-widest text-[10px] group-hover:bg-blue-500 group-hover:text-white transition-all"><Play className="w-3 h-3" /> Execute</div>
        </motion.div>

        {/* Game 3: Terminal Typer */}
        <motion.div whileHover={{ y: -5 }} onClick={startTypeGame} className="group cursor-pointer bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-green-500/50 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-xl transition-all shadow-xl">
          <Keyboard className="w-12 h-12 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
          <h3 className="text-2xl font-bold text-white mb-2">Terminal Typer</h3>
          <p className="text-gray-400 text-sm mb-8 line-clamp-2">Type the code syntax as fast as you can. WPM check.</p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 font-bold px-5 py-2.5 rounded-full uppercase tracking-widest text-[10px] group-hover:bg-green-500 group-hover:text-white transition-all"><Play className="w-3 h-3" /> Execute</div>
        </motion.div>

        {/* Game 4: Sequence Breaker */}
        <motion.div whileHover={{ y: -5 }} onClick={startSeqGame} className="group cursor-pointer bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-purple-500/50 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-xl transition-all shadow-xl">
          <Network className="w-12 h-12 text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
          <h3 className="text-2xl font-bold text-white mb-2">Sequence Breaker</h3>
          <p className="text-gray-400 text-sm mb-8 line-clamp-2">Repeat the server ping sequence. One mistake and you're out.</p>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 font-bold px-5 py-2.5 rounded-full uppercase tracking-widest text-[10px] group-hover:bg-purple-500 group-hover:text-white transition-all"><Play className="w-3 h-3" /> Execute</div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
          
          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

          {view !== "boot" && (
            <button onClick={closeGame} className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/5 text-gray-300 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-white hover:scale-110 transition-all z-50 backdrop-blur-xl">
              <X className="w-5 h-5" />
            </button>
          )}

          {view === "boot" && <BootScreen />}
          {view === "menu" && <MenuScreen />}

          {/* ================= 1. GLITCH HUNTER GAME ================= */}
          {view === "bug_play" && (
            <div ref={gameAreaRef} className="absolute inset-0 z-10 w-full h-full">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/50 border border-white/10 px-8 py-3 rounded-full backdrop-blur-2xl">
                <div className="flex items-center gap-3"><Trophy className="w-5 h-5 text-yellow-400" /><span className="text-2xl font-black text-white">{bugScore}</span></div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-3"><Timer className={`w-5 h-5 ${bugTimeLeft <= 5 ? "text-red-500 animate-pulse" : "text-blue-400"}`} /><span className={`text-2xl font-black ${bugTimeLeft <= 5 ? "text-red-500" : "text-white"}`}>00:{bugTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>
              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button key={bug.id} initial={{ x: bug.startX, y: bug.startY, scale: 0 }} animate={{ x: bug.targetX, y: bug.targetY, scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 2.5, ease: "linear" }} onMouseDown={(e) => squashBug(bug.id, e, bug.targetX, bug.targetY)} onTouchStart={(e) => squashBug(bug.id, e, bug.targetX, bug.targetY)} className="absolute w-14 h-14 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl flex items-center justify-center backdrop-blur-md" >
                    <Bug className="w-7 h-7 animate-pulse" />
                  </motion.button>
                ))}
              </AnimatePresence>
              {particles.map(p => (<motion.div key={p.id} initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} className="absolute w-16 h-16 bg-red-500 rounded-full pointer-events-none mix-blend-screen blur-md" style={{ left: p.x, top: p.y }} />))}
            </div>
          )}
          {view === "bug_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/60 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center backdrop-blur-2xl z-20">
              <h2 className="text-3xl font-black text-white mb-2">Threat Neutralized</h2>
              <p className="text-gray-400 mb-6">Score: {bugScore}</p>
              <div className="flex gap-4"><button onClick={startBugGame} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-3 rounded-xl">Menu</button></div>
            </motion.div>
          )}

          {/* ================= 2. NEURAL LINK (MEMORY) GAME - FIXED ================= */}
          {view === "mem_play" && (
            <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center">
              <div className="flex w-full items-center justify-between bg-black/50 border border-white/10 px-8 py-4 rounded-full backdrop-blur-2xl mb-10">
                <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-blue-400" /><span className="text-xl font-bold text-white">Moves: {memMoves}</span></div>
                <div className="flex items-center gap-3"><Timer className={`w-5 h-5 ${memTimeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`} /><span className="text-xl font-bold text-white">00:{memTimeLeft.toString().padStart(2, "0")}</span></div>
              </div>
              <div className="grid grid-cols-4 gap-4 w-full">
                {cards.map((card, index) => {
                  const Icon = MemoryIcons[card.iconIndex];
                  return (
                    <div key={card.id} onClick={() => handleCardClick(index)} className="relative aspect-square cursor-pointer group" style={{ perspective: "1000px" }}>
                      <motion.div animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }} transition={{ duration: 0.4 }} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                        {/* FRONT (HIDDEN ICON) */}
                        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg" style={{ backfaceVisibility: "hidden" }}>
                          <Code2 className="w-6 h-6 text-white/20" />
                        </div>
                        {/* BACK (REVEALED ICON) */}
                        <div className="absolute inset-0 bg-blue-900/40 border border-blue-500/50 rounded-2xl flex items-center justify-center shadow-xl" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/60 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center backdrop-blur-2xl z-20">
              <h2 className="text-3xl font-black text-white mb-2">{matchedCount === MemoryIcons.length ? "Matrix Solved" : "Time Expired"}</h2>
              <p className="text-gray-400 mb-6">Matches: {matchedCount} | Moves: {memMoves}</p>
              <div className="flex gap-4"><button onClick={startMemoryGame} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-3 rounded-xl">Menu</button></div>
            </motion.div>
          )}

          {/* ================= 3. TERMINAL TYPER GAME ================= */}
          {view === "type_play" && (
            <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
              <div className="w-full flex justify-between text-white font-mono mb-8 opacity-70"><span>Score: {typeScore}</span><span>Time: 00:{typeTimeLeft.toString().padStart(2, "0")}</span></div>
              <div className="text-4xl md:text-6xl font-mono text-green-400 font-bold mb-10 tracking-widest">{currentWord}</div>
              <input ref={typeInputRef} type="text" value={inputValue} onChange={handleType} placeholder="Type here..." className="w-full bg-black/50 border-2 border-green-500/50 text-white font-mono text-xl p-6 rounded-2xl outline-none focus:border-green-400 text-center shadow-[0_0_20px_rgba(74,222,128,0.2)]" autoFocus />
            </div>
          )}
          {view === "type_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/60 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center backdrop-blur-2xl z-20">
              <h2 className="text-3xl font-black text-white mb-2">Typing Test Complete</h2>
              <p className="text-gray-400 mb-6">Score: {typeScore} Words</p>
              <div className="flex gap-4"><button onClick={startTypeGame} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-3 rounded-xl">Menu</button></div>
            </motion.div>
          )}

          {/* ================= 4. SEQUENCE BREAKER GAME ================= */}
          {view === "seq_play" && (
            <div className="relative z-10 flex flex-col items-center">
               <div className="text-white font-mono mb-10 text-xl tracking-widest opacity-80">Sequence: {seqScore}</div>
               <div className="grid grid-cols-2 gap-6 p-6 bg-white/5 rounded-full backdrop-blur-md">
                 {SeqColors.map((color, idx) => (
                   <button key={idx} disabled={isShowingSeq} onClick={() => handleSeqClick(idx)} className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${color} transition-all duration-200 ${activeColor === idx ? "brightness-150 scale-110 shadow-[0_0_40px_currentColor]" : "opacity-50 hover:opacity-80"}`} style={{ boxShadow: activeColor === idx ? "0 0 30px inherit" : "none" }} />
                 ))}
               </div>
               {isShowingSeq && <p className="text-white mt-10 animate-pulse font-mono tracking-widest">OBSERVE PATTERN...</p>}
            </div>
          )}
          {view === "seq_over" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-black/60 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center backdrop-blur-2xl z-20">
              <h2 className="text-3xl font-black text-white mb-2">Sequence Broken</h2>
              <p className="text-gray-400 mb-6">Score: {seqScore}</p>
              <div className="flex gap-4"><button onClick={startSeqGame} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Retry</button><button onClick={() => setView("menu")} className="flex-1 bg-white/10 text-white border border-white/20 py-3 rounded-xl">Menu</button></div>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}