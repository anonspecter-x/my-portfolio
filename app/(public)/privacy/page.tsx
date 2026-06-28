import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meetsakib.com";

  return {
    title: "Privacy Policy | Md Nazmus Shakib",
    description: "Privacy Policy and data handling practices for Md Nazmus Shakib's portfolio and services.",
    alternates: {
      canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
      title: "Privacy Policy | Md Nazmus Shakib",
      description: "Learn how we collect, use, and protect your personal information.",
      url: `${siteUrl}/privacy`,
    }
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}