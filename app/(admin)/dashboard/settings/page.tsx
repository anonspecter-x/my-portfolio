import { MongoClient } from "mongodb";
import { updateSettings, addMusicTrack, deleteMusicTrack } from "./actions";
import { Settings2, Save, User, Search, Image as ImageIcon, Music, Trash2, Plus } from "lucide-react";
import { SettingsType } from "@/models/Settings";

// TypeScript Interface for Music Track
interface TrackType {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

async function getSettingsPageData() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  const settings = await db.collection("settings").findOne({});
  const tracks = await db.collection("tracks").find({}).sort({ createdAt: -1 }).toArray();
  
  await client.close();
  
  return {
    settings: settings ? ({ ...settings, _id: settings._id.toString() } as SettingsType) : null,
    tracks: tracks.map(t => ({ ...t, _id: t._id.toString() })) as TrackType[]
  };
}

export default async function SettingsPage() {
  const { settings, tracks } = await getSettingsPageData();

  return (
    <div className="space-y-12 max-w-4xl pb-16">
      
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-blue-500" /> Global Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal info, SEO data, and background music tracks.
        </p>
      </div>

      {/* ================= 🎵 MUSIC TRACKS MANAGEMENT SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form to Upload Music */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-blue-500" /> Upload New Track
          </h2>
          <form action={addMusicTrack} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Track Title</label>
              <input type="text" name="title" required placeholder="e.g. Lofi Chill Vibes" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Artist Name</label>
              <input type="text" name="artist" required placeholder="e.g. Synthwave Beats" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Cover Image (Optional)</label>
              <input type="file" name="cover" accept="image/*" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs rounded-xl px-4 py-2 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Audio File (MP3)</label>
              <input type="file" name="audio" accept="audio/mp3,audio/*" required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs rounded-xl px-4 py-2 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/20" />
            </div>
            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 mt-2 shadow-sm">
              <Music className="w-3.5 h-3.5" /> Upload Audio Track
            </button>
          </form>
        </div>

        {/* Live Tracks List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
            <Music className="w-5 h-5 text-gray-400" /> Live Tracks ({tracks.length})
          </h2>
          
          {tracks.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500">No tracks uploaded yet. Use the left panel to add music.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[360px] overflow-y-auto pr-1">
              {tracks.map((track) => (
                <div key={track._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 group">
                  <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-xl object-cover border border-gray-150 dark:border-gray-800" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-black dark:text-white truncate">{track.title}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{track.artist}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteMusicTrack(track._id);
                  }}>
                    <button type="submit" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-100/50 dark:border-red-900/30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= ⚙️ PROFILE & SEO CORE CONFIGURATION SECTION ================= */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <form action={updateSettings} className="divide-y divide-gray-200 dark:divide-gray-800">
          
          {/* Section 1: Media & Assets */}
          <div className="p-8 space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-400" /> Identity Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Developer Photo</label>
                <input type="file" name="developerPhoto" accept="image/*" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30" />
                {settings?.developerPhoto && <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">✓ Current photo is uploaded and active.</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Site Logo</label>
                <input type="file" name="siteLogo" accept="image/*" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30" />
                {settings?.siteLogo && <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">✓ Current logo is uploaded and active.</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
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

          {/* Section 3: SEO Settings */}
          <div className="p-8 space-y-6 bg-gray-50/50 dark:bg-[#050505]/50">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-400" /> SEO & Meta Data
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Website Meta Title</label>
                <input type="text" name="seoTitle" defaultValue={settings?.seoTitle} required className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meta Keywords (Comma separated)</label>
                <input type="text" name="seoKeywords" defaultValue={settings?.seoKeywords} required className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meta Description</label>
                <textarea name="seoDescription" defaultValue={settings?.seoDescription} required rows={3} className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Save Info Button */}
          <div className="p-6 flex items-center justify-end bg-gray-100/50 dark:bg-gray-900/20">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm">
              <Save className="w-4 h-4" /> Save General Core Info
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}