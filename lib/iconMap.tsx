import React from "react";
// টেকনোলজি আইকনগুলো SI থেকে (কারণ এগুলো স্টেবল আছে)
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
  SiWordpress 
} from "react-icons/si";

// সোশ্যাল মিডিয়া আইকনগুলো FA (Font Awesome) থেকে (যাতে বিল্ড এরর না দেয়)
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaFacebook,
  FaInstagram
} from "react-icons/fa";

// 📌 প্রতিটি টেকনোলজি এবং সোশ্যাল মিডিয়ার জন্য অফিশিয়াল ব্র্যান্ড আইকন ম্যাপ
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
  GitHub: <FaGithub className="w-5 h-5 shrink-0 text-black dark:text-white" />,
  LinkedIn: <FaLinkedin className="w-5 h-5 shrink-0 text-[#0A66C2]" />,
  Twitter: <FaTwitter className="w-5 h-5 shrink-0 text-[#1DA1F2]" />, 
  WhatsApp: <FaWhatsapp className="w-5 h-5 shrink-0 text-[#25D366]" />,
  YouTube: <FaYoutube className="w-5 h-5 shrink-0 text-[#FF0000]" />,
  Facebook: <FaFacebook className="w-5 h-5 shrink-0 text-[#1877F2]" />,
  Instagram: <FaInstagram className="w-5 h-5 shrink-0 text-[#E4405F]" />
};