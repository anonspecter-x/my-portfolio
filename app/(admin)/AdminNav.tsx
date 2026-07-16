"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Zap, 
  BookOpen, 
  MessageSquareQuote,
  Award // 📌 Certificates er jonno notun icon
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  // 📌 Sab menu item er list
  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Skills", href: "/dashboard/skills", icon: Zap },
    { name: "Blog", href: "/dashboard/blog", icon: BookOpen },
    { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquareQuote },
    { name: "Certificates", href: "/dashboard/certificates", icon: Award }, // 📌 Certificates add kora holo
    { name: "Inbox", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
      <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Main Menu</p>
      
      {navLinks.map((link) => {
        const Icon = link.icon;
        // 📌 Active State Logic
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);

        return (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm overflow-hidden ${
              isActive 
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-[#111] hover:text-black dark:hover:text-white"
            }`}
          >
            {/* Active Indicator Line */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            )}
            
            <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`} /> 
            <span className="relative z-10">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}