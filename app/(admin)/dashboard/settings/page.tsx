import { MongoClient } from "mongodb";
import { updateSettings } from "./actions";
import { Settings2, Save, User, Globe, Search } from "lucide-react";
import { SettingsType } from "@/models/Settings";

// 📌 ডাটাবেজ থেকে বর্তমান সেটিংস আনার ফাংশন
async function getSettings(): Promise<SettingsType | null> {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  // ডাটাবেজ থেকে প্রথম সেটিংস ডকুমেন্টটি আনবে
  const settings = await db.collection("settings").findOne({});
  await client.close();
  
  if (settings) {
    return { ...settings, _id: settings._id.toString() } as SettingsType;
  }
  return null;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-10 max-w-4xl">
      
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-blue-500" /> Global Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and SEO preferences here.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        
        {/* 📌 Form */}
        <form action={updateSettings} className="divide-y divide-gray-200 dark:divide-gray-800">
          
          {/* Section 1: Personal Information */}
          <div className="p-8 space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-400" /> Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                <input type="text" name="developerName" defaultValue={settings?.developerName} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Professional Role</label>
                <input type="text" name="developerRole" defaultValue={settings?.developerRole} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <input type="email" name="developerEmail" defaultValue={settings?.developerEmail} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                <input type="text" name="developerPhone" defaultValue={settings?.developerPhone} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Region / Address</label>
                <input type="text" name="developerRegion" defaultValue={settings?.developerRegion} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Section 2: SEO Settings */}
          <div className="p-8 space-y-6 bg-gray-50/50 dark:bg-[#050505]/50">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-400" /> SEO & Meta Data
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Website Meta Title</label>
                <input type="text" name="seoTitle" defaultValue={settings?.seoTitle} required placeholder="e.g. Md Nazmus Shakib | Full Stack Developer" className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meta Keywords (Comma separated)</label>
                <input type="text" name="seoKeywords" defaultValue={settings?.seoKeywords} required placeholder="e.g. web developer, next.js, mern stack, bangladesh" className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meta Description</label>
                <textarea name="seoDescription" defaultValue={settings?.seoDescription} required rows={3} placeholder="Brief description of your services for Google Search results..." className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* 📌 Footer / Submit */}
          <div className="p-6 flex items-center justify-end bg-gray-100/50 dark:bg-gray-900/20">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}