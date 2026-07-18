"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

type Message = {
  sender: "bot" | "user";
  text: string;
};

// 📌 WhatsApp Custom SVG Icon
const WhatsAppIcon = ({ className = "w-6 h-6 sm:w-8 sm:h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// 📌 Messenger Custom SVG Icon
const MessengerIcon = ({ className = "w-6 h-6 sm:w-8 sm:h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.923 1.498 5.512 3.82 7.185V22l3.487-1.921c1.11.312 2.285.48 3.513.48 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.093 12.35l-2.766-2.955-5.393 2.955 5.942-6.31 2.82 2.956 5.34-2.956-5.943 6.31z"/>
  </svg>
);

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"menu" | "chat">("menu");
  
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        setChatHistory([{ sender: "bot", text: data.greeting }]);
      } catch (error) {
        setChatHistory([{ sender: "bot", text: "Assalamualaikum! 👋 I am **Syntaxi**, the AI Assistant. How can I help you explore this portfolio today?" }]);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchGreeting();
  }, []);

  useEffect(() => {
    if (chatEndRef.current && viewMode === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen, isLoading, viewMode]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatHistory((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { sender: "bot", text: "⚠️ The server is currently unreachable. Please try again." }]);
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "⚠️ Network connection failed! Please check your internet." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const renderText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity">
            {linkMatch[1]}
          </a>
        );
      }
      
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((bPart, bIndex) => {
            const bMatch = bPart.match(/\*\*([^*]+)\*\*/);
            if (bMatch) return <strong key={bIndex} className="font-extrabold text-black dark:text-white">{bMatch[1]}</strong>;
            
            return bPart.split('\n').map((line, lIndex, array) => (
              <span key={lIndex}>
                {line}
                {lIndex < array.length - 1 && <br />}
              </span>
            ));
          })}
        </span>
      );
    });
  };

  const toggleWindow = () => {
    if (!isOpen) {
      setViewMode("menu"); 
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 w-[320px] sm:w-[380px] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            
            {/* 📌 MENU VIEW - Standard Professional Glass */}
            {viewMode === "menu" && (
              <div className="flex flex-col w-full h-full">
                
                {/* Header */}
                <div className="p-5 flex items-start justify-between border-b border-gray-200/50 dark:border-white/10">
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-[#111] rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] sm:text-[16px] tracking-wide text-gray-900 dark:text-white">Syntaxi Assistant</span>
                      <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                        Online • Replies instantly
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                    <a 
                      href="https://wa.me/8801727604342" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="mb-2 text-green-600 dark:text-green-500">
                        <WhatsAppIcon />
                      </div>
                      <span className="text-[12px] sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100">WhatsApp</span>
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Direct Chat</span>
                    </a>
                    
                    <a 
                      href="https://m.me/anonspecter.x" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="mb-2 text-blue-600 dark:text-blue-500">
                        <MessengerIcon />
                      </div>
                      <span className="text-[12px] sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100">Messenger</span>
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Quick Reply</span>
                    </a>
                  </div>

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-gray-200/50 dark:border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-semibold">Or Ask AI</span>
                    <div className="flex-grow border-t border-gray-200/50 dark:border-white/10"></div>
                  </div>

                  <button 
                    onClick={() => setViewMode("chat")}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="bg-white dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-gray-200/50 dark:border-white/5 shadow-sm">
                        <Sparkles className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900 dark:text-white tracking-wide">Chat with Syntaxi AI</span>
                        <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Smart Assistant • 24/7</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {/* 📌 CHAT VIEW - Standard Professional Glass */}
            {viewMode === "chat" && (
              <div className="flex flex-col w-full h-full">
                
                {/* Chat Header */}
                <div className="bg-gray-50/50 dark:bg-[#111]/50 border-b border-gray-200/50 dark:border-white/10 p-4 flex items-center justify-between text-gray-900 dark:text-white shadow-sm">
                  <div className="flex items-center gap-2.5 font-semibold text-sm tracking-wide">
                    <button 
                      onClick={() => setViewMode("menu")}
                      className="hover:bg-black/5 dark:hover:bg-white/10 p-1.5 -ml-1.5 rounded-full transition-colors mr-1"
                      title="Back to Options"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="bg-white dark:bg-[#1a1a1a] p-1.5 rounded-md border border-gray-200/50 dark:border-white/5 shadow-sm">
                      <Sparkles className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                    </div>
                    Ask Syntaxi AI
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Chat Area */}
                <div className="h-[400px] p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                  {isInitializing ? (
                    <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400 gap-2 font-medium">
                       <span className="text-sm">Waking up Syntaxi...</span>
                    </div>
                  ) : (
                    chatHistory.map((chat, idx) => (
                      <div 
                        key={idx} 
                        className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {chat.sender === "bot" ? (
                          <div className="flex w-full justify-start max-w-[90%]">
                            <div className="flex flex-col items-center mr-2.5 shrink-0 mt-1">
                              <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm">
                                <Bot className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                              </div>
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="text-[10px] font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Syntaxi</span>
                              <div className="p-4 text-[13.5px] leading-relaxed shadow-sm bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm">
                                {renderText(chat.text)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-[13.5px] leading-relaxed max-w-[85%] shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-2xl rounded-tr-sm">
                            {chat.text}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex w-full justify-start items-start gap-2.5 max-w-[90%]">
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/10 shadow-sm mt-1">
                        <Bot className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Syntaxi</span>
                        <div className="px-4 py-3 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[42px] text-gray-500 dark:text-gray-400 text-xs font-medium tracking-widest">
                          Generating...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3.5 bg-gray-50/50 dark:bg-[#111]/50 border-t border-gray-200/50 dark:border-white/10 flex items-center gap-2">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleKeyPress}
                    disabled={isLoading || isInitializing}
                    placeholder="Ask me anything..." 
                    className="flex-1 bg-white dark:bg-[#1a1a1a] text-sm px-4 py-3.5 rounded-xl outline-none text-gray-900 dark:text-white disabled:opacity-50 border border-gray-200/50 dark:border-white/5 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 transition-shadow" 
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black p-3.5 rounded-xl disabled:opacity-50 shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={toggleWindow} 
        className="w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}