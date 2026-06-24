import { auth } from "@/auth";
import { MongoClient } from "mongodb";
import { Briefcase, MessageSquare, FileText, ArrowUpRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

// 🗄️ MongoDB সরাসরি কানেকশন ফাংশন (Real-time Counts)
async function getDatabaseStats() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // আপনার ডাটাবেজের কালেকশন নাম অনুযায়ী এগুলো কাউন্ট হবে (কালেকশন না থাকলে ০ দেখাবে)
    const [projectsCount, messagesCount, blogsCount] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("messages").countDocuments(),
      db.collection("blogs").countDocuments(),
    ]);

    await client.close();

    return { projectsCount, messagesCount, blogsCount };
  } catch (error) {
    console.error("Database connection error in dashboard:", error);
    // ডাটাবেজ কানেক্ট না হলে সেফ সাইড হিসেবে আপাতত ০ দেখাবে, ক্র্যাশ করবে না
    return { projectsCount: 0, messagesCount: 0, blogsCount: 0 };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  
  // ডাটাবেজ থেকে রিয়েল-টাইম অরিজিনাল ডাটা আনা হচ্ছে
  const stats = await getDatabaseStats();

  return (
    <div className="space-y-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Command Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Logged in securely as: <span className="font-semibold text-blue-600 dark:text-blue-400">{session?.user?.email}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50 rounded-xl text-xs font-semibold w-fit">
          <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500 animate-pulse"></span>
          System Operational
        </div>
      </div>

      {/* 📊 ORIGINAL DATA METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Projects */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 dark:bg-[#111] rounded-xl text-black dark:text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <Link href="/dashboard/projects" className="text-xs font-semibold text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Live Projects</p>
          <h3 className="text-4xl font-bold tracking-tight mt-1 text-black dark:text-white">
            {stats.projectsCount}
          </h3>
        </div>

        {/* Card 2: Messages */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 dark:bg-[#111] rounded-xl text-black dark:text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <Link href="/dashboard/messages" className="text-xs font-semibold text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
              Inbox <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Enquiries</p>
          <h3 className="text-4xl font-bold tracking-tight mt-1 text-black dark:text-white">
            {stats.messagesCount}
          </h3>
        </div>

        {/* Card 3: Blogs */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 dark:bg-[#111] rounded-xl text-black dark:text-white">
              <FileText className="w-5 h-5" />
            </div>
            <Link href="/dashboard/blog" className="text-xs font-semibold text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
              Articles <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published Posts</p>
          <h3 className="text-4xl font-bold tracking-tight mt-1 text-black dark:text-white">
            {stats.blogsCount}
          </h3>
        </div>

      </div>

      {/* Security Info Notice */}
      <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Database synchronization is dynamic. Adding, editing, or deleting entries within dedicated modules will instantly refresh these metrics. Ensure your cluster connections are whitelisted for production builds.
        </p>
      </div>

    </div>
  );
}