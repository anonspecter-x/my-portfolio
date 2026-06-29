"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowUpRight, 
  Globe, 
  Award, 
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  Code2,
  Rocket,
  Info // 📌 Added Info icon for the disclaimer
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

  // Timeline Steps
  const processSteps = [
    { id: 1, title: "Discovery & Planning", desc: "Understanding your vision, business goals, and technical requirements.", icon: Search },
    { id: 2, title: "Architecture Design", desc: "Structuring scalable databases and secure system workflows.", icon: Layers },
    { id: 3, title: "Agile Development", desc: "Writing clean, high-performance, and maintainable code.", icon: Code2 },
    { id: 4, title: "Deployment & Scaling", desc: "Launching the product securely with zero downtime.", icon: Rocket }
  ];

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Custom Marquee CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 🎨 Background Elements */}
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

      {/* ================= 🌟 STATS BAR ================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32"
      >
        {[
          { icon: Globe, count: "100+", label: "Global Clients", color: "blue" },
          { icon: Award, count: "100%", label: "Project Success", color: "purple" },
          { icon: ShieldCheck, count: "NDAs", label: "Strictly Respected", color: "green" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:border-blue-500/50 transition-colors duration-300 relative overflow-hidden group flex flex-col">
            <div className={`w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-${stat.color}-500 rounded-xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="relative z-10">
              <h4 className="text-3xl font-black text-black dark:text-white mb-2">{stat.count}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <stat.icon className="w-24 h-24" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ================= 🌟 INFINITE MARQUEE ================= */}
      {brands.length > 3 && (
        <div className="mb-24 overflow-hidden relative w-full border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0a0a0a]/50 py-8">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fafafa] dark:from-[#030303] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fafafa] dark:from-[#030303] to-transparent z-10"></div>
          
          <div className="animate-marquee items-center gap-16">
            {[...brands, ...brands].map((brand, idx) => (
              <div key={idx} className="w-32 h-12 flex-shrink-0 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain dark:invert" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 🌟 BRANDS GRID ================= */}
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
                className={`group flex flex-col items-center justify-center p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 relative aspect-square ${brand.website !== "#" ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
              >
                {brand.website !== "#" && (
                  <div className="absolute top-4 right-4 bg-gray-50 dark:bg-[#111] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 border border-gray-200 dark:border-gray-800 shadow-sm z-20">
                    <ArrowUpRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-500 transition-colors" />
                  </div>
                )}

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-[85%] max-h-[85%] w-full object-contain dark:brightness-0 dark:invert group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 group-active:translate-y-0 duration-500 z-20">
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

      {/* ================= 🌟 LEGAL DISCLAIMER (NEWLY ADDED) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 flex items-start sm:items-center gap-3 p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 max-w-full"
      >
        <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-left">
          <strong className="text-gray-700 dark:text-gray-300">Disclaimer:</strong> The logos and brand names displayed on this page are strictly for portfolio and illustrative purposes, representing past collaborations, clients, or completed projects. All trademarks, logos, and copyrights belong to their respective owners. I do not claim any ownership over these third-party intellectual properties, nor does their display imply a direct endorsement.
        </p>
      </motion.div>
      {/* ====================================================================== */}

      {/* ================= 🌟 HOW WE COLLABORATE (Timeline Section) ================= */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
        className="mt-32 md:mt-40 mb-16"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            How I collaborate with brands.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400">
            A proven methodology ensuring seamless delivery from the first concept to the final deployment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent -z-10"></div>

          {processSteps.map((step) => (
            <motion.div key={step.id} variants={fadeUp} className="relative group">
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2">STEP 0{step.id}</div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= 🌟 BOTTOM CTA SECTION ================= */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
        className="mt-24 md:mt-32 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center"
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