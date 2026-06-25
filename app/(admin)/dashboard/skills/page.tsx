import { MongoClient } from "mongodb";
import SkillsClient from "./SkillsClient";
import { Zap } from "lucide-react";

export const dynamic = "force-dynamic";

// 📌 Fetch Skills Data (with new subtitle field)
async function getSkills() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  const skills = await db.collection("skills").find({}).sort({ percentage: -1 }).toArray();
  await client.close();
  
  return skills.map(skill => ({
    _id: skill._id.toString(),
    name: skill.name,
    subtitle: skill.subtitle || "", // 📌 New Field
    percentage: skill.percentage,
    icon: skill.icon
  }));
}

// 📌 Fetch Services/Experience Data
async function getServices() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  const services = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray();
  await client.close();
  
  return services.map(service => ({
    _id: service._id.toString(),
    title: service.title,
    description: service.description,
    image: service.image || ""
  }));
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const services = await getServices(); // 📌 Fetching services

  return (
    <div className="space-y-10 max-w-6xl">
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-blue-500" /> Skills & Experience
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your technical skills and experience dropdowns for the homepage.
        </p>
      </div>

      {/* 📌 Client Component with both Skills and Services */}
      <SkillsClient skills={skills} services={services} />
    </div>
  );
}