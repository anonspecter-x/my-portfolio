"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Eye, Database, 
  Server, UserCheck, Mail, ArrowRight, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("introduction");

  // 📌 Animation Variants (Matched with your theme)
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
      const scrollPosition = window.scrollY + 200; // Offset for header

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
        top: element.offsetTop - 100, // Offset for fixed header
        behavior: "smooth",
      });
    }
  };

  const policySections = [
    { id: "introduction", title: "1. Introduction", icon: ShieldCheck },
    { id: "information-collection", title: "2. Information We Collect", icon: Database },
    { id: "use-of-data", title: "3. How We Use Your Data", icon: Server },
    { id: "data-protection", title: "4. Data Protection & Security", icon: Lock },
    { id: "third-party", title: "5. Third-Party Services", icon: Eye },
    { id: "your-rights", title: "6. Your Privacy Rights", icon: UserCheck },
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
        className="max-w-4xl mb-16 md:mb-24"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Updated: June 2026
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Privacy <span className="text-gray-400">Policy.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Your privacy is critically important to us. This policy explains how your personal data is collected, used, and protected across our digital infrastructure.
        </motion.p>
      </motion.div>

      {/* 🌟 Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
        
        {/* 📌 Left Side: Sticky Table of Contents (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="hidden lg:block lg:col-span-4 sticky top-32"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Table of Contents</h3>
            <ul className="space-y-2">
              {policySections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                      activeSection === section.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? "text-blue-500" : ""}`} />
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* 📌 Right Side: Policy Content */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-8 space-y-12 md:space-y-16"
        >
          
          {/* Section 1 */}
          <motion.section variants={fadeUp} id="introduction" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><ShieldCheck className="w-5 h-5" /></span>
              1. Introduction
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                Welcome to the digital portfolio and services of <strong>Md Nazmus Shakib</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting any personally identifiable information you may provide us through our website.
              </p>
              <p>
                This Privacy Policy applies to <a href="https://meetsakib.com" className="text-blue-600 dark:text-blue-400 hover:underline">meetsakib.com</a> (hereinafter, "us", "we", or "Website"). We have adopted this privacy policy to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={fadeUp} id="information-collection" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><Database className="w-5 h-5" /></span>
              2. Information We Collect
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 text-sm md:text-base">
              <p>We collect both personally identifiable information and non-personally identifiable information when you interact with our system.</p>
              
              <div>
                <h4 className="font-bold text-black dark:text-white mb-2">A. Information you provide directly:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> <strong>Contact Forms:</strong> Name, email address, and project details submitted via the contact page.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> <strong>Communications:</strong> Any additional information you share when reaching out via email or social platforms.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-black dark:text-white mb-2">B. Automatically collected data:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> <strong>Analytics:</strong> Browser type, IP address, device type, and referring sites to help us understand user behavior.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> <strong>Cookies:</strong> Small data files stored on your device to enhance site navigation and remember your preferences (like Dark Mode).</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={fadeUp} id="use-of-data" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><Server className="w-5 h-5" /></span>
              3. How We Use Your Data
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
              <p>The information we collect is strictly used to improve your experience and facilitate communication regarding potential projects. We use your data to:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <li className="bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <strong className="block text-black dark:text-white mb-1">Respond to Inquiries</strong>
                  To reply to messages sent via the contact form and provide project estimates.
                </li>
                <li className="bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <strong className="block text-black dark:text-white mb-1">Improve Architecture</strong>
                  To analyze web traffic and optimize the speed, layout, and performance of our infrastructure.
                </li>
                <li className="bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <strong className="block text-black dark:text-white mb-1">Maintain Security</strong>
                  To detect and prevent fraudulent activities, spam submissions, or unauthorized access.
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={fadeUp} id="data-protection" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><Lock className="w-5 h-5" /></span>
              4. Data Protection & Security
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                The security of your Personal Information is highly prioritized. We implement commercially acceptable means, including <strong>HTTPS encryption</strong>, strict database sanitization, and secure NoSQL architectures, to protect your personal information.
              </p>
              <p>
                However, remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use enterprise-grade security measures, we cannot guarantee its absolute security.
              </p>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={fadeUp} id="third-party" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><Eye className="w-5 h-5" /></span>
              5. Third-Party Services
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
              </p>
              <p>
                Our website may contain links to external sites (such as GitHub, LinkedIn, or external case studies) that are not operated by us. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites, products, or services.
              </p>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={fadeUp} id="your-rights" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-blue-500 shadow-sm"><UserCheck className="w-5 h-5" /></span>
              6. Your Privacy Rights
            </h2>
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                Depending on your location (e.g., under GDPR or CCPA), you may have certain rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>The right to access, update, or delete the information we have on you.</li>
                <li>The right of rectification (to correct inaccurate data).</li>
                <li>The right to object to our processing of your personal data.</li>
                <li>The right to data portability.</li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="mb-4">If you wish to exercise any of these rights, or if you have any questions about this Privacy Policy, please contact us:</p>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                  <Mail className="w-4 h-4" /> Reach Out via Contact Page
                </Link>
              </div>
            </div>
          </motion.section>

        </motion.div>
      </div>

    </main>
  );
}