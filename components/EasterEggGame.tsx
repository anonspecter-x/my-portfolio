"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, Trophy, Code2, Play, RotateCcw, ShieldCheck } from "lucide-react";

export default function EasterEggGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [bugs, setBugs] = useState<{ id: number; top: number; left: number }[]>([]);
  
  const bugIdCounter = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 📌 1. Listen for the Secret Trigger Event
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setGameState("idle");
      setScore(0);
    };
    
    window.addEventListener("trigger-easter-egg", handleTrigger);
    return () => window.removeEventListener("trigger-easter-egg", handleTrigger);
  }, []);

  // 📌 2. Game Loop (Timer & Bug Spawning)
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let bugInterval: NodeJS.Timeout;

    if (gameState === "playing") {
      // Timer Countdown
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameover");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Bug Spawner
      bugInterval = setInterval(() => {
        if (gameAreaRef.current) {
          const { clientWidth, clientHeight } = gameAreaRef.current;
          // Calculate random positions keeping bugs inside the screen
          const top = Math.floor(Math.random() * (clientHeight - 60)) + 10;
          const left = Math.floor(Math.random() * (clientWidth - 60)) + 10;
          
          const newBug = { id: ++bugIdCounter.current, top, left };
          
          setBugs((prev) => [...prev, newBug]);

          // Auto remove bug if not clicked within 1.5s
          setTimeout(() => {
            setBugs((prev) => prev.filter((b) => b.id !== newBug.id));
          }, 1500);
        }
      }, 600); // New bug every 600ms
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(bugInterval);
    };
  }, [gameState]);

  // 📌 3. Handlers
  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setBugs([]);
    setGameState("playing");
  };

  const squashBug = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setScore((prev) => prev + 1);
  };

  const closeGame = () => {
    setIsOpen(false);
    setGameState("idle");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button 
            onClick={closeGame}
            className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-[#111] text-black dark:text-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-110 transition-transform z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ================= START SCREEN ================= */}
          {gameState === "idle" && (
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md mx-4"
            >
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Code2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-black dark:text-white mb-4 tracking-tight">System Override!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                You found the secret dev mode. The system is infected with bugs! You have 15 seconds to squash as many as you can.
              </p>
              <button 
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 shadow-lg shadow-blue-500/30"
              >
                <Play className="w-5 h-5 fill-current" /> Start Debugging
              </button>
            </motion.div>
          )}

          {/* ================= PLAYING SCREEN ================= */}
          {gameState === "playing" && (
            <div ref={gameAreaRef} className="absolute inset-0 overflow-hidden">
              {/* HUD */}
              <div className="absolute top-6 left-6 flex items-center gap-4 bg-white/90 dark:bg-[#111]/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-md z-40">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Score</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{score}</span>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time</span>
                  <span className={`text-2xl font-black leading-none ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-black dark:text-white"}`}>
                    00:{timeLeft.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Bugs */}
              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button
                    key={bug.id}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={(e) => squashBug(bug.id, e)}
                    onTouchStart={(e) => squashBug(bug.id, e)}
                    className="absolute w-14 h-14 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-transform"
                    style={{ top: bug.top, left: bug.left }}
                  >
                    <Bug className="w-7 h-7" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ================= GAME OVER SCREEN ================= */}
          {gameState === "gameover" && (
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md mx-4 z-50"
            >
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-black dark:text-white mb-2 tracking-tight">Debug Complete!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Here is your performance report:</p>
              
              <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
                <span className="text-xs uppercase font-bold text-gray-400 tracking-[0.2em] block mb-2">Total Bugs Squashed</span>
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span className="text-5xl font-black text-black dark:text-white">{score}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={startGame}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md shadow-blue-500/20"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button 
                  onClick={closeGame}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#222] text-black dark:text-white border border-gray-200 dark:border-gray-800 py-3.5 rounded-xl font-bold transition-transform active:scale-95"
                >
                  Exit Dev Mode
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}