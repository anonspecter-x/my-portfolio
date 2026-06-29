"use client";

import { useState, useRef } from "react";
import { submitPublicReview } from "./actions"; 
import { motion } from "framer-motion";
import { 
  Send, User, MessageSquareQuote, CheckCircle2, 
  Briefcase, Star, ImagePlus, ShieldCheck, Loader2
} from "lucide-react";
import imageCompression from 'browser-image-compression';
import { Turnstile } from '@marsidev/react-turnstile'; // npm install @marsidev/react-turnstile

export default function LeaveReviewClient({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // 📌 Image Compression Logic
      const photoFile = formData.get("photo") as File;
      if (photoFile && photoFile.size > 0) {
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 800, 
          useWebWorker: true, 
        };
        const compressedFile = await imageCompression(photoFile, options);
        formData.set("photo", compressedFile, compressedFile.name);
      }

      // Append Rating and Turnstile Token securely
      formData.set("rating", rating.toString());
      formData.set("cf-turnstile-response", turnstileToken);

      await submitPublicReview(formData);
      
      setStatus("success");
      formRef.current?.reset();
      setRating(5);
      
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // 📌 Animation Variants matching your theme
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-12 md:mb-16 text-center mx-auto"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <MessageSquareQuote className="w-3.5 h-3.5" /> Client Feedback
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Share your <span className="text-gray-400">experience.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Your feedback helps me improve and continue delivering high-performance digital ecosystems.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm relative overflow-hidden">
          
          <form ref={formRef} action={handleAction} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name *
                </label>
                <input 
                  type="text" name="name" required placeholder="John Doe" maxLength={50}
                  className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Designation / Company
                </label>
                <input 
                  type="text" name="role" placeholder="CEO at TechCorp" maxLength={60}
                  className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5" /> Your Review *
              </label>
              <textarea 
                name="review" required placeholder="How was your experience working with me?" maxLength={500}
                className="w-full min-h-[120px] bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all resize-none placeholder:text-gray-400 shadow-sm"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-200 dark:text-gray-800"
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <ImagePlus className="w-3.5 h-3.5" /> Profile Photo (Optional)
                </label>
                <input 
                  type="file" name="photo" accept="image/*" 
                  className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-[#222] dark:file:text-gray-300 cursor-pointer shadow-sm" 
                />
              </div>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="pt-2 flex flex-col items-start gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Security Verification
              </label>
              <Turnstile 
                siteKey={turnstileSiteKey} 
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setErrorMessage("");
                }}
                onError={() => setErrorMessage("Security verification failed.")}
                options={{ theme: 'auto' }}
              />
            </div>

            {status === "error" && (
              <p className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/50">
                {errorMessage}
              </p>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success" || !turnstileToken}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-sm px-6 py-4 rounded-xl transition-all duration-300 shadow-sm ${
                  status === "success" 
                  ? "bg-green-500 text-white" 
                  : "bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                }`}
              >
                {status === "loading" && <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>}
                {status === "success" && <><CheckCircle2 className="w-4 h-4" /> Review Submitted Successfully!</>}
                {status === "idle" && <><Send className="w-4 h-4" /> Submit Review</>}
                {status === "error" && <><Send className="w-4 h-4" /> Try Again</>}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Your review will be verified before appearing on the portfolio.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}