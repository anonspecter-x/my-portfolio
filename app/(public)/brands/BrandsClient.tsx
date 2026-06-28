"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowUpRight, 
  Globe, 
  Award, 
  ShieldCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface Brand {
  _id: string;
  name: string;
  logo: string;
  website: string;
}

interface BrandsClientProps {
  brands: Brand[];
}

export default function BrandsClient({ brands }: BrandsClientProps) {
  // 📌 TypeScript Error Fix
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
      
      {/* 🎨 Background Elements (Contact পেজের মতো) */}
      <div className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* ================= 🌟 THE HERO SECTION ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="max-w-3xl mb-16 md:mb-24"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <Building2 className="w-3.5 h-3.5" /> Trusted Partners & Clients
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Collaborating with <br className="hidden md:block" />
          <span className="text-gray-400">visionary brands.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          From emerging startups to established enterprises, I engineer robust, scalable architectures and premium digital experiences that drive measurable business growth.
        </motion.p>
      </motion.div>

      {/* ================= 🌟 STATS BAR (About/Contact পেজের কার্ডের মতো) ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32"
      >
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:border-blue-500/50 transition-colors duration-300 relative overflow-hidden group flex flex-col">
          <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-blue-500 rounded-xl flex items-center justify-center mb-6">
            <Globe className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <h4 className="text-3xl font-black text-black dark:text-white mb-2">100+</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Clients</p>
          </div>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Globe className="w-24 h-24" />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:border-purple-500/50 transition-colors duration-300 relative overflow-hidden group flex flex-col">
          <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-purple-500 rounded-xl flex items-center justify-center mb-6">
            <Award className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <h4 className="text-3xl font-black text-black dark:text-white mb-2">100%</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Success</p>
          </div>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Award className="w-24 h-24" />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:border-green-500/50 transition-colors duration-300 relative overflow-hidden group flex flex-col">
          <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-green-500 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <h4 className="text-3xl font-black text-black dark:text-white mb-2">NDAs</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strictly Respected</p>
          </div>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck className="w-24 h-24" />
          </div>
        </div>
      </motion.div>

      {/* ================= 🌟 BRANDS GRID (Projects পেজের মতো) ================= */}
      {brands.length > 0 ? (
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {brands.map((brand) => (
            <motion.div key={brand._id} variants={fadeUp}>
              <Link 
                href={brand.website !== "#" ? brand.website : "#"}
                target={brand.website !== "#" ? "_blank" : "_self"}
                rel={brand.website !== "#" ? "noopener noreferrer" : ""}
                className={`group flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 relative aspect-square ${brand.website !== "#" ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
              >
                {/* External Link Indicator */}
                {brand.website !== "#" && (
                  <div className="absolute top-4 right-4 bg-gray-50 dark:bg-[#111] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 border border-gray-200 dark:border-gray-800 shadow-sm z-20">
                    <ArrowUpRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                  </div>
                )}

                {/* Logo */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-[70%] max-h-[70%] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                {/* Brand Tag / Badge */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 z-20">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 bg-gray-50/90 dark:bg-[#111]/90 backdrop-blur-md px-3 py-1.5 rounded border border-gray-200 dark:border-gray-800 shadow-sm">
                    {brand.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-32 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-[#111]/50">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Brand showcase is currently being updated.</p>
        </div>
      )}

      {/* ================= 🌟 BOTTOM CTA SECTION (About পেজের Manifesto/CTA স্টাইলে) ================= */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
        className="mt-32 md:mt-48 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Sparkles className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <motion.div variants={fadeUp} className="w-12 h-12 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl flex items-center justify-center mb-6 text-white dark:text-black">
            <Sparkles className="w-5 h-5" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tight leading-snug mb-6">
            Ready to see your brand <br className="hidden md:block" /> on this list?
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-gray-300 dark:text-gray-700 text-lg mb-10 max-w-2xl leading-relaxed">
            Let’s architect a high-performance solution tailored to your business goals. Reach out to discuss your next big technical endeavor.
          </motion.p>
          
          <motion.div variants={fadeUp}>
            <Link href="/contact" className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg">
              Initiate Collaboration <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}