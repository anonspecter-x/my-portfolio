import React from "react";
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
  // 📌 Social Media Icons
  SiGithub,
  SiLinkedin,
  SiX,
  SiWhatsapp,
  SiYoutube,
  SiFacebook,
  SiInstagram
} from "react-icons/si";

// 📌 Protiti technology ebong social media-r jonno official brand icon map
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

  // --- Social Media Icons ---
  GitHub: <SiGithub className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  LinkedIn: <SiLinkedin className="w-5 h-5 shrink-0 text-[#0A66C2]" />,
  Twitter: <SiX className="w-5 h-5 shrink-0 text-black dark:text-white" />, // X Logo
  WhatsApp: <SiWhatsapp className="w-5 h-5 shrink-0 text-[#25D366]" />,
  YouTube: <SiYoutube className="w-5 h-5 shrink-0 text-[#FF0000]" />,
  Facebook: <SiFacebook className="w-5 h-5 shrink-0 text-[#1877F2]" />,
  Instagram: <SiInstagram className="w-5 h-5 shrink-0 text-[#E4405F]" />
};