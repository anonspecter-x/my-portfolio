"use client";

import { useState, useRef } from "react";
import { sendMessage } from "./actions"; 
import { motion } from "framer-motion";
import { 
  Mail, Send, User, MessageSquare, CheckCircle2, 
  MapPin, Phone, ShieldCheck 
} from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

// ==========================================
// 🌟 SOCIAL ICONS (From React Icons FA)
// ==========================================
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaWhatsapp, 
  FaYoutube, 
  FaFacebook, 
  FaInstagram 
} from "react-icons/fa";

interface ContactClientProps {
  contactData: any;
  turnstileSiteKey: string;
}

export default function ContactClient({ contactData, turnstileSiteKey }: ContactClientProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.");
      setStatus("error");
      return;
    }

    try {
      formData.set("cf-turnstile-response", turnstileToken);
      await sendMessage(formData);
      
      setStatus("success");
      formRef.current?.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // 📌 Animation Variants (Updated to match other pages)
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const email = contactData?.email || "hello@example.com";
  const phone = contactData?.phone || "Not provided";
  const region = contactData?.region || "Dhaka, Bangladesh";

  return (
    // এখানে 'relative' ক্লাস যুক্ত করা হয়েছে
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden">
      
      {/* 🎨 Animated Background Elements (Updated to match other pages) */}
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

      {/* 🌟 Header (Left-aligned & Styled like other pages) */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <MessageSquare className="w-3.5 h-3.5" /> Let's Connect
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Ready to build <br className="hidden md:block" />
          <span className="text-gray-400">your next big idea?</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Whether you need a full-stack application, technical consultation, or just want to say hi—my inbox is always open.
        </motion.p>
      </motion.div>

      {/* 🌟 Grid Layout (Fixed heights using items-stretch) */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
      >
        
        {/* 🌟 Left Side: Contact Info Panel */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-5 h-full"
        >
          {/* h-full and flex-col added to make it stretch */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center h-12">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-black dark:text-white hover:text-blue-500 transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center h-12">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone / WhatsApp</p>
                  <a href={`tel:${phone}`} className="text-sm font-semibold text-black dark:text-white hover:text-purple-500 transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-black dark:text-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-600 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center h-12">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Service Area</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {region}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links (Dynamic) - mt-auto pushes it to the bottom */}
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800/60">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Social Networks</p>
              <div className="flex flex-wrap gap-2.5">
                {contactData?.socials?.github && (
                  <a href={contactData.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-sm">
                    <FaGithub className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.linkedin && (
                  <a href={contactData.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-sm">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.twitter && (
                  <a href={contactData.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-sm">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.whatsapp && (
                  <a href={contactData.socials.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-green-500 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-sm">
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.facebook && (
                  <a href={contactData.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-sm">
                    <FaFacebook className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.youtube && (
                  <a href={contactData.socials.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-colors shadow-sm">
                    <FaYoutube className="w-4 h-4" />
                  </a>
                )}
                {contactData?.socials?.instagram && (
                  <a href={contactData.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 hover:border-pink-200 dark:hover:border-pink-800 transition-colors shadow-sm">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🌟 Right Side: Contact Form */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-7 h-full"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm h-full flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">Send a Message</h3>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input 
                    type="text" name="name" required placeholder="John Doe" 
                    className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input 
                    type="email" name="email" required placeholder="john@example.com" 
                    className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Project Details
                </label>
                <textarea 
                  name="message" required placeholder="Tell me about your project, timeline, and goals..." 
                  className="w-full flex-1 min-h-[120px] bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-gray-400 shadow-sm"
                ></textarea>
              </div>

              {/* Cloudflare Turnstile */}
              <div className="pt-2 flex flex-col items-start gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Security Verification
                </label>
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 flex bg-gray-50 dark:bg-[#050505] w-fit">
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

              {status === "error" && errorMessage && (
                <p className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50">
                  {errorMessage}
                </p>
              )}

              {/* Full width button */}
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
                  {status === "success" && <><CheckCircle2 className="w-4 h-4" /> Transmission Successful!</>}
                  {status === "idle" && <><Send className="w-4 h-4" /> Initialize Project</>}
                  {status === "error" && <><Send className="w-4 h-4" /> Try Again</>}
                </button>
              </div>
            </form>

          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}