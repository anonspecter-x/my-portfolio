"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, MessageSquare, Settings, Zap, BookOpen } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  // 📌 সব মেনু আইটেমের লিস্ট
  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Skills", href: "/dashboard/skills", icon: Zap },
    { name: "Blog", href: "/dashboard/blog", icon: BookOpen },
    { name: "Inbox", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
      <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu</p>
      
      {navLinks.map((link) => {
        const Icon = link.icon;
        // 📌 Active State Logic: ড্যাশবোর্ডের জন্য exact match, বাকিগুলোর জন্য startsWith
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);

        return (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm shadow-sm ${
              isActive 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#111] border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4" /> {link.name}
          </Link>
        );
      })}
    </nav>
  );
}