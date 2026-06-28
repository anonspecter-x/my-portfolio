"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Eye, Database, 
  Server, UserCheck, Mail, ArrowRight, 
  CheckCircle2, Cookie, RefreshCw, FileText,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("introduction");

  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // 📌 Scroll Spy logic for Sticky Sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      // Offset adjusted for better trigger point
      const scrollPosition = window.scrollY + 200; 

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (sectionId) setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120, // Proper offset for sticky header
        behavior: "smooth",
      });
    }
  };

  const policySections = [
    { id: "introduction", title: "1. Introduction & Scope", icon: FileText },
    { id: "information-collection", title: "2. Information We Collect", icon: Database },
    { id: "use-of-data", title: "3. How We Use Your Data", icon: Server },
    { id: "data-sharing", title: "4. Data Sharing & Disclosure", icon: Eye },
    { id: "data-protection", title: "5. Security & Retention", icon: Lock },
    { id: "your-rights", title: "6. Your Privacy Rights", icon: UserCheck },
    { id: "cookies", title: "7. Cookies & Tracking", icon: Cookie },
    { id: "policy-updates", title: "8. Changes to Policy", icon: RefreshCw },
  ];

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden">
      
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
        className="max-w-4xl mb-16 md:mb-24 relative z-10"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-xs font-semibold mb-6 text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Legal Document — Updated: June 2026
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-400 dark:to-gray-600">Policy & Data Handling.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
          We believe in absolute transparency. This document details exactly what information we collect, why we collect it, and the rigorous protocols we follow to ensure your data remains secure.
        </motion.p>
      </motion.div>

      {/* 🌟 Content Grid Layout */}
      {/* 📌 items-start is CRUCIAL here for the sticky sidebar to work properly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* 📌 Left Side: Sticky Table of Contents */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block lg:col-span-4 sticky top-32 self-start"
        >
          {/* Glassmorphism Sidebar Container */}
          <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-xl dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Table of Contents</h3>
            <ul className="space-y-2 relative">
              {/* Active Indicator Line (Visual Polish) */}
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800 -z-10"></div>
              
              {policySections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left group ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#151515] hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-white/20" : "bg-gray-200 dark:bg-[#222] group-hover:bg-gray-300 dark:group-hover:bg-[#333]"}`}>
                        <section.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      {section.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* 📌 Right Side: Policy Detailed Content */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-8 space-y-12 md:space-y-16 pb-20"
        >
          
          {/* Section 1 */}
          <motion.section variants={fadeUp} id="introduction" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></span>
              1. Introduction & Scope
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p>
                Welcome to the digital portfolio and professional services of <strong>Md Nazmus Shakib</strong> (referred to as "we", "our", "us", or "the Developer"). We deeply respect your privacy and are committed to protecting any personally identifiable information you may provide us through our web platform.
              </p>
              <p>
                This Privacy Policy governs your use of <a href="https://meetsakib.com" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">meetsakib.com</a> (the "Website"). It establishes a legally binding framework explaining what data is collected, the technical and operational methodologies used to process this data, and your rights concerning your personal information. By accessing or using the Website, you explicitly agree to the terms outlined in this policy.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={fadeUp} id="information-collection" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Database className="w-6 h-6" /></span>
              2. Information We Collect
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p className="font-medium">To provide a tailored and high-performance digital experience, we collect specific data points categorized as follows:</p>
              
              <div className="bg-gray-50 dark:bg-[#050505] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h4 className="font-bold text-black dark:text-white mb-4 text-base">A. Data Provided Voluntarily</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" /> 
                    <span><strong>Direct Communications:</strong> When you utilize our contact form or direct email, we securely collect your full name, email address, phone number (if provided), and the context of your project inquiry.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" /> 
                    <span><strong>Interactive AI Features:</strong> Any prompts or queries submitted through the integrated AI ChatBot (Nexus AI) are temporarily processed to generate relevant responses.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-[#050505] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <h4 className="font-bold text-black dark:text-white mb-4 text-base">B. Automated Telemetry & Analytics</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" /> 
                    <span><strong>Device & Network Metrics:</strong> We log non-personally identifying information such as browser type, IP address, timezone setting, and device operating systems (e.g., Windows, macOS, Android).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" /> 
                    <span><strong>Behavioral Data:</strong> Referring/exit pages, timestamps, and page interaction data to help us analyze rendering performance and optimize Core Web Vitals.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={fadeUp} id="use-of-data" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></span>
              3. How We Use Your Data
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p className="font-medium mb-6">Every byte of data collected serves a specific, legitimate business purpose. We do not engage in arbitrary data mining. Your data is used exclusively to:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-black dark:text-white mb-2 text-base font-extrabold">Client Onboarding</strong>
                  <p className="text-sm">Evaluate project requirements, initiate correspondence, and draft technical proposals based on the information provided in contact forms.</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-black dark:text-white mb-2 text-base font-extrabold">System Architecture</strong>
                  <p className="text-sm">Analyze browser rendering times and API response metrics to continually refine the Next.js and MongoDB backend architecture.</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-black dark:text-white mb-2 text-base font-extrabold">Security Protocols</strong>
                  <p className="text-sm">Identify abnormal traffic patterns, prevent brute-force attacks, and deploy rate-limiting algorithms to secure the infrastructure.</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="block text-black dark:text-white mb-2 text-base font-extrabold">Legal Compliance</strong>
                  <p className="text-sm">Maintain records necessary to comply with relevant tax, accounting, and international web governance laws.</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={fadeUp} id="data-sharing" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Eye className="w-6 h-6" /></span>
              4. Data Sharing & Disclosure
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-300 font-semibold flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>We strictly do not sell, rent, or lease your personal information to third-party data brokers under any circumstances.</p>
              </div>
              <p>However, modern web architecture requires interacting with robust third-party services. We may share limited data under the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-3 mt-4 marker:text-blue-500 font-medium">
                <li><strong className="text-black dark:text-white">Cloud Infrastructure Providers:</strong> Vercel, MongoDB Atlas, and AWS for hosting databases and serverless functions securely.</li>
                <li><strong className="text-black dark:text-white">Analytics Partners:</strong> Google Analytics or Vercel Analytics for tracking anonymized traffic data and site performance.</li>
                <li><strong className="text-black dark:text-white">Legal Requirements:</strong> If compelled by subpoena, court order, or other governmental requests to protect our legal rights.</li>
              </ul>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={fadeUp} id="data-protection" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Lock className="w-6 h-6" /></span>
              5. Security & Retention
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p>
                As a Senior Full-Stack Developer, data security is not an afterthought—it is foundational. We employ enterprise-level security measures including <strong className="text-black dark:text-white">TLS 1.3 encryption (HTTPS)</strong>, strict CORS policies, and rigorous server-side input sanitization to thwart XSS and SQL/NoSQL injection attacks.
              </p>
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-4"></div>
              <p>
                <strong className="text-black dark:text-white text-lg block mb-2">Data Retention Policy</strong> We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. Contact form submissions and project details are archived securely for reference unless a deletion request is formally submitted.
              </p>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={fadeUp} id="your-rights" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><UserCheck className="w-6 h-6" /></span>
              6. Your Privacy Rights (GDPR & CCPA)
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p className="mb-4">
                We recognize and respect global privacy regulations including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). You hold the following rights regarding your data:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <li className="flex gap-3 items-start bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 
                  <span className="text-sm"><strong className="block text-black dark:text-white">Right to Access</strong> Request a copy of the data we hold about you.</span>
                </li>
                <li className="flex gap-3 items-start bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 
                  <span className="text-sm"><strong className="block text-black dark:text-white">Right to Rectification</strong> Request correction of inaccurate information.</span>
                </li>
                <li className="flex gap-3 items-start bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 
                  <span className="text-sm"><strong className="block text-black dark:text-white">Right to Erasure</strong> "The right to be forgotten" – complete deletion of data.</span>
                </li>
                <li className="flex gap-3 items-start bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 
                  <span className="text-sm"><strong className="block text-black dark:text-white">Right to Restrict</strong> Request a pause on the processing of your data.</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={fadeUp} id="cookies" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><Cookie className="w-6 h-6" /></span>
              7. Cookies & Tracking Technologies
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p>
                We use cookies and similar tracking technologies to track activity on our Website and store certain functional information.
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-4 marker:text-blue-500 font-medium">
                <li><strong className="text-black dark:text-white">Essential Cookies:</strong> Required for the website to function properly (e.g., remembering your Dark Mode/Light Mode preference).</li>
                <li><strong className="text-black dark:text-white">Analytical Cookies:</strong> Used to track how users navigate the site, allowing us to continuously improve UI/UX design.</li>
              </ul>
              <p className="mt-4 italic opacity-80">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, disabling essential cookies may impact certain UI functionalities.
              </p>
            </div>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={fadeUp} id="policy-updates" className="scroll-mt-32 group">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><RefreshCw className="w-6 h-6" /></span>
              8. Changes to This Policy
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-5 text-sm md:text-base hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <p>
                The tech landscape evolves rapidly, and so do our protocols. We may update this Privacy Policy periodically to reflect changes in our infrastructure, services, or legal obligations.
              </p>
              <p>
                Any updates will be immediately deployed to this page, and the "Updated" date at the top of this document will be revised accordingly. We encourage you to review this Privacy Policy periodically for any changes.
              </p>

              {/* 📌 Added Legal Disclaimer Box */}
              <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 p-5 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                  <strong>Legal Disclaimer:</strong> This privacy policy is provided for informational purposes and transparency. For specific legal advice or compliance concerns regarding your own business, please consult a certified legal professional.
                </p>
              </div>

              {/* 📌 Fixed Full Width Action Button */}
              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="mb-6 font-bold text-black dark:text-white text-center md:text-left text-lg">Have questions regarding this policy?</p>
                
                {/* Changed to w-full strictly */}
                <Link href="/contact" className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-extrabold text-sm uppercase tracking-wider rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/10 dark:shadow-white/10">
                  <Mail className="w-5 h-5" /> Contact Security & Admin
                </Link>
              </div>
            </div>
          </motion.section>

        </motion.div>
      </div>

    </main>
  );
}