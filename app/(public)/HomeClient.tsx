"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowRight, Mail, FileText, Code2, PenTool, Layout, LayoutTemplate, MessageSquare, X, Send, Bot, Database, Server, ChevronRight } from "lucide-react";
import Link from "next/link";

// ==========================================
// 🗄️ SEO-OPTIMIZED BACKEND DATA
// ==========================================
const siteData = {
  developer: {
    firstName: "Nazmus Shakib",
    fullName: "Md Nazmus Shakib",
    role: "Senior Full Stack MERN Developer",
    experience: "4+ years",
  },
  hero: {
    greeting: "Hello, I'm",
    headlinePart1: "Building Scalable Web Applications & ",
    highlight1: "Premium Digital Experiences.",
    description: "Specializing in the MERN stack and Next.js, I engineer high-performance, SEO-optimized, and secure web solutions for modern businesses and visionary brands.",
  },
  about: {
    description: "With over 4 years of professional experience, I bridge the gap between elegant user interfaces and robust backend architectures. From multi-tenant SaaS platforms to dynamic corporate systems, my focus is always on writing clean code, optimizing web performance, and delivering measurable business value.",
  },
  skills: {
    description: "Leveraging modern technologies to build secure, scalable, and lightning-fast applications.",
    categories: [
      { title: "Frontend Engineering", icon: <Layout className="w-5 h-5" />, details: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion. Focused on responsive, accessible, and interactive UI/UX." },
      { title: "Backend Architecture", icon: <Server className="w-5 h-5" />, details: "Node.js, Express.js, RESTful APIs, JWT Authentication, Serverless Functions, and secure payment integrations." },
      { title: "Database Administration", icon: <Database className="w-5 h-5" />, details: "MongoDB, PostgreSQL, Mongoose, Prisma. Designing complex relational and NoSQL schemas for large-scale data." },
      { title: "CMS & Optimization", icon: <LayoutTemplate className="w-5 h-5" />, details: "Custom WordPress Development, Headless CMS architecture, SEO optimization, and web core vitals enhancement." },
    ]
  },
  social: [
    { name: "GitHub", url: "#", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { name: "LinkedIn", url: "#", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
    { name: "Twitter", url: "#", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg> },
  ]
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.div initial={false} animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }} className="origin-bottom-left absolute bottom-16 left-0 w-[300px] sm:w-[350px] bg-white dark:bg-[#0a0a0a] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Bot className="w-4 h-4" /> Nexus AI
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="h-64 p-5 flex flex-col gap-4 overflow-y-auto bg-gray-50/50 dark:bg-[#050505]/50">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 p-3.5 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed text-gray-700 dark:text-gray-300 shadow-sm w-fit max-w-[90%]">
            Hello! I am {siteData.developer.firstName}'s AI assistant. Ask me anything about his technical stack, availability, or project details.
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-gray-200/80 dark:border-gray-800/80 flex items-center gap-2">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 bg-gray-100 dark:bg-[#111] text-xs px-4 py-3 rounded-full outline-none focus:ring-1 focus:ring-blue-500/50 dark:text-white" />
          <button className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-full hover:scale-105 transition-transform"><Send className="w-3.5 h-3.5 ml-0.5" /></button>
        </div>
      </motion.div>

      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform hover:shadow-blue-500/20">
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
}

// 🚀 PROPS INTERFACE FOR REAL PROJECTS
interface HomeClientProps {
  realProjects: {
    id: string;
    title: string;
    description: string;
    tech: string[];
    link: string;
  }[];
}

export default function HomeClient({ realProjects }: HomeClientProps) {
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const rotateBackground = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] transition-colors duration-1000 ease-in-out selection:bg-blue-500/30 font-sans">
      
      {/* 🌟 Elegant Minimal Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_40%,transparent_110%)]"></div>
        <motion.div style={{ y: yBackground, rotate: rotateBackground }} className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-[100px] md:blur-[140px] transition-all duration-1000"></motion.div>
      </div>

      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12 pt-32 md:pt-48 pb-20 relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <motion.section style={{ opacity: opacityHero, scale: scaleHero }} className="min-h-[80vh] flex flex-col justify-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl relative">
            
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-blue-600 dark:bg-blue-500"></div>
              <p className="text-sm md:text-base font-semibold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                {siteData.hero.greeting} {siteData.developer.firstName}
              </p>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-[5.5rem] font-semibold tracking-tight leading-[1.1] mb-10 text-black dark:text-white">
              {siteData.hero.headlinePart1}
              <span className="text-gray-500 dark:text-gray-400 block mt-2">
                {siteData.hero.highlight1}
              </span>
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16 md:mt-28">
              <motion.div variants={fadeUp} className="col-span-1 lg:col-span-7 flex flex-col items-start gap-8">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-base md:text-lg max-w-xl">
                  {siteData.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                  <button className="group relative px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto flex justify-center text-sm">
                    <span className="relative z-10 flex items-center gap-2">
                      Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </button>
                  <Link href="#about" className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                    Discover More <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="hidden lg:flex col-span-5 items-end justify-end">
                <div className="flex flex-col gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {siteData.social.map((item, idx) => (
                    <Link key={idx} href={item.url} className="group flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <span className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors">
                        {item.icon}
                      </span>
                      <span className="tracking-wide">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* ================= ABOUT SECTION ================= */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-24 md:py-40 border-t border-gray-200/50 dark:border-gray-800/50" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div variants={fadeUp} className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-semibold mb-8 tracking-tight">
                Engineering <span className="text-gray-400 dark:text-gray-500">the future of web.</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                {siteData.about.description}
              </p>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-medium text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-full sm:w-auto">
                <FileText className="w-4 h-4" /> Download Resume
              </button>
            </motion.div>
            
            <motion.div variants={fadeUp} className="order-1 lg:order-2 relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-[#050505] border border-gray-800 p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               <div className="flex items-center justify-between z-10 border-b border-gray-800 pb-4 mb-4">
                 <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                 </div>
                 <p className="font-mono text-[10px] md:text-xs text-gray-600 uppercase tracking-widest">Admin DB Request</p>
               </div>
               
               <div className="flex-1 z-10 font-mono text-[11px] md:text-[13px] leading-loose text-gray-400">
                  <span className="text-pink-500/90">import</span> {"{"} getProfile {"}"} <span className="text-pink-500/90">from</span> <span className="text-green-400/90">'@/lib/db'</span>;<br/><br/>
                  <span className="text-pink-500/90">const</span> <span className="text-blue-400/90">developer</span> <span className="text-pink-500/90">=</span> <span className="text-blue-400/90">await</span> <span className="text-yellow-200/90">getProfile</span>();<br/><br/>
                  <span className="text-gray-600">{"// Admin panel will dynamically inject"}</span><br/>
                  <span className="text-gray-600">{"// high-res image here."}</span><br/>
                  <span className="text-blue-400/90">console</span>.<span className="text-yellow-200/90">log</span>(<span className="text-green-400/90">"Status: Perfect"</span>);
               </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ================= SKILLS SECTION ================= */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-24 md:py-40 border-t border-gray-200/50 dark:border-gray-800/50" id="skills">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
            <motion.div variants={fadeUp} className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight">Core Expertise</h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {siteData.skills.description}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteData.skills.categories.map((skill, idx) => (
                <motion.div key={idx} variants={fadeUp} className="group border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 md:p-8 bg-white/50 dark:bg-[#0a0a0a]/50 hover:bg-white dark:hover:bg-[#111] transition-all duration-300 cursor-default">
                  <div className="w-10 h-10 mb-6 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center text-black dark:text-white group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-lg md:text-xl tracking-tight mb-3">{skill.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {skill.details}
                  </p>
                </motion.div>
              ))}
          </div>
        </motion.section>

        {/* ================= DYNAMIC PROJECTS SCROLL SECTION ================= */}
        <motion.section className="py-24 md:py-40 border-t border-gray-200/50 dark:border-gray-800/50" id="projects">
          <div className="mb-16 md:mb-24">
             <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Selected Works</motion.h2>
             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-base text-gray-600 dark:text-gray-400 max-w-xl">
               Real-world applications built with precision. Scroll down to explore the stack.
             </motion.p>
          </div>

          {/* Stacking Container */}
          <div className="relative w-full pb-[10vh]">
             {realProjects.length > 0 ? (
               realProjects.map((project, idx) => (
                 <div 
                   key={project.id} 
                   className="sticky top-[100px] sm:top-[120px] w-full"
                   style={{ top: `calc(100px + ${idx * 24}px)` }}
                 >
                   <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row items-center overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] mb-10 transition-transform duration-500">
                     
                     {/* Left: Project Info */}
                     <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col bg-white dark:bg-[#0a0a0a] z-10">
                        <span className="font-mono text-xs tracking-[0.2em] text-gray-400 mb-4 uppercase">Project {(idx + 1).toString().padStart(2, '0')}</span>
                        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4 text-black dark:text-white">{project.title}</h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                           {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-10">
                           {project.tech.map((t, i) => (
                              <span key={i} className="text-[11px] md:text-xs font-semibold px-3 py-1.5 bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">{t}</span>
                           ))}
                        </div>
                        <Link href={project.link || "#"} className="inline-flex items-center gap-2 font-semibold text-sm text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit group/btn">
                           View Case Study <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                        </Link>
                     </div>

                     {/* Right: Project Image Placeholder */}
                     <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-full min-h-[300px] bg-gray-50 dark:bg-[#111] border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 relative flex items-center justify-center p-8 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-full max-w-sm aspect-video bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg flex items-center justify-center font-mono text-xs text-gray-400 group-hover:scale-105 transition-transform duration-700">
                           [ Project Mockup / Image ]
                        </div>
                     </div>

                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
                 <p className="text-gray-500 dark:text-gray-400">No projects found. Add some projects from the Admin Dashboard!</p>
               </div>
             )}
          </div>
        </motion.section>

      </div>

      <AIChatBot />
    </main>
  );
}