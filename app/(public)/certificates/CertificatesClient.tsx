"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, X, Maximize2, ArrowRight } from "lucide-react";

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
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[90rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10"
      />

      {/* 🌟 Header Section */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-4xl mb-16 md:mb-24 relative z-10"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-bold mb-6 text-gray-700 dark:text-gray-300 shadow-sm uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-blue-500" /> Verified Credentials
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-[4rem] font-extrabold tracking-tight text-black dark:text-white leading-[1.05] mb-6">
          Professional <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300">
            Certifications.
          </span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          A showcase of my continuous learning journey, technical validations, and professional milestones achieved through recognized global platforms.
        </motion.p>
      </motion.div>

      {/* 🌟 PREMIUM HORIZONTAL SPLIT-CARD GRID (Unique Layout) */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="relative z-10"
      >
        {certificates.length === 0 ? (
          <motion.div variants={fadeUp} className="text-center py-24 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#0a0a0a]/50">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-5" />
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">No credentials uploaded yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {certificates.map((cert) => (
              <motion.div 
                key={cert._id} 
                variants={fadeUp} 
                className="group relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-5 md:p-6 flex flex-col-reverse sm:flex-row gap-6 md:gap-8 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.08)] transition-all duration-500 overflow-hidden"
              >
                
                {/* 📝 Left Side: Info & Actions */}
                <div className="flex flex-col justify-between flex-1 relative z-10">
                  
                  <div>
                    {/* Issuer Logo & Name (Badge Style) */}
                    <div className="flex items-center gap-3 mb-5">
                      {cert.issuerLogo ? (
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <img 
                            src={cert.issuerLogo} 
                            alt={cert.issuerName} 
                            className="w-full h-full object-cover scale-[1.05]" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-widest bg-gray-100 dark:bg-[#111] px-3.5 py-1.5 rounded-full border border-gray-200/60 dark:border-white/5 line-clamp-1">
                        {cert.issuerName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl md:text-2xl leading-snug text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-6 pr-4">
                      {cert.title}
                    </h3>
                  </div>

                  {/* Verification Link / Status */}
                  <div className="mt-auto pt-5 border-t border-gray-100 dark:border-white/5">
                    {cert.credentialUrl ? (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white transition-colors group/link"
                      >
                        Verify Credential 
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 cursor-not-allowed">
                        <ShieldCheck className="w-4 h-4" /> Internally Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* 🖼️ Right Side: Image Showcase (Hover Tilt Effect) */}
                <div 
                  onClick={() => cert.certificateImage && setSelectedImage(cert.certificateImage)}
                  className={`relative w-full sm:w-[220px] md:w-[260px] shrink-0 aspect-[16/11] rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-white/10 group-hover:rotate-[-2deg] group-hover:scale-[1.02] transition-all duration-500 z-10 ${cert.certificateImage ? 'cursor-zoom-in bg-gray-50 dark:bg-[#050505]' : 'bg-gray-100 dark:bg-[#111] flex items-center justify-center'}`}
                >
                  {cert.certificateImage ? (
                    <>
                      <img 
                        src={cert.certificateImage} 
                        alt={cert.title} 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                      {/* Zoom Hint Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-black dark:text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Award className="w-12 h-12 text-gray-300 dark:text-gray-800" />
                  )}
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl p-4 sm:p-8"
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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[90vh] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10 bg-white dark:bg-[#050505]"
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