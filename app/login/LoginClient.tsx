"use client";

import { AlertCircle, Loader2, Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { authenticate } from "./actions"; 
import { motion, AnimatePresence } from "framer-motion";

interface LoginClientProps {
  settings: any;
}

export default function LoginClient({ settings }: LoginClientProps) {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const logoText = settings?.developerName ? settings.developerName.split(" ")[0] + "." : "Nazmus.";
  const devFullName = settings?.developerName || "Admin Portal";

  // Vercel/Linear style custom easing
  const smoothEase: any = [0.32, 0.72, 0, 1];

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] dark:bg-[#000000] selection:bg-black/10 dark:selection:bg-white/20">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: smoothEase }}
        className="sm:mx-auto sm:w-full sm:max-w-[420px] flex flex-col items-center z-10"
      >
        
        {/* 📌 Dynamic Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 group mb-8 hover:opacity-80 transition-opacity">
          {settings?.siteLogoLight || settings?.siteLogoDark || settings?.siteLogo ? (
            <>
              {(settings?.siteLogoLight || settings?.siteLogo) && (
                <img 
                  src={settings.siteLogoLight || settings.siteLogo} 
                  alt={devFullName} 
                  className={`h-8 w-auto object-contain ${settings?.siteLogoDark ? 'block dark:hidden' : ''}`} 
                />
              )}
              {settings?.siteLogoDark && (
                <img 
                  src={settings.siteLogoDark} 
                  alt={devFullName} 
                  className={`h-8 w-auto object-contain ${(settings?.siteLogoLight || settings?.siteLogo) ? 'hidden dark:block' : ''}`} 
                />
              )}
            </>
          ) : (
            <>
              <span className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm">
                <Code2 className="w-4 h-4" />
              </span>
              <span className="font-bold text-xl tracking-tight text-black dark:text-white">
                {logoText}
              </span>
            </>
          )}
        </Link>

        <h2 className="mt-1 text-center text-[22px] font-semibold tracking-tight text-gray-900 dark:text-white">
          Sign in to Admin
        </h2>
        <p className="mt-2 text-center text-[14px] text-gray-500 dark:text-gray-400">
          Authenticate to access your workspace
        </p>
      </motion.div>

      {/* 🌟 Ultra-Premium Login Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: smoothEase }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px] z-10"
      >
        <div className="bg-white dark:bg-black py-8 px-6 sm:rounded-2xl sm:px-10 border border-gray-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] relative overflow-hidden">
          
          <form action={formAction} className="space-y-5">
            
            {/* 🔴 Error Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-500/20">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-[13px] leading-relaxed">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✉️ Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="block w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white sm:text-sm transition-all duration-200"
              />
            </div>

            {/* 🔒 Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="block w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white sm:text-sm transition-all duration-200"
              />
            </div>

            {/* 🚀 Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-black dark:bg-white px-4 py-3 text-[14px] font-semibold text-white dark:text-black shadow-sm hover:bg-gray-900 dark:hover:bg-gray-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

        </div>

        {/* 🔙 Return Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            Return to website
          </Link>
        </div>

      </motion.div>
    </main>
  );
}