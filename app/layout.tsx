import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MongoClient } from "mongodb";
import NextTopLoader from "nextjs-toploader"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  const faviconUrl = settings?.siteFavicon || "/favicon.ico"; 
  const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://nazmus.dev";

  return {
    metadataBase: new URL(baseUrl),
    // 📌 টাইটেল টেমপ্লেট ব্যবহার করা হলো যেন অন্য পেজে ডাইনামিক হয়
    title: {
      default: "Md Nazmus Shakib | Full Stack MERN Developer",
      template: "%s | Md Nazmus Shakib", 
    },
    description: "Professional Web Developer Portfolio",
    // 📌 গ্লোবাল Open Graph যুক্ত করা হলো
    openGraph: {
      title: {
        default: "Md Nazmus Shakib | Full Stack MERN Developer",
        template: "%s | Md Nazmus Shakib",
      },
      description: "Professional Web Developer Portfolio",
      url: baseUrl,
      siteName: "Md Nazmus Shakib Portfolio",
      type: "website",
    },
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
        
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
          zIndex={1600}
          showAtBottom={false}
        />
        
        {children}
      </body>
    </html>
  );
}