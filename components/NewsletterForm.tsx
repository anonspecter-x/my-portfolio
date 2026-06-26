"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail(""); // ফর্ম ক্লিয়ার করা
      } else {
        setStatus("error");
        setMessage(data.error || data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network connection failed! Please try again.");
    }

    // ৫ সেকেন্ড পর পপআপ অটো হাইড হয়ে যাবে
    setTimeout(() => {
      setStatus("idle");
    }, 5000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-black dark:bg-white text-white dark:text-black font-semibold text-sm px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-70 disabled:hover:scale-100"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Subscribe <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* ================= 🌟 FLOATING POPUP NOTIFICATION ================= */}
      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl p-4 w-[320px] max-w-[calc(100vw-3rem)]"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-500" : "bg-red-50 dark:bg-red-900/20 text-red-500"}`}>
              {status === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-black dark:text-white">
                {status === "success" ? "Success!" : "Subscription Failed"}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {message}
              </p>
            </div>

            <button 
              onClick={() => setStatus("idle")} 
              className="p-2 -mr-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}