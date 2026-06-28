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
  // 📌 TypeScript Error Fix: Added ': any' to explicitly bypass the strict Easing array type mismatch
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] transition-colors duration-1000 ease-in-out selection:bg-blue-500/30 font-sans overflow-clip">
      
      {/* 🎨 Heavy / Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_40%,transparent_110%)]"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 md:px-12 pt-32 pb-20 relative z-10">
        
        {/* ================= 🌟 THE GRAND HERO SECTION ================= */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="max-w-4xl mb-16 md:mb-24"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-bold mb-8 text-black dark:text-white shadow-sm">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Trusted Partners & Clients
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-8">
            Collaborating with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400 dark:from-gray-400 dark:to-gray-600">visionary brands.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            From emerging startups to established enterprises, I engineer robust, scalable architectures and premium digital experiences that drive measurable business growth.
          </motion.p>
        </motion.div>

        {/* ================= 🌟 HEAVY STATS BAR ================= */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 md:mb-32"
        >
          <div className="relative overflow-hidden flex items-center gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none group hover:border-blue-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Globe className="w-24 h-24" />
            </div>
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
              <Globe className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h4 className="text-4xl font-black text-black dark:text-white mb-1">100+</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Clients</p>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none group hover:border-purple-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Award className="w-24 h-24" />
            </div>
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30">
              <Award className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h4 className="text-4xl font-black text-black dark:text-white mb-1">100%</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Success</p>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none group hover:border-green-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h4 className="text-4xl font-black text-black dark:text-white mb-1">NDAs</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Strictly Respected</p>
            </div>
          </div>
        </motion.div>

        {/* ================= 🌟 PREMIUM BRANDS SHOWCASE GRID ================= */}
        {brands.length > 0 ? (
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {brands.map((brand) => (
              <motion.div key={brand._id} variants={fadeUp}>
                <Link 
                  href={brand.website !== "#" ? brand.website : "#"}
                  target={brand.website !== "#" ? "_blank" : "_self"}
                  rel={brand.website !== "#" ? "noopener noreferrer" : ""}
                  className={`group block relative p-8 sm:p-10 md:p-12 bg-white dark:bg-[#080808] border border-gray-200 dark:border-gray-800 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.2)] hover:-translate-y-1 hover:border-blue-500/40 dark:hover:border-blue-500/30 overflow-hidden ${brand.website !== "#" ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
                >
                  {/* Subtle dynamic background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-colors duration-700 pointer-events-none z-0"></div>
                  
                  {/* Glassy overlay effect on hover to make brand name pop */}
                  <div className="absolute inset-0 bg-white/0 dark:bg-black/0 group-hover:bg-white/10 group-hover:dark:bg-black/20 backdrop-blur-0 transition-all duration-500 z-10"></div>
                  
                  {/* External Link Indicator */}
                  {brand.website !== "#" && (
                    <div className="absolute top-5 right-5 md:top-6 md:right-6 bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 duration-500 z-30 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  )}

                  {/* Colored Logo Display */}
                  <div className="relative z-20 w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="max-w-[75%] max-h-[75%] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-sm group-hover:drop-shadow-2xl"
                    />
                  </div>

                  {/* Elegant Brand Tag (Pill) on Hover */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 z-30">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-black dark:text-white bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl px-5 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-2xl">
                      {brand.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-32 md:py-48 border border-dashed border-gray-300 dark:border-gray-800 rounded-[3rem] bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-sm">
            <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">Brand showcase is currently being updated.</p>
          </div>
        )}

        {/* ================= 🌟 BOTTOM CTA SECTION ================= */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="mt-32 md:mt-48 w-full bg-black dark:bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          {/* CTA Background Decors */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500 opacity-20 dark:opacity-10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500 opacity-20 dark:opacity-10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center mb-8 border border-white/20 dark:border-black/20">
              <Sparkles className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-black mb-8 tracking-tight leading-tight">
              Ready to see your brand <br className="hidden md:block" /> on this list?
            </h2>
            <p className="text-gray-400 dark:text-gray-600 md:text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">
              Let’s architect a high-performance solution tailored to your business goals. Reach out to discuss your next big technical endeavor.
            </p>
            
            <Link href="/contact" className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-white dark:bg-black text-black dark:text-white font-bold text-sm md:text-base rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-800">
              Initiate Collaboration <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}