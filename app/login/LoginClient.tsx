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

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#fafafa] dark:bg-[#000000] selection:bg-gray-300 dark:selection:bg-gray-700">
      
      {/* 🌟 Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        
        {/* 📌 Dynamic Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 group mb-6 hover:opacity-80 transition-opacity">
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

        <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Sign in to dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Enter your credentials to securely access the admin portal.
        </p>
      </div>

      {/* 🌟 Login Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white dark:bg-[#0a0a0a] py-8 px-4 sm:rounded-2xl sm:px-10 border border-gray-200/80 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none">
          
          <form action={formAction} className="space-y-6">
            
            {/* 🔴 Error Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-xs leading-relaxed">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✉️ Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#050505] px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white sm:text-sm transition-colors"
                />
              </div>
            </div>

            {/* 🔒 Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#050505] px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white sm:text-sm transition-colors"
                />
              </div>
            </div>

            {/* 🚀 Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-black dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

        </div>

        {/* 🔙 Return Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to website
          </Link>
        </div>

      </div>
    </main>
  );
}