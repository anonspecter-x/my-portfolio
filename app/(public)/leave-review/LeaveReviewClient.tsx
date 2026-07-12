"use client";

import { useState, useRef } from "react";
import { submitPublicReview } from "./actions"; 
import { motion } from "framer-motion";
import { 
  Send, User, MessageSquareQuote, CheckCircle2, 
  Briefcase, Star, ImagePlus, ShieldCheck, Quote, 
  Sparkles, Target, Award
} from "lucide-react";
import imageCompression from 'browser-image-compression';
import { Turnstile } from '@marsidev/react-turnstile'; 

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

    try {
      // 📌 Image Compression Logic
      const photoFile = formData.get("photo") as File;
      if (photoFile && photoFile.size > 0) {
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 800, 
          useWebWorker: true, 
        };
        
        const compressedBlob = await imageCompression(photoFile, options);
        
        const compressedFile = new File([compressedBlob], photoFile.name, {
          type: photoFile.type || "image/jpeg",
          lastModified: Date.now(),
        });

        formData.set("photo", compressedFile);
      } else {
        // ফন্টএন্ড ভ্যালিডেশন যদি ফেইল করে (যদিও required দেওয়া আছে)
        throw new Error("Profile photo is mandatory for verification.");
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

  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    // 📌 Responsive Padding: pt-24 on mobile, md:pt-32 on desktop for perfect spacing
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-24 md:pt-32 pb-16 md:pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* 🌟 Header Section (Responsive bottom margin: mb-10 on mobile, md:mb-16 on desktop) */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-10 md:mb-16"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <MessageSquareQuote className="w-3.5 h-3.5" /> Client Feedback
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Share your <br className="hidden md:block" />
          <span className="text-gray-400">experience.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Your feedback is highly valued. It helps me continuously refine my process and deliver exceptional digital solutions.
        </motion.p>
      </motion.div>

      {/* 🌟 Grid Layout */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
      >
        
        {/* 🌟 Left Side: Professional Guidelines Panel */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-5 h-full"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-8">Review Guidelines</h3>
            
            <div className="space-y-7">
              {/* Point 1 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1.5">Authentic Experience</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Detail your experience regarding the project workflow, code quality, and overall technical management.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 transition-colors">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1.5">Specific Outcomes</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Highlight specific project deliverables, performance improvements, or business goals achieved through our collaboration.
                  </p>
                </div>
              </div>
              
              {/* Point 3 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-600 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1.5">Visual Verification</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    A professional headshot is <span className="font-semibold text-black dark:text-white">required</span> to ensure authenticity and establish trust within the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🌟 Right Side: The Form */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-7 h-full"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm h-full flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Submit Feedback</h3>

            <form 
              ref={formRef} 
              action={handleAction} 
              onSubmit={(e) => {
                if (!turnstileToken) {
                  e.preventDefault();
                  setErrorMessage("Please complete the security check.");
                  setStatus("error");
                } else {
                  setStatus("loading");
                }
              }}
              className="space-y-5 flex flex-col flex-1 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name *
                  </label>
                  <input 
                    type="text" name="name" required placeholder="John Doe" maxLength={50}
                    className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Designation / Company *
                  </label>
                  <input 
                    type="text" name="role" required placeholder="CEO at TechCorp" maxLength={60}
                    className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5" /> Your Review *
                </label>
                <textarea 
                  name="review" required placeholder="Detail your experience working with me..." maxLength={500}
                  className="w-full flex-1 min-h-[120px] bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-gray-400 shadow-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5 h-[18px]">
                    <Star className="w-3.5 h-3.5" /> Rating *
                  </label>
                  <div className="w-full h-[46px] bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-xl px-4 flex items-center justify-between shadow-sm">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {rating} / 5
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110 flex items-center justify-center"
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              star <= (hoverRating || rating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300 dark:text-gray-700"
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* 📌 Label updated to make it required clearly */}
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5 h-[18px]">
                    <ImagePlus className="w-3.5 h-3.5" /> Profile Photo *
                  </label>
                  <input 
                    type="file" name="photo" accept="image/*" required
                    className="w-full h-[46px] bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-[#222] dark:file:text-gray-300 cursor-pointer shadow-sm" 
                  />
                </div>
              </div>

              {/* Cloudflare Turnstile */}
              <div className="pt-2 flex flex-col items-start gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Security Verification
                </label>
                <div className="w-full flex items-center justify-center bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-xl py-3 shadow-sm overflow-hidden">
                  <Turnstile 
                    siteKey={turnstileSiteKey} 
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                      setErrorMessage("");
                    }}
                    onError={() => {
                      setErrorMessage("Security verification failed.");
                      setStatus("error");
                    }}
                    options={{ theme: 'auto' }}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50">
                  {errorMessage}
                </p>
              )}

              {/* Full width button pushed to bottom */}
              <div className="pt-2 mt-auto">
                <button 
                  type="submit" 
                  disabled={status === "loading" || status === "success" || !turnstileToken}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm ${
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
                <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                  <ShieldCheck className="w-3 h-3 inline-block mb-0.5 mr-1" />
                  Your review will be verified before appearing on the portfolio.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}