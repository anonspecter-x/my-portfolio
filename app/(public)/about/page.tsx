import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const revalidate = 60; 

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";

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

async function getAboutData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // 📌 ডাটাবেজ থেকে সার্টিফিকেটগুলো আনা হচ্ছে
    const rawCertificates = await db.collection("certificates")
      .find({})
      .sort({ _id: 1 })
      .toArray();

    await client.close();

    const formattedCertificates = rawCertificates.map(c => ({
      _id: c._id.toString(),
      title: c.title,
      issuerName: c.issuerName,
      issuerLogo: c.issuerLogo || "",
      certificateImage: c.certificateImage || "",
      credentialUrl: c.credentialUrl || "",
      certificateId: c.certificateId || "",
    }));

    return { certificates: formattedCertificates };

  } catch (error) {
    console.error("Failed to fetch about page data:", error);
    return { certificates: [] };
  }
}

export default async function AboutPage() {
  const { certificates } = await getAboutData();
  
  return <AboutClient certificates={certificates} />;
}