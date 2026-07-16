import { MongoClient } from "mongodb";
import CertificatesClient from "./CertificatesClient";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

interface CertificateType {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
}

// ডাটাবেজ থেকে সকল সার্টিফিকেট রিড করার ফাংশন
async function getCertificatesData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const rawCertificates = await db.collection("certificates")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
      
    await client.close();
    
    return rawCertificates.map(c => ({
      ...c,
      _id: c._id.toString()
    })) as CertificateType[];
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return [];
  }
}

export default async function CertificatesAdminPage() {
  const certificates = await getCertificatesData();

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* টপ হেডার সেকশন */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Award className="w-8 h-8 text-blue-500" /> Professional Credentials
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add, edit, or remove your academic and professional certifications without timestamp restrictions.
        </p>
      </div>

      {/* ক্লায়েন্ট ইন্টারফেস রেন্ডার */}
      <CertificatesClient certificates={certificates} />
    </div>
  );
}