import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meetsakib.com";

  return {
    title: "About Me | Md Nazmus Shakib",
    description: "Discover the journey, tech ecosystem, and engineering manifesto of Md Nazmus Shakib, a Senior Full-Stack Developer specializing in MERN and Next.js.",
    alternates: {
      canonical: `${siteUrl}/about`,
    },
    openGraph: {
      title: "About Me | Md Nazmus Shakib",
      description: "Discover the journey, tech ecosystem, and engineering manifesto of Md Nazmus Shakib.",
      url: `${siteUrl}/about`,
    }
  };
}

export default function AboutPage() {
  return <AboutClient />;
}