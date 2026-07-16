import "../globals.css";
import { signOut } from "@/auth";
import Link from "next/link";
import { Code2, LogOut, ShieldCheck } from "lucide-react";
import AdminNav from "./AdminNav";

export const metadata = {
  title: "Admin Dashboard | Nazmus",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#030303] text-black dark:text-white font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* 📌 Sidebar (Premium Styling) */}
      <aside className="w-[280px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200/80 dark:border-white/5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20 relative">
        
        {/* Brand Header */}
        <div className="h-24 flex items-center px-8 border-b border-gray-100 dark:border-white/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-[-50%] left-[-20%] w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>
          
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tight flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black flex items-center justify-center rounded-xl shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-black dark:text-white">Admin<span className="text-blue-600 dark:text-blue-400">Panel</span></span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Secure Area
              </span>
            </div>
          </Link>
        </div>

        {/* 📌 Navigation Links (Client Component) */}
        <AdminNav />

        {/* 📌 Logout Button (Server Action) */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#050505]/50">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-sm py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 dark:border-red-900/50 shadow-sm hover:shadow-red-500/25 group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Secure Logout
            </button>
          </form>
        </div>
      </aside>

      {/* 📌 Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative bg-[#fafafa] dark:bg-[#030303]">
        {/* Top Gradient Blur Effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/80 dark:from-blue-900/10 to-transparent pointer-events-none z-0"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}