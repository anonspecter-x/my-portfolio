"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterActiveLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  // চেক করা হচ্ছে কারেন্ট পাথ এই লিংকের সাথে ম্যাচ করে কিনা
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link 
      href={href} 
      className={`text-sm font-semibold transition-colors w-fit ${
        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}