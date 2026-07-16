import { MongoClient } from "mongodb";
import CertificatesClient from "./CertificatesClient";
import { Metadata } from "next";

// 📌 ডাইনামিক এসইও (SEO) মেটাডাটা
export const metadata: Metadata = {
  title: "Professional Credentials | Certificates",
  description: "Explore my verified academic achievements, professional certifications, and technical credentials.",
  openGraph: {
    title: "Professional Credentials | Certificates",
    description: "Explore my verified academic achievements, professional certifications, and technical credentials.",
    type: "website",
  },
};

// 📌 ISR: প্রতি ৬০ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে ক্যাশ আপডেট হবে
export const revalidate = 60;

interface CertificateType {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
}

// 📌 ডাটাবেস থেকে সার্টিফিকেট ফেচ করার ফাংশন
async function getPublicCertificates() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // যেহেতু Date ফিল্ড নেই, তাই _id (যা অটো-টাইমস্ট্যাম্প ধরে রাখে) অনুযায়ী সর্ট করা হলো
    const rawCertificates = await db.collection("certificates")
      .find({})
      .sort({ _id: -1 })
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

  return <CertificatesClient certificates={certificates} />;
}