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
      "Full Stack Developer Portfolio",
      "Software Engineer"
    ],
    alternates: {
      canonical: `${siteUrl}/leave-review`,
    },
    openGraph: {
      title: "Leave a Review | Md Nazmus Shakib",
      description: "Share your experience working with Md Nazmus Shakib. Your feedback helps me improve and deliver better digital solutions.",
      url: `${siteUrl}/leave-review`,
      siteName: "Md Nazmus Shakib Portfolio",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`, // আপনার প্রজেক্টের ডিফল্ট OG ইমেজ
          width: 1200,
          height: 630,
          alt: "Leave a Review - Md Nazmus Shakib",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Leave a Review | Md Nazmus Shakib",
      description: "Share your experience working with Md Nazmus Shakib. Your feedback is highly appreciated.",
    },
    robots: {
      index: true, // পেজটি গুগলে ইন্ডেক্স হওয়ার অনুমতি
      follow: true, // পেজের ভেতরের লিংকগুলো ফলো করার অনুমতি
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function LeaveReviewPage() {
  // 📌 .env.local থেকে পাবলিক কী (Site Key) রিসিভ করা
  // লক্ষ্য রাখবেন: এটি SITE_KEY, SECRET_KEY ক্লায়েন্টে পাঠানো যাবে না।
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  // 🌟 Google Rich Results / Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Leave a Review | Md Nazmus Shakib",
    "description": "Form to submit a client review or testimonial for Md Nazmus Shakib.",
    "url": `${siteUrl}/leave-review`,
    "publisher": {
      "@type": "Person",
      "name": "Md Nazmus Shakib",
      "jobTitle": "Senior Full Stack Developer",
      "url": siteUrl
    }
  };

  return (
    <>
      {/* 📌 Injecting Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 📌 Main Client Component */}
      <LeaveReviewClient turnstileSiteKey={turnstileSiteKey} />
    </>
  );
}