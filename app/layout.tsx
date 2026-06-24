import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://nazmus.dev"
  ),
  title: "Md Nazmus Shakib | Full Stack MERN Developer",
  description: "Professional Web Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning data-scroll-behavior="smooth">
      {/* <body> থেকে <Header /> এবং <Footer /> কেটে ফেলা হয়েছে */}
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-[#fafafa] dark:bg-[#030303] text-black dark:text-white transition-colors duration-500`}>
        {children}
      </body>
    </html>
  );
}