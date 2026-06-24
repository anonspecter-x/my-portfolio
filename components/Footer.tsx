"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code2, ArrowUp, Globe, Shield } from "lucide-react";

export default function Footer() {
  // ==========================================
  // 🗄️ DYNAMIC BACKEND DATA (Admin Panel Ready)
  // ==========================================
  const footerData = {
    logoName: "Nazmus.",
    developerName: "Md Nazmus Shakib",
    tagline: "Engineering premium, high-performance web applications and decentralized data solutions.",
    email: "hello@nazmus.dev",
    availability: "Available for new projects",
    location: "Dhaka, Bangladesh • GMT+6",
    navLinks: [
      { name: "Home", url: "/" },
      { name: "About", url: "#about" },
      { name: "Skills", url: "#skills" },
      { name: "Projects", url: "#projects" },
      { name: "Blog", url: "/blog" },
      { name: "Contact", url: "/contact" },
    ],
    services: [
      { name: "MERN Stack Engineering", url: "#skills" },
      { name: "Multi-Tenant SaaS Architecture", url: "#skills" },
      { name: "Custom WordPress & Headless CMS", url: "#skills" },
      { name: "Secure API & Webhook Integration", url: "#skills" },
    ],
    socialLinks: [
      { name: "GitHub", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "Twitter", url: "#" },
      { name: "StackOverflow", url: "#" },
    ]
  };

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#fafafa] dark:bg-[#030303] border-t border-gray-200/60 dark:border-gray-800/60 overflow-hidden pt-28 pb-12 transition-colors duration-1000">
      
      {/* Structural Background Accents */}
      <div className="absolute bottom-[-20%] left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/5 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[85rem] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* ================= TOP SECTION: BIG CTA ================= */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 pb-20 border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="max-w-3xl">
            {/* Live Availability Status */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
              </span>
              <span className="text-gray-600 dark:text-gray-400 uppercase tracking-wider">{footerData.availability}</span>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black dark:text-white leading-[1.15]"
            >
              Let's execute something <br />
              <span className="text-gray-400 dark:text-gray-500">extraordinary together.</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="shrink-0 w-full lg:w-auto"
          >
            <Link href="/contact" className="group relative inline-flex items-center justify-center w-full lg:w-40 h-14 lg:h-40 bg-black dark:bg-white text-white dark:text-black rounded-full lg:rounded-full text-sm font-semibold hover:scale-[1.02] lg:hover:scale-105 transition-transform duration-500 shadow-xl">
              <span className="relative z-10 flex items-center gap-2">
                Get in Touch <ArrowUpRight className="w-4 h-4 lg:hidden" />
              </span>
              <div className="absolute inset-0 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out z-0 hidden lg:block"></div>
            </Link>
          </motion.div>
        </div>

        {/* ================= MIDDLE SECTION: 4-COLUMN SOLID GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 py-20">
          
          {/* Column 1: Brand & Identity (Spans 4 cols) */}
          <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-5">
            <Link href="/" className="font-extrabold text-2xl tracking-tighter text-black dark:text-white flex items-center gap-2.5 group w-fit">
              <span className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Code2 className="w-4 h-4" />
              </span>
              {footerData.logoName}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
              {footerData.tagline}
            </p>
            <a href={`mailto:${footerData.email}`} className="text-lg font-semibold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit mt-3 border-b border-current pb-0.5">
              {footerData.email}
            </a>
          </div>

          {/* Column 2: Navigation Links (Spans 2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-4 md:pl-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase mb-2 font-bold">Index</h4>
            {footerData.navLinks.map((link, idx) => (
              <Link key={idx} href={link.url} className="text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit relative group">
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Column 3: Services/Expertise (Spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase mb-2 font-bold">Capabilities</h4>
            {footerData.services.map((service, idx) => (
              <Link key={idx} href={service.url} className="text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit relative group leading-snug">
                {service.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Column 4: Social Infrastructure (Spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase mb-2 font-bold">Syndicate</h4>
            {footerData.socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 border-b border-gray-200/40 dark:border-gray-800/40 pb-2 w-full max-w-[200px]">
                {link.name} 
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>
            ))}
          </div>

        </div>

        {/* ================= BOTTOM SECTION: METRICS & LEGAL ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200/80 dark:border-gray-800/80 gap-6 text-xs text-gray-500 dark:text-gray-500 font-medium">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8">
            <p>© {currentYear} {footerData.developerName}.</p>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 opacity-60" />
              <span>{footerData.location}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 opacity-60" />
              <span>Encrypted Connection</span>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2.5 text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Scroll to Top 
            <span className="p-2 bg-white border border-gray-200 dark:bg-[#111] dark:border-gray-800 rounded-full group-hover:-translate-y-0.5 transition-transform duration-300 text-black dark:text-white shadow-sm">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

      </div>
    </footer>
  );
}