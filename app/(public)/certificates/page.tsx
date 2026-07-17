import { MongoClient } from "mongodb";
import CertificatesClient from "./CertificatesClient";
import type { Metadata } from "next";

export const revalidate = 60; // ISR: 60 seconds

// 📌 ডাইনামিক ও অ্যাডভান্সড এসইও (SEO) মেটাডাটা
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  return {
    title: "Certifications & Credentials | Md Nazmus Shakib",
    description: "Explore my verified academic achievements, professional certifications, and technical credentials from recognized global platforms.",
    keywords: [
      "Web Development Certificates",
      "MERN Stack Credentials",
      "Professional Certifications",
      "Md Nazmus Shakib",
      "Verified Developer Credentials",
      "Software Engineering Certificates"
    ],
    alternates: {
      canonical: `${siteUrl}/certificates`,
    },
    openGraph: {
      title: "Certifications & Credentials | Md Nazmus Shakib",
      description: "Explore my verified academic achievements, professional certifications, and technical credentials.",
      url: `${siteUrl}/certificates`,
      siteName: "Md Nazmus Shakib Portfolio",
      images: [
        {
          url: `${siteUrl}/og-certificates.jpg`, // আপনার প্রজেক্টের ডিফল্ট বা পেজ স্পেসিফিক ইমেজ
          width: 1200,
          height: 630,
          alt: "Professional Certifications - Md Nazmus Shakib",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Certifications & Credentials | Md Nazmus Shakib",
      description: "Explore my verified academic achievements, professional certifications, and technical credentials.",
    },
    robots: {
      index: true, 
      follow: true, 
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

interface CertificateType {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
  certificateId?: string;
}

async function getPublicCertificates() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // আগে অ্যাড করা সার্টিফিকেট আগে দেখানোর জন্য _id অনুযায়ী Ascending (1) সর্ট করা হলো
    const rawCertificates = await db.collection("certificates")
      .find({})
      .sort({ _id: 1 })
      .toArray();
      
    await client.close();
    
    return rawCertificates.map(c => ({
      ...c,
      _id: c._id.toString()
    })) as CertificateType[];
  } catch (error) {
    console.error("Failed to fetch public certificates:", error);
    return [];
  }
}

export default async function PublicCertificatesPage() {
  const certificates = await getPublicCertificates();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

  // 🌟 Google Rich Results / Schema Markup (Certificates Profile)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Md Nazmus Shakib",
      "jobTitle": "Senior Full Stack Developer",
      "url": siteUrl,
      "hasCredential": certificates.map(cert => ({
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Certificate",
        "name": cert.title,
        "recognizedBy": {
          "@type": "Organization",
          "name": cert.issuerName
        }
      }))
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
      <CertificatesClient certificates={certificates} />
    </>
  );
}