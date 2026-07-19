"use client";

import { useEffect } from "react";
import { incrementViewTime } from "./actions";

export default function ViewTimeTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // 📌 প্রতি ৬০,০০০ মিলিসেকেন্ড (১ মিনিট) পর পর কল হবে
    const interval = setInterval(() => {
      incrementViewTime(slug, 1);
    }, 60000);

    // 📌 কম্পোনেন্ট আনমাউন্ট বা পেজ চেঞ্জ হলে ইন্টারভ্যাল ক্লিয়ার করা
    return () => clearInterval(interval);
  }, [slug]);

  return null; // এটি UI-তে কিছু দেখাবে না, সম্পূর্ণ ব্যাকগ্রাউন্ডে কাজ করবে
}