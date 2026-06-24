import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";

// 📌 ডাটাবেজ থেকে ডায়নামিক SEO সেটিংস আনার ফাংশন
export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();

    return {
      title: settings?.seoTitle || "Nazmus Shakib | Portfolio",
      description: settings?.seoDescription || "Full Stack Web Developer Portfolio",
      keywords: settings?.seoKeywords || "Next.js, Developer, MERN, Bangladesh",
    };
  } catch (error) {
    return {
      title: "Nazmus Shakib | Portfolio",
      description: "Full Stack Web Developer Portfolio",
    };
  }
}

// 📌 Header এর জন্য গ্লোবাল ডাটা (Logo ও Music Tracks) ফেচ করা
async function getGlobalData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    const rawTracks = await db.collection("tracks").find({}).sort({ createdAt: -1 }).toArray();
    
    await client.close();

    // 🚀 TypeScript Build Error Fix: ডাটাগুলো এক্সাক্ট প্রপার্টি অনুযায়ী ম্যাপ করা হলো
    const formattedTracks = rawTracks.map((t) => ({
      _id: t._id.toString(),
      title: t.title || "Unknown Track",
      artist: t.artist || "Unknown Artist",
      cover: t.cover || "",
      audioUrl: t.audioUrl || "",
    }));

    return {
      settings: settings ? { 
        developerName: settings.developerName || "", 
        siteLogo: settings.siteLogo || "" 
      } : null,
      tracks: formattedTracks
    };
  } catch (error) {
    console.error("Failed to fetch global data:", error);
    return { settings: null, tracks: [] };
  }
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings, tracks } = await getGlobalData();

  return (
    <>
      {/* 📌 Header এ settings এবং tracks প্রপস হিসেবে পাঠানো হলো */}
      <Header settings={settings} tracks={tracks} />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
      <AIChatBot />
    </>
  );
}