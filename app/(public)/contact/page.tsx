import { MongoClient } from "mongodb";
import ContactClient from "./ContactClient";
import type { Metadata } from "next"; // 📌 মেটাডাটা ইমপোর্ট করা হলো

export const revalidate = 60; // ISR

// 📌 কন্টাক্ট পেজের জন্য প্রফেশনাল এসইও
export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meetsakib.com";
  
  return {
    title: "Contact & Collaboration | Md Nazmus Shakib",
    description: "Get in touch with Md Nazmus Shakib for web development, technical consultation, or exciting project collaborations. My inbox is always open.",
    keywords: "Contact Web Developer, Hire MERN Developer, Bangladesh Freelance Developer, Contact Next.js Expert",
    alternates: {
      canonical: `${siteUrl}/contact`,
    },
    openGraph: {
      title: "Contact & Collaboration | Md Nazmus Shakib",
      description: "Let's build something extraordinary together. Reach out for collaborations or inquiries.",
      url: `${siteUrl}/contact`,
    }
  };
}

async function getContactData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const settings = await client.db().collection("settings").findOne({});
    await client.close();

    return settings ? {
      email: settings.developerEmail || "hello@nazmus.dev",
      phone: settings.developerPhone || "+880 1XXX XXXXXX",
      region: settings.developerRegion || "Dhaka, Bangladesh",
      socials: {
        github: settings.social_github_visible === "true" ? settings.social_github : null,
        linkedin: settings.social_linkedin_visible === "true" ? settings.social_linkedin : null,
        twitter: settings.social_twitter_visible === "true" ? settings.social_twitter : null,
        whatsapp: settings.social_whatsapp_visible === "true" ? settings.social_whatsapp : null,
      }
    } : null;
  } catch (error) {
    return null;
  }
}

export default async function ContactPage() {
  const data = await getContactData();
  
  return <ContactClient contactData={data} />;
}