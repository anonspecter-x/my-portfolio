"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, X, Maximize2 } from "lucide-react";

interface Certificate {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
  certificateId?: string;
}

interface CertificatesClientProps {
  certificates: Certificate[];
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  // 📌 Animation Variants (Matched with other pages)
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

      {/* ================= 🌟 THE HERO SECTION ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24 relative z-10"
      >
        {/* 📌 Badge exactly matched with other pages */}
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Credentials
        </motion.div>
        
        {/* 📌 H1 exactly matched with other pages */}
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Professional <br className="hidden md:block" />
          <span className="text-gray-400">certifications.</span>
        </motion.h1>
        
        {/* 📌 P tag exactly matched with other pages */}
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
          A showcase of my continuous learning journey, technical validations, and professional milestones achieved through recognized global platforms.
        </motion.p>
      </motion.div>

      {/* ================= 🌟 CERTIFICATES GRID ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="relative z-10"
      >
        {certificates.length === 0 ? (
          // 🚫 Empty State (Matched with Blog/Brands page empty state styling)
          <motion.div variants={fadeUp} className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] bg-gray-50/50 dark:bg-[#111]/50">
            <Award className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Certifications are currently being updated.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certificates.map((cert) => (
              <motion.div 
                key={cert._id} 
                variants={fadeUp} 
                // 📌 Card style matched exactly with Blog Card (bg, border, rounded-2rem, shadow)
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-full relative z-10"
              >
                
                {/* 🖼️ Image Container (Matched with Blog Image wrapper style) */}
                <div 
                  onClick={() => cert.certificateImage && setSelectedImage(cert.certificateImage)}
                  className={`relative w-full aspect-[4/3] bg-gray-100 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 overflow-hidden ${cert.certificateImage ? 'cursor-zoom-in' : 'flex items-center justify-center'}`}
                >
                  {cert.certificateImage ? (
                    <>
                      <img 
                        src={cert.certificateImage} 
                        alt={cert.title} 
                        // Grayscale matching style
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                        <div className="bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-black dark:text-white shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                          <Maximize2 className="w-4 h-4" /> View Full
                        </div>
                      </div>
                    </>
                  ) : (
                    <Award className="w-12 h-12 text-gray-300 dark:text-gray-800" />
                  )}

                  {/* 🏅 Issuer Logo - Positioned elegantly inside the image boundary */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-[12px] bg-white border border-gray-200 dark:border-gray-800 shadow-md flex items-center justify-center z-20 group-hover:-translate-y-1 transition-transform duration-300">
                    {cert.issuerLogo ? (
                      <img 
                        src={cert.issuerLogo} 
                        alt={cert.issuerName} 
                        className="w-full h-full rounded-[8px] object-contain bg-white p-1" 
                      />
                    ) : (
                      <Award className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* 📝 Content Area (Matched with Blog Content padding) */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  
                  {/* Category / Issuer */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                      {cert.issuerName}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4 group-hover:text-blue-500 transition-colors duration-300 leading-snug line-clamp-3">
                    {cert.title}
                  </h3>

                  <div className="flex-1"></div> {/* Spacer to push button to bottom */}

                  {/* 📌 Verification Button (Minimalistic and matched with previous tags/borders) */}
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    {cert.credentialUrl ? (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group/btn flex items-center justify-between w-full text-[13px] font-bold text-black dark:text-white bg-gray-50 dark:bg-[#111] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors shadow-sm"
                      >
                        Verify Credential 
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : cert.certificateId ? (
                      <div className="flex items-center justify-between w-full text-[13px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111] py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 cursor-default">
                        <span className="truncate mr-2">ID: {cert.certificateId}</span>
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-[13px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111] py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 cursor-default">
                        Internally Verified
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ================= 🖼️ LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-gray-100 dark:bg-[#111] text-black dark:text-white rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#222] hover:scale-110 transition-all z-[101] shadow-lg border border-gray-200 dark:border-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]"
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