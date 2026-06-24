"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // 📌 চ্যাট হিস্ট্রি রাখার জন্য স্টেট
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! I am Nazmus Shakib's AI assistant. Ask me anything about his technical stack, availability, or project details." }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 📌 যখনই নতুন মেসেজ আসবে, অটোমেটিক নিচে স্ক্রোল হবে
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  // 📌 মেসেজ সেন্ড করার ফাংশন
  const handleSend = () => {
    if (!message.trim()) return;

    // ইউজারের মেসেজ চ্যাটে অ্যাড করা
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage(""); // ইনপুট বক্স ক্লিয়ার করা

    // 📌 সাময়িক (Dummy) বট রিপ্লাই (পরে আমরা এখানে আসল AI API কানেক্ট করব)
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev, 
        { sender: "bot", text: "Thanks for your message! Currently, my real AI brain is being connected to the server. Please use the contact page for urgent queries." }
      ]);
    }, 1000);
  };

  // 📌 কীবোর্ডের Enter চাপলেও যেন মেসেজ সেন্ড হয়
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div initial={false} animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }} className="origin-bottom-right absolute bottom-16 right-0 w-[300px] sm:w-[350px] bg-white dark:bg-[#0a0a0a] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Bot className="w-4 h-4" /> Nexus AI
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Chat Area */}
        <div className="h-72 p-4 flex flex-col gap-4 overflow-y-auto bg-gray-50/50 dark:bg-[#050505]/50">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm max-w-[85%] ${
                chat.sender === "user" 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-sm"
              }`}>
                {chat.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} /> {/* অটো স্ক্রোল পয়েন্ট */}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-gray-200/80 dark:border-gray-800/80 flex items-center gap-2">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyDown={handleKeyPress}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-100 dark:bg-[#111] text-xs px-4 py-3 rounded-full outline-none focus:ring-1 focus:ring-blue-500/50 dark:text-white" 
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

      </motion.div>

      {/* Floating Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform hover:shadow-blue-500/20">
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
}