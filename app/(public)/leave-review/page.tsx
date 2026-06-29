import LeaveReviewClient from "./LeaveReviewClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave a Review | Md Nazmus Shakib",
  description: "Share your experience working with Md Nazmus Shakib.",
};

export default function LeaveReviewPage() {
  // 📌 .env.local থেকে পাবলিক কী (Site Key) রিসিভ করা
  // লক্ষ্য রাখবেন: এটি SITE_KEY, SECRET_KEY ক্লায়েন্টে পাঠানো যাবে না।
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;

  return (
    <LeaveReviewClient turnstileSiteKey={turnstileSiteKey} />
  );
}