"use client";

import { motion } from "framer-motion";
import { 
  Terminal, Code2, Cpu, Rocket, ArrowRight, 
  Database, Layers, Activity, MonitorSmartphone, 
  Zap, GitPullRequest, Settings, Server, ShieldCheck,
  Globe, Braces
} from "lucide-react";
import Link from "next/link";

export default function AboutClient() {
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
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* ================= 1. THE GRAND HERO & MY PHOTO SECTION ================= */}
      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={stagger} 
        className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20 items-center mb-32 md:mb-48"
      >
        <div className="xl:col-span-7 flex flex-col justify-center">
          
          {/* 📌 Header Badge (w-fit যুক্ত করা হয়েছে) */}
          <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
            <Terminal className="w-3.5 h-3.5" /> Engineer. Architect. Creator.
          </motion.div>
          
          {/* 📌 Hero Title */}
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
            Engineering scalable <br className="hidden md:block" />
            <span className="text-gray-400">realities</span> and systems.
          </motion.h1>
          
          {/* 📌 Hero Description */}
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mb-10">
            Hi, I'm <strong className="text-black dark:text-white">Md Nazmus Shakib</strong>. A Senior Full-Stack Developer obsessed with crafting digital ecosystems that balance stunning aesthetics with absolute, uncompromising performance.
          </motion.p>

          {/* 📌 Stats */}
          <motion.div variants={fadeUp} className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-black dark:text-white">6+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Years Coding</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-black dark:text-white">10k+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Commits Pushed</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-4xl font-black text-black dark:text-white">∞</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Lines to Write</span>
            </div>
          </motion.div>
        </div>

        {/* 📸 MY PHOTO CONTAINER */}
        <motion.div variants={fadeUp} className="xl:col-span-5 relative perspective-1000">
          <div className="relative aspect-[4/5] sm:aspect-square xl:aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-2xl group transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
            
            <img 
              src="https://cdn.meetsakib.com/settings/1782304953143-780461696.png" 
              alt="Md Nazmus Shakib" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
            
            <div className="absolute bottom-10 left-10 right-10 z-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest">System Online</span>
              </div>
              <p className="text-white font-bold text-xl leading-snug">
                "Code is the closest thing we have to magic."
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= 2. THE ENGINEERING MANIFESTO (আগের ডিজাইন ফিরিয়ে দেওয়া হলো) ================= */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={stagger} 
        className="mb-32 md:mb-48 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 md:p-20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Braces className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <motion.h2 variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
            The Developer Manifesto
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tight leading-snug mb-10">
            I refuse to build software that merely "works". It must be intuitive, resilient, and blazingly fast.
          </motion.h3>
          <motion.div variants={fadeUp} className="prose prose-lg dark:prose-invert prose-p:text-gray-300 dark:prose-p:text-gray-700 leading-relaxed max-w-none">
            <p>
              In an era where attention spans are measured in milliseconds, bloated code and sluggish interfaces are unacceptable. I approach software engineering as an art form built strictly on logic. 
            </p>
            <p>
              Every API endpoint I design, every component I structure, and every database query I write is scrutinized for maximum efficiency. I believe in writing code that tells a story to the next developer who reads it—clean, documented, and modular.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= 3. THE EVOLUTION ================= */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={stagger} 
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-32 md:mb-48"
      >
        <motion.div variants={fadeUp} className="lg:col-span-4 sticky top-32">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">
            The Evolution.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            How a curiosity for the web turned into an obsession with scalable architecture and system design.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-8 space-y-12">
          <div className="relative pl-8 md:pl-12 border-l border-gray-200 dark:border-gray-800 space-y-16">
            
            <div className="relative">
              <div className="absolute -left-[37px] md:-left-[53px] top-1 w-5 h-5 rounded-full border-4 border-[#fafafa] dark:border-[#030303] bg-blue-500"></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">The Spark & The Front-End</h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 tracking-widest uppercase">The Beginning</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                My journey didn't start with complex MERN stacks. It began with the raw fundamentals: HTML, CSS, and Vanilla JavaScript. I spent countless hours manipulating the DOM, understanding browser rendering engines, and learning how to make elements dance on a screen. This foundational period taught me empathy for the end-user. If the UI isn't flawless, the backend doesn't matter.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[37px] md:-left-[53px] top-1 w-5 h-5 rounded-full border-4 border-[#fafafa] dark:border-[#030303] bg-purple-500"></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Diving into the Deep End (Backend & APIs)</h3>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-4 tracking-widest uppercase">The Shift</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Making things look good wasn't enough; I needed to make them <em>think</em>. I transitioned into Node.js and Express. Building RESTful APIs opened up a new world. I learned the hard way about rate limiting, JWT authentication, server-side validation, and how a poorly written loop can crash a server. This is where I fell in love with server logic.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[37px] md:-left-[53px] top-1 w-5 h-5 rounded-full border-4 border-[#fafafa] dark:border-[#030303] bg-green-500"></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Mastering Data & Architecture</h3>
              <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-4 tracking-widest uppercase">The Present</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Today, my focus is on the big picture. I engineer sophisticated multi-tenant SaaS platforms where data isolation, high-level security, and complex subscription architectures are paramount. I optimize MongoDB indexing for speed, manage WebSocket lifecycles for real-time chat (like my BokBok project), and deploy using modern CI/CD pipelines. I don't just write code; I design systems that scale.
              </p>
            </div>

          </div>
        </motion.div>
      </motion.section>

      {/* ================= 4. THE TECH ECOSYSTEM ================= */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={stagger} 
        className="mb-32 md:mb-48"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">
            My Tech Ecosystem
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400">
            A carefully curated stack of tools that allows me to build fast, secure, and highly maintainable software.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Layers,
              title: "Client-Side Architecture",
              desc: "React & Next.js form my core frontend stack. I utilize Server Components, Framer Motion for fluid UX, and Tailwind CSS for utility-first, highly responsive design systems without the CSS bloat."
            },
            {
              icon: Server,
              title: "Server & Microservices",
              desc: "Node.js and Express.js run my backends. I architect RESTful APIs, integrate real-time Socket.io streams, and handle complex file streams and third-party webhook integrations securely."
            },
            {
              icon: Database,
              title: "Data Engineering",
              desc: "MongoDB is my weapon of choice. From complex aggregation pipelines to TTL indexes for ephemeral data, I design NoSQL schemas that are deeply normalized for performance and read/write speed."
            },
            {
              icon: ShieldCheck,
              title: "Security & Auth",
              desc: "Security is never an afterthought. I implement robust JWT access/refresh token flows, bcrypt hashing, CORS policies, rate limiting, and strict input sanitization to protect user data."
            },
            {
              icon: Globe,
              title: "SEO & Web Vitals",
              desc: "A great app must be discoverable. I leverage Next.js SSR/SSG, dynamic meta tagging (Helmet/Metadata API), and optimize Core Web Vitals to ensure 99+ Lighthouse scores."
            },
            {
              icon: GitPullRequest,
              title: "DevOps & Workflow",
              desc: "Git is second nature. I utilize Vercel and custom VPS setups for deployment, heavily relying on CI/CD workflows, ESLint strictly typed environments, and environment variable isolation."
            }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeUp} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center mb-6 text-black dark:text-white">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= 5. HARDWARE & SANDBOXES ================= */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={stagger} 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-[3rem] p-10 md:p-16 mb-32"
      >
        <motion.div variants={fadeUp} className="space-y-6 order-2 lg:order-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 mb-2 border border-orange-200 dark:border-orange-800/30">
            <Cpu className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Hardware & Sandboxes
          </h2>
          <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              My obsession with performance doesn't stop at the code editor. I am deeply passionate about custom PC hardware. Whether I'm tweaking motherboard configurations or optimizing integrated graphics memory to squeeze out maximum frame rates for heavy workloads, I thrive on pushing systems to their absolute physical limits.
            </p>
            <p>
              Before a single line of code reaches production, it runs the gauntlet. I frequently explore advanced virtual environments, Docker containers, and mobile sandboxes to test applications under strictly isolated conditions. <strong>My code breaks on my machine, so it never breaks on yours.</strong>
            </p>
          </div>
        </motion.div>
        
        <motion.div variants={fadeUp} className="order-1 lg:order-2 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-800">
               <div className="w-full h-full bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] flex items-center justify-center">
                 <Settings className="w-12 h-12 text-gray-400" />
               </div>
            </div>
            <div className="aspect-[4/3] bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-6 flex flex-col justify-end border border-blue-100 dark:border-blue-900/30">
              <MonitorSmartphone className="w-8 h-8 text-blue-500 mb-4" />
              <p className="font-bold text-sm text-blue-900 dark:text-blue-300">Environment Testing</p>
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <div className="aspect-[4/3] bg-purple-50 dark:bg-purple-950/20 rounded-3xl p-6 flex flex-col justify-end border border-purple-100 dark:border-purple-900/30">
              <Activity className="w-8 h-8 text-purple-500 mb-4" />
              <p className="font-bold text-sm text-purple-900 dark:text-purple-300">System Tuning</p>
            </div>
            <div className="aspect-square bg-gray-200 dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-800">
               <div className="w-full h-full bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] flex items-center justify-center">
                 <Terminal className="w-12 h-12 text-gray-400" />
               </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= 6. FINAL CTA SECTION ================= */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={stagger} 
        className="text-center pb-12 border-t border-gray-200 dark:border-gray-800 pt-24"
      >
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-8">
          Ready to build something <span className="text-gray-400">extraordinary?</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Whether it's a high-performance web app, a complex SaaS backend, or a realtime chat system—I'm always open to discussing new architectural challenges.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg">
            Let's Collaborate <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/projects" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-300 dark:border-gray-700 text-black dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-[#111] transition-colors">
            Explore My Work
          </Link>
        </motion.div>
      </motion.section>

    </main>
  );
}