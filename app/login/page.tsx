"use client";

import { ArrowRight, Lock, Mail, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "./actions";
import { motion } from "framer-motion";

export default function LoginPage() {
  // Error state এবং Loading state হ্যান্ডেল করার জন্য React Hook
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#030303] px-4 sm:px-6 overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[-10%] md:left-[20%] w-[300px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[-10%] md:right-[20%] w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* 🌟 Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-2xl dark:shadow-[0_8px_40px_-15px_rgba(0,0,0,0.8)] relative z-10"
      >
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-black uppercase tracking-widest mb-5 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Area
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-2">
            Admin Portal.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Authenticate to access the portfolio dashboard.
          </p>
        </div>

        {/* Form Section */}
        <form action={formAction} className="flex flex-col gap-5">
          
          {/* 🔴 Error Alert Box */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="font-semibold">{errorMessage}</p>
            </motion.div>
          )}

          {/* ✉️ Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="hello@example.com"
                className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-11 py-3.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* 🔒 Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-11 py-3.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* 🚀 Submit Button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="mt-2 w-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Secure Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 🔙 Return Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Public Website
          </Link>
        </div>
      </motion.div>
    </main>
  );
}