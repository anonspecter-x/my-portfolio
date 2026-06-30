import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MongoClient } from "mongodb";
import NextTopLoader from "nextjs-toploader"; // 📌 প্যাকেজটি ইমপোর্ট করা হলো
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 📌 ডাটাবেজ থেকে গ্লোবাল সেটিংস (Favicon) আনার ফাংশন
async function getGlobalSettings() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();
    return settings;
  } catch (error) {
    console.error("Failed to fetch settings for layout:", error);
    return null;
  }
}

// 📌 স্ট্যাটিক মেটাডাটার বদলে ডাইনামিক মেটাডাটা জেনারেট করা হচ্ছে
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  
  // ডাটাবেজে ফেভিকন থাকলে সেটি নেবে, না থাকলে ডিফল্ট /favicon.ico নেবে
  const faviconUrl = settings?.siteFavicon || "/favicon.ico"; 

  return {
    metadataBase: new URL(
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://nazmus.dev"
    ),
    title: "Md Nazmus Shakib | Full Stack MERN Developer",
    description: "Professional Web Developer Portfolio",
    // 📌 ফেভিকন ইন্টিগ্রেশন
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl, 
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-[#fafafa] dark:bg-[#030303] text-black dark:text-white transition-colors duration-500`}>
        
        {/* 📌 প্রফেশনাল গ্লোবাল টপ লোডার */}
        <NextTopLoader
          color="#2563eb" // আপনার প্রোজেক্টের blue-600 থিমের সাথে মিল রেখে
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} // ডানপাশের স্পিনার অফ করা হয়েছে ক্লিন লুকের জন্য
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb" // সুন্দর গ্লো ইফেক্ট
          zIndex={1600}
          showAtBottom={false}
        />
        
        {children}
      </body>
    </html>
  );
}