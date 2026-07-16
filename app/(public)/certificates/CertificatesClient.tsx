"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, X, Maximize2 } from "lucide-react";
import Link from "next/link";

interface Certificate {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
}

interface CertificatesClientProps {
  certificates: Certificate[];
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  // 📌 Lightbox Modal State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 📌 Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  // 📌 Framer Motion Variants
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
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      {/* 🌟 Header Section */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24 relative z-10"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Credentials
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Professional <br className="hidden md:block" />
          <span className="text-gray-400">Certifications.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          A showcase of my continuous learning journey, technical validations, and professional milestones achieved through recognized global platforms.
        </motion.p>
      </motion.div>

      {/* 🌟 Premium Grid Layout (Floating Logo Design) */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="relative z-10"
      >
        {certificates.length === 0 ? (
          <motion.div variants={fadeUp} className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl">
            <Award className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Certifications are currently being updated.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <motion.div 
                key={cert._id} 
                variants={fadeUp} 
                className="group bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-3 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_-15px_rgba(255,255,255,0.05)] transition-all duration-500 flex flex-col hover:-translate-y-2 relative"
              >
                
                {/* 🖼️ Certificate Image (Top Cover) */}
                <div 
                  onClick={() => setSelectedImage(cert.certificateImage!)}
                  className="relative w-full aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-gray-800 cursor-zoom-in group/img"
                >
                  {cert.certificateImage ? (
                    <img 
                      src={cert.certificateImage} 
                      alt={cert.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-12 h-12 text-gray-300 dark:text-gray-800" />
                    </div>
                  )}
                  {/* Hover Overlay for Zoom */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 dark:group-hover/img:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100 z-10">
                     <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-black dark:text-white shadow-lg translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300">
                       <Maximize2 className="w-4 h-4" /> View Certificate
                     </div>
                  </div>
                </div>

                {/* 🏅 Floating Issuer Logo (No extra padding, Perfectly Rounded) */}
                <div className="relative px-4">
                  <div className="absolute -top-7 left-4 w-14 h-14 rounded-xl bg-white border-4 border-white dark:border-[#0a0a0a] shadow-md flex items-center justify-center overflow-hidden z-20 group-hover:scale-105 transition-transform duration-300">
                    {cert.issuerLogo ? (
                      <img 
                        src={cert.issuerLogo} 
                        alt={cert.issuerName} 
                        className="w-full h-full object-cover" // 📌 নো প্যাডিং, পুরো বক্স জুড়ে ছবি ফিট হবে
                      />
                    ) : (
                      <Award className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* 📝 Content Section */}
                <div className="flex flex-col flex-1 pt-10 px-4 pb-2">
                  
                  {/* Issuer Name */}
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 line-clamp-1">
                    {cert.issuerName}
                  </span>
                  
                  {/* Course Title */}
                  <h3 className="font-bold text-lg leading-snug text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-6">
                    {cert.title}
                  </h3>

                  {/* Bottom Action Button */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                    {cert.credentialUrl ? (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-black dark:text-white hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors group/link bg-gray-50 dark:bg-[#111] py-3.5 px-4 rounded-xl border border-gray-200/50 dark:border-white/5 shadow-sm"
                      >
                        Verify Credential <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-400 bg-gray-50 dark:bg-[#111] py-3.5 px-4 rounded-xl cursor-not-allowed border border-gray-100 dark:border-gray-800/50">
                        <ShieldCheck className="w-4 h-4" /> Internally Verified
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ================= 🖼️ FULL SCREEN LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-gray-100 dark:bg-[#111] text-black dark:text-white rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#222] hover:scale-110 transition-all z-[101] shadow-lg border border-gray-200 dark:border-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Res Image Container */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10 bg-white dark:bg-[#050505]"
              onClick={(e) => e.stopPropagation()} 
            >
              <img 
                src={selectedImage} 
                alt="Certificate High Resolution" 
                className="w-full h-full max-h-[90vh] object-contain" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}