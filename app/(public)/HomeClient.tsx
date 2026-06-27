"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Code2, Layout, LayoutTemplate, ChevronRight, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 📌 সেন্ট্রালাইজড ব্র্যান্ড আইকন ম্যাপ ইম্পোর্ট করা হলো
import { iconMap } from "@/lib/iconMap";

// ==========================================
// 📌 SOCIAL ICONS (From React Icons FA)
// ==========================================
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaWhatsapp, 
  FaYoutube, 
  FaFacebook, 
  FaInstagram 
} from "react-icons/fa";

// সোশ্যাল আইকন সিস্টেম
const socialPlatformSystem = [
  { id: "github", name: "GitHub", icon: <FaGithub className="w-4 h-4 shrink-0" /> },
  { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin className="w-4 h-4 shrink-0" /> },
  { id: "twitter", name: "Twitter", icon: <FaTwitter className="w-4 h-4 shrink-0" /> },
  { id: "whatsapp", name: "WhatsApp", icon: <FaWhatsapp className="w-4 h-4 shrink-0" /> },
  { id: "youtube", name: "YouTube", icon: <FaYoutube className="w-4 h-4 shrink-0" /> },
  { id: "facebook", name: "Facebook", icon: <FaFacebook className="w-4 h-4 shrink-0" /> },
  { id: "instagram", name: "Instagram", icon: <FaInstagram className="w-4 h-4 shrink-0" /> },
];

const fadeUp: any = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };
const staggerContainer: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

interface HomeClientProps {
  realProjects: any[];
  realSkills: any[];
  services?: any[];
  settings: any; 
}

export default function HomeClient({ realProjects, realSkills, services = [], settings }: HomeClientProps) {
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const rotateBackground = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const fullName = settings?.developerName || "Md Nazmus Shakib";
  const role = settings?.developerRole || "Senior Full Stack MERN Developer";
  const firstName = fullName.split(" ")[0];

  const [activeAccordion, setActiveAccordion] = useState(0);

  const displayProjects = realProjects.slice(0, 4);

  // 📌 DYNAMIC SOCIAL FETCHING SYSTEM
  const activeSocials = socialPlatformSystem
    .filter(platform => 
      settings?.[`social_${platform.id}_visible`] === "true" && settings?.[`social_${platform.id}`]
    )
    .map(platform => ({
      ...platform,
      url: settings?.[`social_${platform.id}`]
    }));

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] transition-colors duration-1000 ease-in-out selection:bg-blue-500/30 font-sans overflow-clip">
      
      {/* 🌟 Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_40%,transparent_110%)]"></div>
        <motion.div style={{ y: yBackground, rotate: rotateBackground }} className="absolute top-[-10%] left-[-10%] w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-[80px] md:blur-[140px] transition-all duration-1000"></motion.div>
      </div>

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-48 pb-16 md:pb-20 relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <motion.section style={{ opacity: opacityHero, scale: scaleHero }} className="min-h-[75vh] md:min-h-[80vh] flex flex-col justify-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl relative">
            
            <motion.div variants={fadeUp} className="flex items-center gap-2.5 md:gap-3 mb-6 md:mb-8">
              <div className="h-[2px] w-6 md:h-px md:w-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
              <p className="text-[11px] sm:text-xs md:text-base font-bold md:font-semibold text-blue-600 dark:text-blue-400 tracking-widest uppercase leading-snug">
                Hello, I'm {fullName} — {role}
              </p>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold md:font-semibold tracking-tight md:tracking-tighter leading-[1.15] md:leading-[1.1] mb-8 md:mb-10 text-black dark:text-white">
              Building Scalable Web Applications & <br className="hidden md:block"/>
              <span className="text-gray-500 dark:text-gray-400 block mt-1 md:mt-2">
                Premium Digital Experiences.
              </span>
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 mt-10 md:mt-20">
              <motion.div variants={fadeUp} className="col-span-1 lg:col-span-7 flex flex-col items-start gap-6 md:gap-8">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-sm md:text-lg max-w-xl text-center sm:text-left w-full sm:w-auto">
                  Specializing in the MERN stack and Next.js, I engineer high-performance, SEO-optimized, and secure web solutions for modern businesses and visionary brands.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <Link href="/contact" className="group relative px-6 md:px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto flex justify-center text-[13px] md:text-sm shadow-md">
                    <span className="relative z-10 flex items-center gap-2">
                      Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </Link>
                  <Link href="/about" className="text-[13px] md:text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 w-full sm:w-auto py-2">
                    Discover More <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="flex flex-row flex-wrap justify-center lg:flex-col gap-3 md:gap-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {/* 📌 SYSTEMATIC DYNAMIC SOCIALS RENDERING */}
                  {activeSocials.map((item, idx) => (
                    <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="group flex items-center gap-2.5 md:gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white/50 dark:bg-[#111]/50 lg:bg-transparent lg:dark:bg-transparent px-3 py-2 lg:p-0 rounded-full lg:rounded-none border border-gray-200/80 dark:border-gray-800/80 lg:border-none">
                      <span className="w-8 h-8 md:w-8 md:h-8 rounded-full border-none lg:border lg:border-solid border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors bg-gray-100 dark:bg-[#222] lg:bg-transparent lg:dark:bg-transparent">
                        {item.icon}
                      </span>
                      <span className="tracking-wide hidden sm:block lg:block">{item.name}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* ================= ABOUT SECTION ================= */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-20 md:py-40 border-t border-gray-200/50 dark:border-gray-800/50" id="about">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div variants={fadeUp} className="order-2 lg:order-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold md:font-semibold mb-6 md:mb-8 tracking-tight">
                Engineering <span className="text-gray-400 dark:text-gray-500">the future of web.</span>
              </h2>
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 md:mb-10">
                With over 4 years of professional experience, I bridge the gap between elegant user interfaces and robust backend architectures. From multi-tenant SaaS platforms to dynamic corporate systems, my focus is always on writing clean code, optimizing web performance, and delivering measurable business value.
              </p>
              <button className="flex items-center justify-center mx-auto lg:mx-0 gap-2 px-6 py-3.5 border border-gray-300 dark:border-gray-700 rounded-full font-semibold md:font-medium text-[13px] md:text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-full sm:w-auto shadow-sm">
                <FileText className="w-4 h-4" /> Download Resume
              </button>
            </motion.div>
            
            <motion.div variants={fadeUp} className="order-1 lg:order-2 relative w-full aspect-[4/3] md:aspect-[4/3] rounded-3xl md:rounded-[2rem] bg-[#050505] border border-gray-800 p-5 md:p-8 shadow-2xl flex flex-col justify-between overflow-hidden group">
               {settings?.developerPhoto ? (
                 <>
                   <img src={settings.developerPhoto} alt={fullName} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                   <div className="flex items-center justify-between z-10 border-b border-white/10 pb-3 md:pb-4 mb-3 md:mb-4 relative">
                     <div className="flex gap-1.5 md:gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                     </div>
                   </div>
                   <div className="relative z-10 mt-auto">
                     <p className="text-white/90 font-mono text-xs sm:text-sm tracking-wide">Hi, I'm {firstName} 👋</p>
                   </div>
                 </>
               ) : (
                 <div className="flex-1 flex items-center justify-center font-mono text-xs text-gray-500">Image goes here</div>
               )}
            </motion.div>
          </div>
        </motion.section>

        {/* ================= SKILLS & EXPERIENCE SECTION ================= */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-20 md:py-32 border-t border-gray-200/50 dark:border-gray-800/50" id="skills">
          
          <div className="text-center mb-16 md:mb-20">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
              Skills And Experience
            </motion.h2>
            <motion.div variants={fadeUp} className="h-1 w-16 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full mb-6"></motion.div>
            <motion.p variants={fadeUp} className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Web developer skilled in MERN stack and Next.js, specializing in dynamic websites and custom solutions.
            </motion.p>
          </div>

          {/* 📌 Accordion & Image */}
          {services.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-28">
              <motion.div variants={fadeUp} className="lg:col-span-7 flex flex-col gap-3">
                {services.map((service, idx) => (
                  <div 
                    key={service._id} 
                    onClick={() => setActiveAccordion(idx)}
                    className={`border rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${activeAccordion === idx ? 'bg-blue-50/50 dark:bg-[#111] border-blue-200 dark:border-gray-700' : 'bg-gray-50/50 dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                  >
                    <div className="flex justify-between items-center p-5 md:p-6">
                      <h3 className="font-bold text-base md:text-lg text-black dark:text-white">{service.title}</h3>
                      {activeAccordion === idx ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                    <AnimatePresence>
                      {activeAccordion === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                          {service.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="lg:col-span-5 h-[250px] sm:h-[350px] lg:h-auto rounded-2xl overflow-hidden relative shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeAccordion}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={services[activeAccordion]?.image} 
                    alt={services[activeAccordion]?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* 📌 Skill Cards (Mobile Sticky Overlap Added) */}
          {realSkills.length > 0 && (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-y-10 gap-x-6 w-full pb-[5vh] md:pb-0">
              {realSkills.map((skill, idx) => {
                const percentage = skill.percentage;
                const totalBlocks = 5;
                
                // আইকন টাইপ ডিটেকশন (Image URL নাকি SVG Key)
                const isImageIcon = skill.icon && (skill.icon.startsWith("http") || skill.icon.startsWith("/") || skill.icon.startsWith("data:image"));
                
                // নাম কেস-সেন্সিটিভ ফিক্সিং (যেমন: react -> React)
                const mappedIconKey = skill.icon ? skill.icon.charAt(0).toUpperCase() + skill.icon.slice(1) : "";

                return (
                  <motion.div 
                    key={skill._id} 
                    variants={fadeUp} 
                    // ডেক্সটপ মোডে relative করে দেওয়া হলো যাতে আইকন না হারায়
                    className="sticky md:relative w-full p-5 md:p-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl transition-colors shadow-lg md:shadow-sm mt-4 mb-[8vh] md:mb-0 z-10"
                    style={{ 
                      // মোবাইলে কার্ডগুলো যেন একটির উপর আরেকটি সাজানো থাকে
                      top: `calc(100px + ${idx * 16}px)` 
                    }}
                  >
                    
                    {/* আইকন কনটেইনারের ব্যাকগ্রাউন্ড নিউট্রাল করা হয়েছে যাতে ব্র্যান্ডের অরিজিনাল রং সুন্দর দেখায় */}
                    <div className="absolute -top-6 -left-2 bg-white dark:bg-[#0a0a0a] p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#151515] border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center p-2">
                         {/* 📌 DYNAMIC BRAND SKILL ICON RENDERING */}
                         {isImageIcon ? (
                           <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                         ) : (
                           iconMap[skill.icon] || iconMap[mappedIconKey] || <Code2 className="w-5 h-5 text-gray-400" />
                         )}
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <h4 className="font-bold text-lg text-black dark:text-white leading-tight mb-1.5">{skill.name}</h4>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{skill.subtitle || "Technology"}</p>
                      </div>

                      <div className="flex gap-1.5 ml-4 shrink-0">
                        {[...Array(totalBlocks)].map((_, i) => {
                          const blockValue = 100 / totalBlocks; 
                          const currentBlockStart = i * blockValue;
                          const currentBlockEnd = (i + 1) * blockValue;
                          
                          let fillPercent = 0;
                          if (percentage >= currentBlockEnd) {
                            fillPercent = 100;
                          } else if (percentage > currentBlockStart && percentage < currentBlockEnd) {
                            fillPercent = ((percentage - currentBlockStart) / blockValue) * 100;
                          }

                          return (
                            <div key={i} className="h-1.5 w-6 sm:w-8 rounded-sm bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                               <div 
                                 className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-sm transition-all duration-1000" 
                                 style={{ width: `${fillPercent}%` }}
                               />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ================= 🚀 REDESIGNED CLEAN PROJECTS SECTION ================= */}
        <motion.section className="py-20 md:py-40 border-t border-gray-200/50 dark:border-gray-800/50" id="projects">
          <div className="mb-16 md:mb-24 text-center md:text-left">
             <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">Selected Works</motion.h2>
             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
               A curated selection of my latest projects. Scroll down to explore.
             </motion.p>
          </div>

          <div className="relative w-full pb-[5vh] md:pb-[10vh]">
             {displayProjects.length > 0 ? (
               displayProjects.map((project, idx) => (
                 <div 
                   key={project.id} 
                   className="sticky w-full"
                   style={{ top: `calc(80px + ${idx * 24}px)` }}
                 >
                   {/* 📌 মূল ডিভটি এখন একটি Link, যেন কার্ডের যেকোনো জায়গায় ক্লিক করা যায় */}
                   <Link 
                     href={project.link || "#"} 
                     className="block w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 dark:border-gray-800 p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] mb-[10vh] md:mb-[15vh] relative group/card hover:scale-[1.01] hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300 cursor-pointer"
                   >
                     <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">
                       {/* 📝 Content Side (Left) */}
                       <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 text-left">
                          <div className="flex items-center gap-3 mb-4 md:mb-6">
                             <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md">
                               Project {(idx + 1).toString().padStart(2, '0')}
                             </span>
                          </div>
                          
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-black dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                             {project.title}
                          </h3>
                          
                          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 md:mb-10 leading-relaxed font-medium line-clamp-3">
                             {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
                             {project.tech.map((t: string, i: number) => (
                                <span key={i} className="text-[10px] md:text-xs font-semibold px-3 py-1.5 bg-gray-100 dark:bg-[#151515] text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800">
                                  {t}
                                </span>
                             ))}
                          </div>
                          
                          {/* 📌 Link কে span দিয়ে রিপ্লেস করা হয়েছে যাতে লিংকের মধ্যে লিংক না থাকে */}
                          <span className="inline-flex items-center justify-center sm:justify-start gap-2 font-bold text-sm text-white dark:text-black bg-black dark:bg-white w-full sm:w-fit px-8 py-3.5 rounded-full group/btn shadow-md">
                             View Case Study <ArrowRight className="w-4 h-4 sm:group-hover/btn:translate-x-1.5 transition-transform" />
                          </span>
                       </div>

                       {/* 🖼️ Image Side (Right) */}
                       <div className="w-full lg:w-1/2 relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-[#111] border border-gray-200/80 dark:border-gray-800/80 order-1 lg:order-2 shrink-0">
                         {project.image ? (
                            <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                         ) : (
                            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center font-mono text-xs text-gray-400">
                              <LayoutTemplate className="w-10 h-10 mb-3 opacity-50" />
                              [ Project Interface ]
                            </div>
                         )}
                         
                         {/* External Link Icon */}
                         <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 dark:bg-black/90 backdrop-blur-md w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 opacity-0 group-hover/card:opacity-100 transition-all translate-y-4 group-hover/card:translate-y-0 duration-500 z-20 shadow-sm">
                           <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-black dark:text-white" />
                         </div>
                       </div>
                     </div>
                   </Link>
                 </div>
               ))
             ) : (
               <div className="text-center py-16 md:py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl md:rounded-2xl mx-4 sm:mx-0">
                 <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No projects found.</p>
               </div>
             )}
          </div>

          {/* 📌 View All Projects Button */}
          {realProjects.length > 0 && (
            <div className="mt-8 flex justify-center w-full relative z-50">
              <Link href="/projects" className="group flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/10">
                View All Case Studies <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          )}
        </motion.section>

      </div>
    </main>
  );
}