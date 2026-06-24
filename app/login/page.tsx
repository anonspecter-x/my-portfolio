"use client";

import { ArrowRight, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "./actions";

export default function LoginPage() {
  // Error state এবং Loading state হ্যান্ডেল করার জন্য React Hook
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#030303] px-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Secure access to portfolio dashboard.</p>

          <form action={formAction} className="flex flex-col gap-5">
            
            {/* ভুল পাসওয়ার্ড দিলে এই এরর বক্সটি দেখাবে */}
            {errorMessage && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="hello.naz.sakib@gmail.com"
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-11 py-3.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-11 py-3.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}