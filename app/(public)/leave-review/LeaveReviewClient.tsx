"use client";

import { useState, useRef, useEffect } from "react";
import { submitPublicReview } from "./actions"; 
import { motion } from "framer-motion";
import { 
  Send, User, MessageSquareQuote, CheckCircle2, 
  Briefcase, Star, ImagePlus, ShieldCheck, Quote, Sparkles, Rocket
} from "lucide-react";
import imageCompression from 'browser-image-compression';
import { Turnstile } from '@marsidev/react-turnstile'; 

interface LeaveReviewClientProps {
  turnstileSiteKey: string;
  testimonials: any[];
}

export default function LeaveReviewClient({ turnstileSiteKey, testimonials }: LeaveReviewClientProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  // 📌 Testimonials Marquee Logic (Homepage Style)
  const baseTestimonials = testimonials || [];
  const desktopTestimonials = [...baseTestimonials, ...baseTestimonials]; 
  const mobileTestimonials = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials, ...baseTestimonials];

  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const [isMobileInteracting, setIsMobileInteracting] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller || mobileTestimonials.length === 0) return;

    let animationId: number;
    const scroll = () => {
      if (!isMobileInteracting) {
        scroller.scrollLeft += 1; 
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isMobileInteracting, mobileTestimonials.length]);

  const handleTouchStart = () => {
    setIsMobileInteracting(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
  };

  const handleTouchEnd = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsMobileInteracting(false);
    }, 800);
  };

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
    // 📌 Main Container
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Testimonials Custom CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - 1.5rem)); } 
        }
        .animate-marquee {
          animation: scroll-marquee 40s linear infinite;
        }
        .pause-on-hover:hover .animate-marquee,
        .pause-on-hover:focus-within .animate-marquee {
          animation-play-state: paused;
        }
      `}} />

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

      {/* 🌟 Header Section */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <MessageSquareQuote className="w-3.5 h-3.5" /> Client Feedback
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Share your <br className="hidden md:block" />
          <span className="text-gray-400">experience.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Your feedback helps me improve and continue delivering high-performance, scalable digital ecosystems.
        </motion.p>
      </motion.div>

      {/* 🌟 Grid Layout for Guidelines & Form */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
      >
        
        {/* 🌟 Left Side: Info & Guidelines (Updated Layout) */}
        <motion.div variants={fadeUp} className="lg:col-span-5 h-full flex flex-col gap-6">
          
          {/* Box 1: Review Guidelines (Merged 3 points) */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Review Guidelines</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                  <Quote className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1">Honesty & Specifics</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Describe your authentic experience, highlighting specific aspects of our collaboration and project quality.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 transition-colors">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1">Authentic Identity</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Uploading a profile picture is required to verify your authenticity and add a personal touch to your review.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 group-hover:text-orange-600 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1">Security Verification</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">All reviews pass through a quick security check to maintain a genuine and spam-free portfolio showcase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: What Happens Next (New Section with 2 points) */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">What Happens Next?</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 group-hover:text-yellow-600 transition-colors">
                  <Star className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1">Portfolio Showcase</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Verified reviews will be proudly displayed in the marquee carousel below and directly on my homepage.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-600 transition-colors">
                  <Rocket className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-1">Continuous Improvement</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Your valuable insights help me refine my process and deliver even better digital solutions in the future.</p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* 🌟 Right Side: The Form */}
        <motion.div variants={fadeUp} className="lg:col-span-7 h-full">
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
                  name="review" required placeholder="How was your experience working with me?" maxLength={500}
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
                  <ShieldCheck className="w-3.5 h-3.5" /> Security Verification *
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

      {/* ================= 🌟 TESTIMONIALS CAROUSEL (Homepage Style) ================= */}
      {baseTestimonials.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="pt-20 md:pt-32 mt-16 md:mt-24 border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          
          <div className="mb-12 md:mb-16 text-center">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-black dark:text-white">
              Recent Feedback
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what others are saying about their collaboration experience.
            </motion.p>
          </div>

          {/* Desktop Marquee */}
          <div className="hidden md:flex relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pause-on-hover pt-4 pb-12">
            <div className="flex shrink-0 animate-marquee gap-6">
              {desktopTestimonials.map((testimonial, idx) => (
                <div 
                  key={`desktop1-${testimonial._id}-${idx}`} 
                  className="w-[400px] shrink-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col justify-between relative group hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-colors whitespace-normal text-left"
                >
                  <div className="absolute top-6 right-6 text-gray-100 dark:text-[#151515] group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Quote className="w-16 h-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-800"}`} />
                      ))}
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 line-clamp-4">
                      "{testimonial.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-gray-100 dark:border-white/5">
                    <img 
                      src={testimonial.photoUrl || "https://via.placeholder.com/150"} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 pointer-events-none" 
                    />
                    <div>
                      <h4 className="font-bold text-black dark:text-white text-base">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div aria-hidden="true" className="flex shrink-0 animate-marquee gap-6 ml-6">
              {desktopTestimonials.map((testimonial, idx) => (
                <div 
                  key={`desktop2-${testimonial._id}-${idx}`} 
                  className="w-[400px] shrink-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm flex flex-col justify-between relative group hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-colors whitespace-normal text-left"
                >
                  <div className="absolute top-6 right-6 text-gray-100 dark:text-[#151515] group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Quote className="w-16 h-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-800"}`} />
                      ))}
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 line-clamp-4">
                      "{testimonial.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-gray-100 dark:border-white/5">
                    <img 
                      src={testimonial.photoUrl || "https://via.placeholder.com/150"} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 pointer-events-none" 
                    />
                    <div>
                      <h4 className="font-bold text-black dark:text-white text-base">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Auto-Scroller */}
          <div 
            ref={mobileScrollerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex md:hidden relative w-full overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] pt-4 pb-12 gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {mobileTestimonials.map((testimonial, idx) => (
              <div 
                key={`mobile-${testimonial._id}-${idx}`} 
                className="w-[280px] shrink-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative whitespace-normal text-left"
              >
                <div className="absolute top-6 right-6 text-gray-100 dark:text-[#151515] transition-colors">
                  <Quote className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-800"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-6 line-clamp-4">
                    "{testimonial.review}"
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-auto relative z-10 pt-5 border-t border-gray-100 dark:border-white/5">
                  <img 
                    src={testimonial.photoUrl || "https://via.placeholder.com/150"} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 pointer-events-none" 
                  />
                  <div>
                    <h4 className="font-bold text-black dark:text-white text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </motion.section>
      )}

    </main>
  );
}