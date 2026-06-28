import React from "react";
// টেকনোলজি আইকনগুলো SI থেকে
import { 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiJavascript, 
  SiTypescript, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiFirebase, 
  SiFigma, 
  SiGit, 
  SiWordpress,
  // 📌 অন্যান্য আইকনসমূহ
  SiPhp,
  SiLaravel,
  SiPython,
  SiDjango,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiHtml5,
  SiCss, 
  SiSass,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiGraphql,
  SiNestjs,
  SiPrisma,
  SiSupabase,
  SiVercel,
  SiNetlify,
  SiCplusplus,
  SiGo,
  SiRust,
  SiRuby,
  SiRubyonrails,
  SiKubernetes,
  SiLinux
} from "react-icons/si";

// সোশ্যাল মিডিয়া ও অন্যান্য আইকন FA (Font Awesome) থেকে
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaAws,
  FaCode // 📌 Custom কোড আইকনের জন্য যোগ করা হলো
} from "react-icons/fa";

// 📌 C# এর জন্য Tabler Icons ব্যবহার করা হলো (যেহেতু SiCsharp এবং DiCsharp মিসিং)
import { TbBrandCSharp } from "react-icons/tb";

// 📌 প্রতিটি টেকনোলজি এবং সোশ্যাল মিডিয়ার জন্য অফিশিয়াল ব্র্যান্ড আইকন ম্যাপ
export const iconMap: Record<string, React.ReactNode> = {
  // --- Technology Icons ---
  React: <SiReact className="w-5 h-5 shrink-0 text-[#61dafb]" />,
  NextJS: <SiNextdotjs className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  Tailwind: <SiTailwindcss className="w-5 h-5 shrink-0 text-[#38bdf8]" />,
  JavaScript: <SiJavascript className="w-5 h-5 shrink-0 text-[#f7df1e] bg-black rounded-sm" />,
  TypeScript: <SiTypescript className="w-5 h-5 shrink-0 text-[#3178c6] bg-white rounded-sm" />,
  NodeJS: <SiNodedotjs className="w-5 h-5 shrink-0 text-[#339933]" />,
  Express: <SiExpress className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  MongoDB: <SiMongodb className="w-5 h-5 shrink-0 text-[#47A248]" />,
  Firebase: <SiFirebase className="w-5 h-5 shrink-0 text-[#FFCA28]" />,
  Figma: <SiFigma className="w-5 h-5 shrink-0 text-[#F24E1E]" />,
  Git: <SiGit className="w-5 h-5 shrink-0 text-[#F05032]" />,
  WordPress: <SiWordpress className="w-5 h-5 shrink-0 text-[#21759b]" />,

  // --- 📌 New Technology Icons ---
  HTML5: <SiHtml5 className="w-5 h-5 shrink-0 text-[#E34F26]" />,
  CSS3: <SiCss className="w-5 h-5 shrink-0 text-[#1572B6]" />, 
  Sass: <SiSass className="w-5 h-5 shrink-0 text-[#CC6699]" />,
  PHP: <SiPhp className="w-5 h-5 shrink-0 text-[#777BB4]" />,
  Laravel: <SiLaravel className="w-5 h-5 shrink-0 text-[#FF2D20]" />,
  Python: <SiPython className="w-5 h-5 shrink-0 text-[#3776AB]" />,
  Django: <SiDjango className="w-5 h-5 shrink-0 text-[#092E20] dark:text-[#0C4B33]" />,
  VueJS: <SiVuedotjs className="w-5 h-5 shrink-0 text-[#4FC08D]" />,
  Angular: <SiAngular className="w-5 h-5 shrink-0 text-[#DD0031]" />,
  Svelte: <SiSvelte className="w-5 h-5 shrink-0 text-[#FF3E00]" />,
  GraphQL: <SiGraphql className="w-5 h-5 shrink-0 text-[#E10098]" />,
  NestJS: <SiNestjs className="w-5 h-5 shrink-0 text-[#E0234E]" />,
  CPlusPlus: <SiCplusplus className="w-5 h-5 shrink-0 text-[#00599C]" />,
  CSharp: <TbBrandCSharp className="w-5 h-5 shrink-0 text-[#239120]" />, // 📌 Updated to TbBrandCSharp
  Go: <SiGo className="w-5 h-5 shrink-0 text-[#00ADD8]" />,
  Rust: <SiRust className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  Ruby: <SiRuby className="w-5 h-5 shrink-0 text-[#CC342D]" />,
  RubyOnRails: <SiRubyonrails className="w-5 h-5 shrink-0 text-[#CC0000]" />,
  
  // --- Databases & Cloud/DevOps ---
  MySQL: <SiMysql className="w-5 h-5 shrink-0 text-[#4479A1]" />,
  PostgreSQL: <SiPostgresql className="w-5 h-5 shrink-0 text-[#4169E1]" />,
  Redis: <SiRedis className="w-5 h-5 shrink-0 text-[#DC382D]" />,
  Prisma: <SiPrisma className="w-5 h-5 shrink-0 text-[#2D3748] dark:text-white" />,
  Supabase: <SiSupabase className="w-5 h-5 shrink-0 text-[#3ECF8E]" />,
  Docker: <SiDocker className="w-5 h-5 shrink-0 text-[#2496ED]" />,
  Kubernetes: <SiKubernetes className="w-5 h-5 shrink-0 text-[#326CE5]" />,
  AWS: <FaAws className="w-5 h-5 shrink-0 text-[#232F3E] dark:text-white" />, 
  Vercel: <SiVercel className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  Netlify: <SiNetlify className="w-5 h-5 shrink-0 text-[#00C7B7]" />,
  Linux: <SiLinux className="w-5 h-5 shrink-0 text-black dark:text-white" />,

  // --- Social Media Icons ---
  GitHub: <FaGithub className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  LinkedIn: <FaLinkedin className="w-5 h-5 shrink-0 text-[#0A66C2]" />,
  Twitter: <FaTwitter className="w-5 h-5 shrink-0 text-[#1DA1F2]" />, 
  WhatsApp: <FaWhatsapp className="w-5 h-5 shrink-0 text-[#25D366]" />,
  YouTube: <FaYoutube className="w-5 h-5 shrink-0 text-[#FF0000]" />,
  Facebook: <FaFacebook className="w-5 h-5 shrink-0 text-[#1877F2]" />,
  Instagram: <FaInstagram className="w-5 h-5 shrink-0 text-[#E4405F]" />,
  
  // --- 📌 Custom Icon ---
  Custom: <FaCode className="w-5 h-5 shrink-0 text-gray-600 dark:text-gray-400" />
};