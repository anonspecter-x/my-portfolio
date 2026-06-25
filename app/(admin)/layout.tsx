import "../globals.css";
import { signOut } from "@/auth";
import Link from "next/link";
import { Code2, LogOut } from "lucide-react";
import AdminNav from "./AdminNav"; // 👈 নতুন নেভিগেশন কম্পোনেন্ট ইমপোর্ট করা হলো

export const metadata = {
  title: "Admin Dashboard | Nazmus",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#030303] text-black dark:text-white font-sans overflow-hidden">
      
      {/* 📌 Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm z-10">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tight flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-full group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            Admin<span className="text-gray-400">Panel</span>
          </Link>
        </div>

        {/* 📌 Navigation Links (Client Component) */}
        <AdminNav />

        {/* 📌 Logout Button (Server Action) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 font-bold text-sm py-3.5 rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-red-100 dark:border-red-900/30 shadow-sm">
              <LogOut className="w-4 h-4" /> Secure Logout
            </button>
          </form>
        </div>
      </aside>

      {/* 📌 Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 dark:from-blue-900/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}