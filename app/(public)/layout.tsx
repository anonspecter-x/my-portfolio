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
    // কোনো কারণে ডাটাবেজ এরর দিলে এই ডিফল্ট মেটাডাটা দেখাবে
    return {
      title: "Nazmus Shakib | Portfolio",
      description: "Full Stack Web Developer Portfolio",
    };
  }
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
      <AIChatBot />
    </>
  );
}