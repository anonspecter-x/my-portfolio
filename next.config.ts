import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // আপনার যদি আগে থেকে অন্য কোনো কনফিগারেশন থাকে, সেগুলো এভাবেই থাকবে
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 👈 এখানে লিমিট বাড়িয়ে 10 MB করে দেওয়া হলো
    },
  },
};

export default nextConfig;