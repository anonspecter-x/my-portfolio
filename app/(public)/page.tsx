import { MongoClient } from "mongodb";
import type { Metadata } from "next"; // 📌 মেটাডাটা টাইপ ইমপোর্ট করা হলো
import HomeClient from "./HomeClient";

// প্রতি ৬০ সেকেন্ডে ডাটা আপডেট হবে (ISR), তাই ওয়েবসাইট সুপারফাস্ট থাকবে
export const revalidate = 60; 

// 📌 ডাটাবেজ থেকে ডায়নামিক সেটিংস নিয়ে হোম পেজের জন্য কাস্টম SEO জেনারেট করা
export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
    const title = settings?.seoTitle || "Nazmus Shakib | Portfolio";
    const description = settings?.seoDescription || "Full Stack Web Developer Portfolio";
    const keywords = settings?.seoKeywords || "Next.js, Developer, MERN, Bangladesh";
    const ogImage = settings?.developerPhoto || "/og-image.png";

    return {
      title: title,
      description: description,
      keywords: keywords,
      alternates: {
        canonical: siteUrl, // হোম পেজের জন্য রুট ক্যানোনিকাল URL
      },
      openGraph: {
        title: title,
        description: description,
        url: siteUrl,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate homepage metadata:", error);
    return {
      title: "Nazmus Shakib | Portfolio",
      description: "Full Stack Web Developer Portfolio",
    };
  }
}

async function getPageData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // ডাটাবেজ থেকে প্রজেক্টগুলো আনা হচ্ছে
    const rawProjects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray();
    
    // 📌 ডাটাবেজ থেকে স্কিলস আনা হচ্ছে
    const rawSkills = await db.collection("skills").find({}).sort({ percentage: -1 }).toArray();

    // 📌 ডাটাবেজ থেকে সার্ভিসেস/এক্সপেরিয়েন্স আনা হচ্ছে
    const rawServices = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray();

    // ডাটাবেজ থেকে সেটিংস আনা হচ্ছে
    const settingsData = await db.collection("settings").findOne({});

    await client.close();

    // প্রজেক্টগুলো ফরম্যাট করা
    const formattedProjects = rawProjects.map((p) => {
      let techArray: string[] = [];
      if (Array.isArray(p.tech)) {
        techArray = p.tech;
      } else if (typeof p.tech === 'string') {
        techArray = p.tech.split(',').map((t: string) => t.trim());
      }

      return {
        id: p._id.toString(),
        title: p.title || "Untitled Project",
        description: p.description || "",
        tech: techArray,
        link: `/projects/${p.slug || p._id}`, 
        image: p.image || null,
      };
    });

    // 📌 স্কিলস ফরম্যাট করা (subtitle সহ)
    const formattedSkills = rawSkills.map(s => ({
      _id: s._id.toString(),
      name: s.name,
      subtitle: s.subtitle || "Technology",
      percentage: s.percentage,
      icon: s.icon
    }));

    // 📌 সার্ভিসেস ফরম্যাট করা
    const formattedServices = rawServices.map(s => ({
      _id: s._id.toString(),
      title: s.title,
      description: s.description,
      image: s.image || ""
    }));

    // 📌 FIXED: পুরো settings অবজেক্টটি পাস করা হলো যাতে Social Links গুলো HomeClient এ পৌঁছায়
    const formattedSettings = settingsData ? {
      ...settingsData,
      _id: settingsData._id.toString(),
    } : null;

    return { 
      projects: formattedProjects, 
      skills: formattedSkills, 
      services: formattedServices,
      settings: formattedSettings 
    };

  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { projects: [], skills: [], services: [], settings: null };
  }
}

export default async function Home() {
  const { projects, skills, services, settings } = await getPageData();

  // ডাটাগুলো ক্লায়েন্ট কম্পোনেন্টে পাস করা হচ্ছে
  return <HomeClient realProjects={projects} realSkills={skills} services={services} settings={settings} />;
}