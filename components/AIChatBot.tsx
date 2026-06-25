"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from "lucide-react";

type Message = {
  sender: "bot" | "user";
  text: string;
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 📌 ওয়েলকাম মেসেজ ফেচ করা
  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        // ডাবল নেম ফিক্স: শুধু API থেকে আসা গ্রিটিং ব্যবহার করা হচ্ছে
        setChatHistory([{ sender: "bot", text: data.greeting }]);
      } catch (error) {
        setChatHistory([{ sender: "bot", text: "Assalamualaikum! 👋 I am **Syntaxi**, the AI Assistant. How can I help you explore this portfolio today?" }]);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchGreeting();
  }, []);

  // 📌 অটো-স্ক্রোল
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen, isLoading]);

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
      // 📌 রিপ্লাই আসার পর ইনপুট বক্সে অটো ফোকাস করা
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // 📌 Markdown লিংক [Text](url) এবং **Bold** টেক্সট রেন্ডার করার অ্যাডভান্সড ফাংশন
  const renderText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 font-bold underline underline-offset-4 decoration-gray-400 hover:decoration-gray-900 dark:hover:decoration-white transition-colors">
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="origin-bottom-right absolute bottom-16 right-0 w-[320px] sm:w-[380px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl border border-gray-200/50 dark:border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black dark:from-[#111] dark:to-black p-4 flex items-center justify-between text-white shadow-md z-10 border-b border-white/5 dark:border-gray-800/50">
              <div className="flex items-center gap-2.5 font-bold text-sm tracking-wide">
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                  <Sparkles className="w-4 h-4 text-gray-200" />
                </div>
                Ask Syntaxi AI
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-[400px] p-5 flex flex-col gap-5 overflow-y-auto bg-gray-50/80 dark:bg-[#050505]/80 custom-scrollbar">
              {isInitializing ? (
                <div className="flex justify-center items-center h-full text-gray-500 gap-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-sm tracking-wide">Waking up Syntaxi...</span>
                </div>
              ) : (
                chatHistory.map((chat, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {chat.sender === "bot" ? (
                      // 📌 BOT MESSAGE LAYOUT (With Name above bubble)
                      <div className="flex w-full justify-start max-w-[90%]">
                        {/* Bot Icon */}
                        <div className="flex flex-col items-center mr-2.5 shrink-0 mt-1">
                          <div className="w-7 h-7 rounded-full bg-white dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm">
                            <Bot className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                          </div>
                        </div>
                        {/* Name & Bubble */}
                        <div className="flex flex-col flex-1">
                          <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Syntaxi</span>
                          <div className="p-4 text-[13.5px] leading-relaxed shadow-sm bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800/80 text-gray-700 dark:text-gray-300 rounded-2xl rounded-tl-sm">
                            {renderText(chat.text)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 📌 USER MESSAGE LAYOUT
                      <div className="p-4 text-[13.5px] leading-relaxed max-w-[85%] shadow-sm bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white rounded-2xl rounded-tr-sm">
                        {chat.text}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start items-start gap-2.5 max-w-[90%]">
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-800 shadow-sm mt-1">
                    <Bot className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Syntaxi</span>
                    <div className="p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800/80 text-gray-500 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 h-[42px]">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3.5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800/80 flex items-center gap-2">
              <input 
                ref={inputRef}
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyPress}
                disabled={isLoading || isInitializing}
                placeholder="Ask me anything..." 
                className="flex-1 bg-gray-100 dark:bg-[#111] text-sm px-4 py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 dark:text-white transition-all disabled:opacity-50 border border-transparent focus:bg-white dark:focus:bg-[#0a0a0a]" 
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-br from-gray-800 to-black dark:bg-white dark:text-black text-white p-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-black/20 dark:shadow-white/10"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white rounded-full shadow-2xl shadow-black/30 flex items-center justify-center border border-gray-700 dark:border-gray-600"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}