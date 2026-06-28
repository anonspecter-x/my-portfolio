import { MongoClient } from "mongodb";
import SkillsClient from "./SkillsClient";
import { Zap } from "lucide-react";

export const dynamic = "force-dynamic";

// 📌 Fetch Skills Data
async function getSkills() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  try {
    const db = client.db();
    const skills = await db.collection("skills").find({}).sort({ percentage: -1 }).toArray();
    
    return skills.map(skill => ({
      _id: skill._id.toString(),
      name: String(skill.name || ""),
      subtitle: String(skill.subtitle || ""),
      percentage: Number(skill.percentage || 0),
      icon: String(skill.icon || "Atom")
    }));
  } finally {
    await client.close();
  }
}

// 📌 Fetch Services/Experience Data
async function getServices() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  try {
    const db = client.db();
    const services = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray();
    
    return services.map(service => ({
      _id: service._id.toString(),
      title: String(service.title || ""),
      description: String(service.description || ""),
      image: String(service.image || "")
    }));
  } finally {
    await client.close();
  }
}

// 📌 Fetch Trusted Brands Data
async function getBrands() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  try {
    const db = client.db();
    const brands = await db.collection("brands").find({}).sort({ order: 1 }).toArray();
    
    return brands.map(brand => ({
      _id: brand._id.toString(),
      name: String(brand.name || ""),
      logo: String(brand.logo || ""),
      order: Number(brand.order || 0)
    }));
  } finally {
    await client.close();
  }
}

// 📌 NEW: Fetch Footer Icons Data
async function getFooterIcons() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  try {
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    // ডাটাবেস থেকে footerIcons অ্যারে বের করে আনছি
    return settings?.footerIcons || [];
  } finally {
    await client.close();
  }
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const services = await getServices();
  const brands = await getBrands();
  const footerIcons = await getFooterIcons(); // 📌 ফেচ করা হলো

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-blue-500" /> Skills, Experience & Brands
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your technical skills, experience dropdowns, and trusted brand logos for the homepage.
        </p>
      </div>

      {/* Client Component */}
      <SkillsClient 
        skills={skills} 
        services={services} 
        brands={brands} 
        footerIcons={footerIcons} // 📌 প্রপস হিসেবে পাস করা হলো
      />
    </div>
  );
}