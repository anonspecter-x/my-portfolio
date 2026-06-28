import { MongoClient } from "mongodb";
import type { Metadata } from "next";
import BrandsClient from "./BrandsClient";

export const revalidate = 60; // ISR - 60s cache

// 📌 স্ট্যাটিক পেজের এসইও এবং ক্যানোনিকাল ট্যাগ
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Trusted Brands & Clients | Md Nazmus Shakib",
    description: "A showcase of the innovative companies, startups, and visionary brands I have collaborated with to build high-performance digital products.",
    keywords: "Clients, Brands, Partners, Web Development Clients, Md Nazmus Shakib Portfolio",
    alternates: {
      canonical: `${siteUrl}/brands`,
    },
    openGraph: {
      title: "Trusted Brands & Clients | Md Nazmus Shakib",
      description: "A showcase of the innovative companies and brands I have collaborated with.",
      url: `${siteUrl}/brands`,
    }
  };
}

async function getBrands() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    // 📌 Admin panel er 'order' onujayi sort kora holo. Order na thakle latest aage ashbe.
    const brands = await db.collection("brands")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
      
    await client.close();
    
    return brands.map(brand => ({
      _id: brand._id.toString(),
      name: brand.name,
      logo: brand.logo,
      website: brand.website || "#", // ওয়েবসাইট লিংক থাকলে যাবে, না থাকলে #
    }));
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return <BrandsClient brands={brands} />;
}