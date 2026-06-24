"use client";

import { useState, useRef } from "react";
import { sendMessage } from "./actions";
import { Mail, Send, User, MessageSquare, CheckCircle2, MapPin } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleAction = async (formData: FormData) => {
    setStatus("loading");
    try {
      await sendMessage(formData);
      setStatus("success");
      formRef.current?.reset(); // ফর্ম ক্লিয়ার করা
      
      // ৩ সেকেন্ড পর আবার নরমাল অবস্থায় ফিরে যাবে
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
      
      {/* 📌 Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Have a project in mind, looking for a developer, or just want to say hi? Drop me a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* 📌 Contact Information (Left Side) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Contact Info</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:hello@example.com" className="text-lg font-medium text-black dark:text-white hover:text-blue-500 transition-colors">
                    hello@yourdomain.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-lg font-medium text-black dark:text-white">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📌 Contact Form (Right Side) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-sm relative overflow-hidden">
          
          <h3 className="text-2xl font-bold text-black dark:text-white mb-8">Send a Message</h3>

          <form ref={formRef} action={handleAction} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Your Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="John Doe" 
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="john@example.com" 
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Your Message
              </label>
              <textarea 
                name="message" 
                required 
                rows={5} 
                placeholder="How can I help you?" 
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === "loading" || status === "success"}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all ${
                status === "success" 
                ? "bg-green-500 text-white" 
                : "bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
              }`}
            >
              {status === "loading" && <span className="animate-spin text-xl">⏳</span>}
              {status === "success" && <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>}
              {status === "idle" && <><Send className="w-4 h-4" /> Send Message</>}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}