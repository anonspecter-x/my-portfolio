"use client";

import { motion } from "framer-motion";
import { 
  Scale, FileSignature, Briefcase, Copyright, 
  CreditCard, ShieldAlert, Gavel, RefreshCw, 
  CheckCircle2, AlertTriangle, Mail, Code2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TermsClient() {
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
        top: element.offsetTop - 120, // Offset for header
        behavior: "smooth",
      });
    }
  };

  const termsSections = [
    { id: "introduction", title: "1. Agreement to Terms", icon: FileSignature },
    { id: "services", title: "2. Services & Deliverables", icon: Briefcase },
    { id: "client-responsibilities", title: "3. Client Responsibilities", icon: CheckCircle2 },
    { id: "intellectual-property", title: "4. Intellectual Property", icon: Copyright },
    { id: "payments", title: "5. Payment & Billing", icon: CreditCard },
    { id: "liability", title: "6. Limitation of Liability", icon: ShieldAlert },
    { id: "termination", title: "7. Project Termination", icon: Gavel },
    { id: "updates", title: "8. Terms Modifications", icon: RefreshCw },
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto">
      
      {/* 🎨 Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[-10%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[-10%] w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full"
        />
      </div>

      {/* 🌟 Header */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mb-16 md:mb-24 relative z-10">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400 shadow-sm">
          <Scale className="w-3.5 h-3.5" /> Legal Document — Updated: June 2026
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          Terms of <span className="text-gray-400">Service.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">
          Please read these terms and conditions carefully before using my services or collaborating on digital projects.
        </motion.p>
      </motion.div>

      {/* 🌟 Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* 📌 Left Side: Sticky Table of Contents */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block lg:col-span-4 sticky top-32 self-start"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Table of Contents</h3>
            <ul className="space-y-1 relative">
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-800 -z-10"></div>
              
              {termsSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left group ${
                        isActive
                          ? "bg-gray-50 dark:bg-[#111] text-black dark:text-white border border-gray-200 dark:border-gray-800 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111] hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-white dark:bg-black border border-gray-200 dark:border-gray-800" : "bg-transparent"}`}>
                        <section.icon className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                      </div>
                      {section.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* 📌 Right Side: Terms Detailed Content */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-8 space-y-8 md:space-y-10 pb-20"
        >
          
          {/* Section 1 */}
          <motion.section variants={fadeUp} id="introduction" className="scroll-mt-32">
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <FileSignature className="w-5 h-5 text-blue-500" />
                 1. Agreement to Terms
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("Client" or "User"), and <strong>Md Nazmus Shakib</strong> ("Developer", "I", "me", or "my"), concerning your access to and use of the <a href="https://meetsakib.com" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-semibold transition-colors">meetsakib.com</a> website as well as any related software development services.
                </p>
                <p>
                  By accessing the site or initiating a project, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the site or services.
                </p>
               </div>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={fadeUp} id="services" className="scroll-mt-32">
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <Briefcase className="w-5 h-5 text-blue-500" />
                 2. Services & Deliverables
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    I provide professional Full-Stack Web Development, System Architecture, and Technical Consultation services. The specific scope of work, deliverables, timeline, and pricing will be explicitly detailed in a separate <strong>Project Proposal</strong> or <strong>Statement of Work (SOW)</strong> before development begins.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 marker:text-gray-300 dark:marker:text-gray-700 mt-4">
                    <li><strong className="text-black dark:text-white">Scope Creep:</strong> Any requests outside the agreed-upon SOW will be treated as additional work and may incur extra charges and extended deadlines.</li>
                    <li><strong className="text-black dark:text-white">Third-Party Services:</strong> Integration of third-party APIs (Stripe, AWS, Vercel, etc.) does not guarantee their continuous uptime, as I do not control these external platforms.</li>
                  </ul>
               </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={fadeUp} id="client-responsibilities" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-blue-500" />
                 3. Client Responsibilities
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>For a project to be completed successfully and on time, client cooperation is mandatory. You agree to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-[#111] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                    <strong className="block text-black dark:text-white mb-1.5 text-sm">Timely Assets</strong>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provide all necessary content, images, API keys, and server access required for development within the agreed timeframe.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#111] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                    <strong className="block text-black dark:text-white mb-1.5 text-sm">Prompt Feedback</strong>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Review deliverables and provide constructive feedback or approvals within 48-72 hours to prevent project delays.</p>
                  </div>
                </div>
                <p className="text-xs italic text-gray-500 mt-2">Note: Delays on the client's end will automatically push back the final delivery deadline.</p>
               </div>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={fadeUp} id="intellectual-property" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <Copyright className="w-5 h-5 text-blue-500" />
                 4. Intellectual Property
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
                    <Code2 className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                    <p className="text-sm font-medium text-black dark:text-white">Upon full and final payment, the copyright and ownership of the final codebase, designs, and deliverables are fully transferred to the Client.</p>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 marker:text-gray-300 dark:marker:text-gray-700">
                    <li><strong className="text-black dark:text-white">Portfolio Rights:</strong> Unless secured by a strict NDA, I reserve the right to display the completed project (screenshots, links, case studies) in my portfolio and marketing materials.</li>
                    <li><strong className="text-black dark:text-white">Open Source Code:</strong> Projects may utilize open-source libraries (MIT, Apache licenses). The client agrees to abide by the respective licenses of those included frameworks.</li>
                  </ul>
               </div>
             </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={fadeUp} id="payments" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <CreditCard className="w-5 h-5 text-blue-500" />
                 5. Payment & Billing
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    All payment terms will be specified in the project proposal. Standard billing practices generally follow these rules:
                  </p>
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-800/60 my-4"></div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p><strong>Initial Deposit:</strong> A non-refundable upfront deposit (usually 30% - 50%) is required to reserve time in my schedule and begin development.</p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p><strong>Milestone Payments:</strong> Large projects may be broken into distinct milestones, billed upon completion of each phase.</p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p><strong>Final Handover:</strong> The remaining balance must be cleared before the project is deployed to production or source code is handed over.</p>
                    </li>
                  </ul>
               </div>
             </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section variants={fadeUp} id="liability" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <ShieldAlert className="w-5 h-5 text-blue-500" />
                 6. Limitation of Liability
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    While I strive to write highly optimized, secure, and bug-free code, software development is inherently complex. 
                  </p>
                  <p>
                    I do not warrant that the deliverables will be 100% error-free in perpetuity. I shall not be held liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses resulting from server outages, third-party API changes, or unauthorized access/hacks after the handover.
                  </p>
               </div>
             </div>
          </motion.section>

          {/* Section 7 */}
          <motion.section variants={fadeUp} id="termination" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <Gavel className="w-5 h-5 text-blue-500" />
                 7. Project Termination
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    Either party may terminate the project given proper written notice.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 marker:text-gray-300 dark:marker:text-gray-700">
                    <li>If the <strong>Client</strong> terminates the project prior to completion, the initial deposit is forfeited, and the Client will be billed for the pro-rated hours of work completed up to the termination date.</li>
                    <li>If the <strong>Developer</strong> terminates the project due to unforeseen circumstances, the Client will receive the current work-in-progress codebase and a refund of any unused portion of the deposit.</li>
                  </ul>
               </div>
             </div>
          </motion.section>

          {/* Section 8 */}
          <motion.section variants={fadeUp} id="updates" className="scroll-mt-32">
             <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-10 rounded-[2rem] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500 flex flex-col h-full">
               <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
                 <RefreshCw className="w-5 h-5 text-blue-500" />
                 8. Terms Modifications
               </h2>
               <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                  <p>
                    I reserve the right, at my sole discretion, to modify or replace these Terms at any time. Any changes will be effective immediately upon posting to the website.
                  </p>
                  <p>
                    By continuing to access or use my services after those revisions become effective, you agree to be bound by the revised terms.
                  </p>

                  <div className="mt-6 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 font-medium">
                      <strong className="text-black dark:text-white">Note:</strong> For custom enterprise projects, specific master service agreements (MSA) signed by both parties will supersede these general web terms.
                    </p>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                 <p className="mb-4 text-sm font-bold text-black dark:text-white">Ready to start a project under these terms?</p>
                 <Link href="/contact" className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                   <Mail className="w-4 h-4" /> Discuss a Project
                 </Link>
               </div>
             </div>
          </motion.section>

        </motion.div>
      </div>

    </main>
  );
}