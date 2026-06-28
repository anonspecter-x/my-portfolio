import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: "Privacy Policy & Data Security | Md Nazmus Shakib - Full Stack Developer",
    description: "Privacy Policy of Md Nazmus Shakib, Full Stack Developer. Learn how we securely collect and protect your data in compliance with GDPR & CCPA.",
    keywords: [
      "Privacy Policy",
      "Data Protection",
      "GDPR Compliance",
      "CCPA",
      "Md Nazmus Shakib",
      "Full Stack Developer Portfolio",
      "Software Engineer Privacy",
      "Web Development Services",
      "Data Security"
    ],
    alternates: {
      canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
      title: "Privacy Policy | Md Nazmus Shakib - Developer Portfolio",
      description: "Transparent data handling practices, enterprise-level security measures, and privacy rights for clients and users.",
      url: `${siteUrl}/privacy`,
      siteName: "Md Nazmus Shakib",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`, // আপনার যদি কোনো ডিফল্ট OG ইমেজ থাকে, সেটির লিংক দিন
          width: 1200,
          height: 630,
          alt: "Privacy Policy - Md Nazmus Shakib",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy | Md Nazmus Shakib",
      description: "Learn how your data is secured and processed on my portfolio website.",
      // creator: "@yourtwitterhandle", // আপনার টুইটার হ্যান্ডেল থাকলে আনকমেন্ট করে বসিয়ে দিন
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

export default function PrivacyPage() {
  // 🌟 Google Rich Results / Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | Md Nazmus Shakib",
    "description": "Privacy Policy and data handling practices for Md Nazmus Shakib's portfolio and services.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com"}/privacy`,
    "publisher": {
      "@type": "Person",
      "name": "Md Nazmus Shakib",
      "jobTitle": "Senior Full Stack Developer",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com"
    }
  };

  return (
    <>
      {/* Injecting Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyClient />
    </>
  );
}