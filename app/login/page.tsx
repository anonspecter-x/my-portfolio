import { MongoClient } from "mongodb";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

// 📌 ডাটাবেস থেকে সেটিংস ফেচ করা
async function getSettingsData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    await client.close();
    
    // ডাটা সিরিয়ালাইজ করা
    return settings ? {
      developerName: settings.developerName || "Admin Portal",
      siteLogoLight: settings.siteLogoLight || null,
      siteLogoDark: settings.siteLogoDark || null,
      siteLogo: settings.siteLogo || null,
    } : null;
  } catch (error) {
    console.error("Failed to fetch settings for login page:", error);
    return null;
  }
}

export default async function LoginPage() {
  const settings = await getSettingsData();

  // 📌 Client Component-এ সেটিংস ডেটা পাস করা
  return <LoginClient settings={settings} />;
}