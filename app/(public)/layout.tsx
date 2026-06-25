import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";

// 📌 ডাটাবেজ থেকে ডায়নামিক SEO সেটিংস আনার ফাংশন
export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();

    // এনভায়রনমেন্ট ভ্যারিয়েবল থেকে সাইটের বেস URL নেওয়া, ব্যাকআপ হিসেবে ফলব্যাক ডোমেইন
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
    
    const title = settings?.seoTitle || "Nazmus Shakib | Portfolio";
    const description = settings?.seoDescription || "Full Stack Web Developer Portfolio";
    const keywords = settings?.seoKeywords || "Next.js, Developer, MERN, Bangladesh";
    const authorName = settings?.developerName || "Md Nazmus Shakib";
    const ogImage = settings?.developerPhoto || "/og-image.png";

    return {
      metadataBase: new URL(siteUrl),
      title: title,
      description: description,
      keywords: keywords,
      authors: [{ name: authorName }],
      publisher: authorName,
      
      // 🤖 রোবটস ক্রলার কন্ট্রোল (সার্চ ইঞ্জিনের জন্য অপ্টিমাইজড)
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

      // 🌐 ওপেন গ্রাফ
      openGraph: {
        title: title,
        description: description,
        url: siteUrl,
        siteName: title,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: authorName,
          },
        ],
        locale: "en_US",
        type: "website",
      },

      // 🐦 টুইটার / X কার্ড সেটিংস
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Nazmus Shakib | Portfolio",
      description: "Full Stack Web Developer Portfolio",
      robots: { index: true, follow: true },
    };
  }
}

// 📌 Header এর জন্য গ্লোবাল ডাটা (Logo ও Music Tracks) ফেচ করা
async function getGlobalData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settingsData = await db.collection("settings").findOne({});
    const rawTracks = await db.collection("tracks").find({}).sort({ createdAt: -1 }).toArray();
    
    await client.close();

    const formattedTracks = rawTracks.map((t) => ({
      _id: t._id.toString(),
      title: t.title || "Unknown Track",
      artist: t.artist || "Unknown Artist",
      cover: t.cover || "",
      audioUrl: t.audioUrl || "",
    }));

    // ✅ FIXED: পুরো settings অবজেক্ট পাস করা হচ্ছে, শুধু ২টা ফিল্ড নয়
    const formattedSettings = settingsData ? {
      ...settingsData,
      _id: settingsData._id.toString(),
    } : null;

    return {
      settings: formattedSettings,
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