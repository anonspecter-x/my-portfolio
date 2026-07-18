"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, X, Send, Bot, Sparkles, ChevronLeft, ChevronRight, 
  MoreHorizontal, AlertCircle 
} from "lucide-react";

// ==========================================
// 📌 TYPES & INTERFACES
// ==========================================
interface Message {
  id: string;
  sender: "bot" | "user" | "system";
  text: string;
  timestamp: Date;
}

// ==========================================
// 📌 CUSTOM ICONS (Optimized)
// ==========================================
const WhatsAppIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const MessengerIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.923 1.498 5.512 3.82 7.185V22l3.487-1.921c1.11.312 2.285.48 3.513.48 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.093 12.35l-2.766-2.955-5.393 2.955 5.942-6.31 2.82 2.956 5.34-2.956-5.943 6.31z"/>
  </svg>
);

// ==========================================
// 📌 MAIN COMPONENT
// ==========================================
export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"menu" | "chat">("menu");
  
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🚀 Initialize Chat
  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("Failed to fetch greeting");
        const data = await res.json();
        addMessage("bot", data.greeting);
      } catch (error) {
        addMessage("bot", "Assalamualaikum! 👋 I am **Syntaxi**, the AI Assistant. How can I help you explore this portfolio today?");
      } finally {
        setIsInitializing(false);
      }
    };
    if (isOpen && chatHistory.length === 0) {
      fetchGreeting();
    }
  }, [isOpen]);

  // 🚀 Auto-scroll
  useEffect(() => {
    if (chatEndRef.current && viewMode === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, viewMode, isLoading]);

  // 🚀 Helper to add messages
  const addMessage = (sender: "bot" | "user" | "system", text: string) => {
    setChatHistory((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender, text, timestamp: new Date() },
    ]);
  };

  // 🚀 Handle Sending Message
  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    addMessage("user", userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Server unreachable");
      const data = await response.json();
      addMessage("bot", data.reply);
      
    } catch (error) {
      addMessage("system", "⚠️ Network connection failed. Please check your internet.");
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // 🚀 Markdown Parser for Professional Display
  const renderText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    
    return parts.map((part, index) => {
      // Render Links
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-600 dark:decoration-blue-400/30 dark:hover:decoration-blue-400 transition-all">
            {linkMatch[1]}
          </a>
        );
      }
      
      // Render Bold & Line breaks
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((bPart, bIndex) => {
            const bMatch = bPart.match(/\*\*([^*]+)\*\*/);
            if (bMatch) return <strong key={bIndex} className="font-bold text-gray-900 dark:text-gray-100">{bMatch[1]}</strong>;
            
            return bPart.split('\n').map((line, lIndex, array) => (
              <span key={`${index}-${bIndex}-${lIndex}`}>
                {line}
                {lIndex < array.length - 1 && <br />}
              </span>
            ));
          })}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.97 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[4.5rem] right-0 w-[92vw] sm:w-[400px] md:w-[440px] bg-white/60 dark:bg-[#050505]/60 backdrop-blur-[40px] saturate-150 border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            
            {/* ==========================================
                📌 MENU VIEW - Enterprise Glass
            ========================================== */}
            {viewMode === "menu" && (
              <div className="flex flex-col w-full">
                
                {/* Header Profile */}
                <div className="p-6 flex items-center justify-between border-b border-gray-200/40 dark:border-white/5 bg-white/40 dark:bg-white/5">
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/10 flex items-center justify-center shadow-sm">
                        <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800 dark:text-gray-200" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-white dark:border-[#111] rounded-full"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-base sm:text-lg tracking-tight text-gray-900 dark:text-white">Syntaxi Assistant</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Available & Ready
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Actions */}
                <div className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="https://wa.me/8801727604342" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/40 dark:border-white/5 shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="mb-3 text-green-600 dark:text-green-500 group-hover:-translate-y-1 transition-transform duration-300">
                        <WhatsAppIcon />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">WhatsApp</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Direct connect</span>
                    </a>
                    
                    <a 
                      href="https://m.me/anonspecter.x" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/40 dark:border-white/5 shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="mb-3 text-blue-600 dark:text-blue-500 group-hover:-translate-y-1 transition-transform duration-300">
                        <MessengerIcon />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Messenger</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Quick response</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-4 py-2 opacity-60">
                    <div className="h-px bg-gray-300 dark:bg-white/10 flex-1"></div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 dark:text-gray-400">Ask AI</span>
                    <div className="h-px bg-gray-300 dark:bg-white/10 flex-1"></div>
                  </div>

                  <button 
                    onClick={() => setViewMode("chat")}
                    className="group flex items-center justify-between p-5 rounded-2xl bg-white/60 dark:bg-white/10 border border-gray-200/50 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 dark:bg-black/30 p-3 rounded-xl shadow-inner">
                        <Sparkles className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Chat with Syntaxi</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Context-aware assistant</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {/* ==========================================
                📌 CHAT VIEW - Ultra Premium UI
            ========================================== */}
            {viewMode === "chat" && (
              <div className="flex flex-col w-full h-[550px] max-h-[75vh]">
                
                {/* Chat Header */}
                <div className="bg-white/40 dark:bg-white/5 border-b border-gray-200/40 dark:border-white/5 p-4 sm:p-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setViewMode("menu")}
                      className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white dark:bg-[#111] p-1.5 rounded-lg shadow-sm border border-gray-200/50 dark:border-white/10">
                        <Bot className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">Syntaxi AI</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Portfolio Assistant</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  {isInitializing ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-500 dark:text-gray-400 gap-3">
                      <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Connecting to AI...</span>
                    </div>
                  ) : (
                    chatHistory.map((chat) => (
                      <div key={chat.id} className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                        
                        {/* Bot Message Block */}
                        {chat.sender === "bot" && (
                          <div className="flex items-start gap-3 max-w-[88%]">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm shrink-0 mt-1">
                              <Bot className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ml-1">Syntaxi AI</span>
                              <div className="p-4 sm:p-5 text-[14px] leading-relaxed shadow-sm bg-white/70 dark:bg-[#111]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm">
                                {renderText(chat.text)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* User Message Block */}
                        {chat.sender === "user" && (
                          <div className="p-4 sm:p-5 text-[14px] leading-relaxed shadow-md bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-2xl rounded-tr-sm max-w-[85%] font-medium">
                            {chat.text}
                          </div>
                        )}

                        {/* System/Error Message Block */}
                        {chat.sender === "system" && (
                          <div className="w-full flex justify-center py-2">
                            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-xs font-semibold border border-red-200 dark:border-red-500/20">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {chat.text}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex items-start gap-3 max-w-[88%]">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ml-1">Syntaxi AI</span>
                        <div className="px-5 py-4 bg-white/70 dark:bg-[#111]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/5 rounded-2xl rounded-tl-sm shadow-sm flex items-center h-[52px]">
                          <MoreHorizontal className="w-6 h-6 text-gray-400 dark:text-gray-500 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} className="h-2" />
                </div>

                {/* Chat Input */}
                <div className="p-4 sm:p-5 bg-white/50 dark:bg-white/5 border-t border-gray-200/40 dark:border-white/5 shrink-0">
                  <div className="relative flex items-center bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-inner border border-gray-200/60 dark:border-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-white/20 transition-all">
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      onKeyDown={handleKeyPress}
                      disabled={isLoading || isInitializing}
                      placeholder="Type your message..." 
                      className="flex-1 bg-transparent text-sm sm:text-base px-5 py-4 outline-none text-gray-900 dark:text-white disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!message.trim() || isLoading}
                      className="mr-2 bg-gray-900 dark:bg-white text-white dark:text-black p-2.5 rounded-xl disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={toggleWindow} 
        className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.15)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50 relative border border-gray-800 dark:border-gray-200"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}