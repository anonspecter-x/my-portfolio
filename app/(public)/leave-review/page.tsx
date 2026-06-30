import type { Metadata } from "next";
import LeaveReviewClient from "./LeaveReviewClient";

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: "Leave a Review | Md Nazmus Shakib",
    description: "Share your experience working with Md Nazmus Shakib. Your feedback helps me improve and deliver better digital solutions.",
    keywords: [
      "Leave a Review",
      "Client Feedback",
      "Testimonial",
      "Md Nazmus Shakib",
      "Web Developer Review",
      "Full Stack Developer"
    ],
    alternates: {
      canonical: `${siteUrl}/leave-review`,
    },
    openGraph: {
      title: "Leave a Review | Md Nazmus Shakib",
      description: "Share your experience working with Md Nazmus Shakib. Your feedback helps me improve and deliver better digital solutions.",
      url: `${siteUrl}/leave-review`,
      siteName: "Md Nazmus Shakib Portfolio",
      type: "website",
    }
  };
}

export default function LeaveReviewPage() {
  // 📌 .env.local থেকে পাবলিক কী (Site Key) রিসিভ করা
  // লক্ষ্য রাখবেন: এটি SITE_KEY, SECRET_KEY ক্লায়েন্টে পাঠানো যাবে না।
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;

  return (
    <LeaveReviewClient turnstileSiteKey={turnstileSiteKey} />
  );
}