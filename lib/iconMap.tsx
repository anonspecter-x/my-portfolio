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
  SiWordpress 
} from "react-icons/si";

// 📌 Protiti technologier jonno official brand icon map (React Icons Platform theke)
export const iconMap: Record<string, React.ReactNode> = {
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
  WordPress: <SiWordpress className="w-5 h-5 shrink-0 text-[#21759b]" />
};