import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: "Terms of Service | Md Nazmus Shakib - Full Stack Developer",
    description: "Read the official Terms of Service for hiring and collaborating with Md Nazmus Shakib. Includes project scopes, payment terms, and intellectual property rights.",
    keywords: [
      "Terms of Service",
      "Terms and Conditions",
      "Freelance Developer Contract",
      "Software Development Agreement",
      "Md Nazmus Shakib Terms",
      "Web Development Policies"
    ],
    alternates: {
      canonical: `${siteUrl}/terms`,
    },
    openGraph: {
      title: "Terms of Service | Md Nazmus Shakib",
      description: "Understand the terms, project workflows, and standard service agreements before starting your digital project.",
      url: `${siteUrl}/terms`,
      siteName: "Md Nazmus Shakib",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`, 
          width: 1200,
          height: 630,
          alt: "Terms of Service - Md Nazmus Shakib",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Terms of Service | Md Nazmus Shakib",
      description: "Official service terms and project agreements for web development clients.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsPage() {
  // 🌟 Schema Markup for Legal Pages
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service | Md Nazmus Shakib",
    "description": "Terms and conditions for software development and consultation services provided by Md Nazmus Shakib.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com"}/terms`,
    "publisher": {
      "@type": "Person",
      "name": "Md Nazmus Shakib",
      "jobTitle": "Senior Full Stack Developer",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsClient />
    </>
  );
}