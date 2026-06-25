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
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: "bot", text: "Hello! I am the AI Assistant for this portfolio. I know everything about the developer's skills, projects, and experience. How can I help you today?" }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // অটো-স্ক্রোল
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
        setChatHistory((prev) => [...prev, { sender: "bot", text: "⚠️ Server is taking a nap. Please try again later." }]);
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "⚠️ Network error! Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
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
            className="origin-bottom-right absolute bottom-16 right-0 w-[320px] sm:w-[380px] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white p-4 flex items-center justify-between text-white dark:text-black">
              <div className="flex items-center gap-2.5 font-bold text-sm tracking-wide">
                <div className="bg-white/10 dark:bg-black/10 p-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white dark:text-black" />
                </div>
                AI Assistant
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 dark:hover:bg-black/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-[360px] p-5 flex flex-col gap-4 overflow-y-auto bg-gray-50/50 dark:bg-[#050505]/50 custom-scrollbar">
              {chatHistory.map((chat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {chat.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed max-w-[80%] shadow-sm ${
                    chat.sender === "user" 
                      ? "bg-black dark:bg-white text-white dark:text-black rounded-br-sm" 
                      : "bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-sm"
                  }`}>
                    {chat.text}
                  </div>
                </motion.div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="p-3.5 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-gray-500 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="text-xs font-medium tracking-wide">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3.5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 flex items-center gap-2">
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                placeholder="Ask me anything..." 
                className="flex-1 bg-gray-100/80 dark:bg-[#111]/80 text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 dark:text-white transition-all disabled:opacity-50" 
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="bg-black dark:bg-white text-white dark:text-black p-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
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
        className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl shadow-black/20 dark:shadow-white/10 flex items-center justify-center border border-gray-800 dark:border-gray-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}