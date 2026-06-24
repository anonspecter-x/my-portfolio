"use client";

import Link from "next/link";
import { Code2, ArrowUpRight, ArrowUp, Mail, Globe } from "lucide-react";

export default function Footer() {
  // ==========================================
  // 🗄️ DYNAMIC BACKEND DATA (Admin Panel Ready)
  // ==========================================
  const footerData = {
    logoName: "Nazmus.",
    developerName: "Md Nazmus Shakib",
    tagline: "Engineering premium, high-performance web applications and scalable digital solutions.",
    email: "hello@nazmus.dev",
    location: "Dhaka, Bangladesh • GMT+6",
    navLinks: [
      { name: "Home", url: "/" },
      { name: "About", url: "/#about" },
      { name: "Skills", url: "/#skills" },
      { name: "Projects", url: "/#projects" },
    ],
    services: [
      { name: "MERN Stack Dev", url: "/#skills" },
      { name: "SaaS Architecture", url: "/#skills" },
      { name: "API Integration", url: "/#skills" },
      { name: "Web Optimization", url: "/#skills" },
    ],
    socialLinks: [
      { name: "GitHub", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "Twitter", url: "#" },
    ]
  };

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#fafafa] dark:bg-[#050505] border-t border-gray-200/80 dark:border-gray-800/60 pt-16 md:pt-24 pb-8 transition-colors duration-1000">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 md:gap-20 mb-16 md:mb-24">
          
          {/* Left Column: Brand & Direct Contact */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            <Link href="/" className="font-extrabold text-xl tracking-tighter text-black dark:text-white flex items-center gap-2 group w-fit">
              <span className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Code2 className="w-4 h-4" />
              </span>
              {footerData.logoName}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              {footerData.tagline}
            </p>
            <a 
              href={`mailto:${footerData.email}`} 
              className="inline-flex items-center gap-2 text-sm font-bold text-black dark:text-white bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#222] border border-gray-200/50 dark:border-gray-800/50 px-5 py-2.5 rounded-xl w-fit transition-all duration-300"
            >
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {footerData.email}
            </a>
          </div>

          {/* Right Column: Links Grid (Compact on Mobile) */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            
            {/* Nav Links */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-1 font-bold">Index</h4>
              {footerData.navLinks.map((link, idx) => (
                <Link key={idx} href={link.url} className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all duration-300 w-fit">
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Services */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-1 font-bold">Expertise</h4>
              {footerData.services.map((service, idx) => (
                <Link key={idx} href={service.url} className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all duration-300 w-fit">
                  {service.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-1 font-bold">Connect</h4>
              {footerData.socialLinks.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                  {link.name} 
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ================= BOTTOM METRICS ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-200/80 dark:border-gray-800/80 gap-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-500 text-center sm:text-left">
            <p>© {currentYear} {footerData.developerName}.</p>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 opacity-70 text-blue-500" />
              <span>{footerData.location}</span>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            BACK TO TOP 
            <span className="p-1.5 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-md group-hover:-translate-y-1 transition-transform duration-300 text-black dark:text-white shadow-sm">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>

        </div>

      </div>
    </footer>
  );
}