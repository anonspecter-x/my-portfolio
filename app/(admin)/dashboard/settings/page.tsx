import { MongoClient } from "mongodb";
import { updateSettings, addMusicTrack, deleteMusicTrack } from "./actions";
import { 
  Settings2, Save, User, Search, Image as ImageIcon, Music, Trash2, Plus, Share2 
} from "lucide-react";
import { SettingsType } from "@/models/Settings";

// TypeScript Interface for Music Track
interface TrackType {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

// ==========================================
// 📌 CUSTOM SVG ICONS FOR SOCIAL BRANDS
// ==========================================
const FacebookIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const GithubIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const WhatsappIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;


async function getSettingsPageData() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  const settings = await db.collection("settings").findOne({});
  const tracks = await db.collection("tracks").find({}).sort({ createdAt: -1 }).toArray();
  
  await client.close();
  
  return {
    settings: settings ? ({ ...settings, _id: settings._id.toString() } as any) : null,
    tracks: tracks.map(t => ({ ...t, _id: t._id.toString() })) as TrackType[]
  };
}

export default async function SettingsPage() {
  const { settings, tracks } = await getSettingsPageData();

  // 📌 Social Platforms Data Array (Ordered by Developer Priority)
  const socialPlatforms = [
    { id: "github", label: "GitHub", icon: GithubIcon, placeholder: "https://github.com/..." },
    { id: "linkedin", label: "LinkedIn", icon: LinkedinIcon, placeholder: "https://linkedin.com/in/..." },
    { id: "twitter", label: "Twitter / X", icon: TwitterIcon, placeholder: "https://twitter.com/..." },
    { id: "whatsapp", label: "WhatsApp", icon: WhatsappIcon, placeholder: "https://wa.me/8801..." },
    { id: "youtube", label: "YouTube", icon: YoutubeIcon, placeholder: "https://youtube.com/c/..." },
    { id: "facebook", label: "Facebook", icon: FacebookIcon, placeholder: "https://facebook.com/..." },
    { id: "instagram", label: "Instagram", icon: InstagramIcon, placeholder: "https://instagram.com/..." },
  ];

  return (
    <div className="space-y-12 max-w-5xl pb-16">
      
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-blue-500" /> Global Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal info, SEO data, social networks, and background music tracks.
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

      {/* ================= ⚙️ CORE CONFIGURATION SECTION ================= */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <form action={updateSettings} className="divide-y divide-gray-200 dark:divide-gray-800">
          
          {/* Section 1: Media & Assets */}
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-blue-500" /> Identity Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Developer Photo</label>
                <input type="file" name="developerPhoto" accept="image/*" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30" />
                {settings?.developerPhoto && <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">✓ Current photo is active.</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Site Logo</label>
                <input type="file" name="siteLogo" accept="image/*" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30" />
                {settings?.siteLogo && <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">✓ Current logo is active.</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" /> Personal Details
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

          {/* Section 3: Social Media Links & Visibility Toggle */}
          <div className="p-6 md:p-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-500" /> Social & Networks
              </h2>
              <p className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                Turn the switch ON to show in Footer
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPlatforms.map((social) => {
                const Icon = social.icon;
                const linkFieldName = `social_${social.id}`;
                const visibilityFieldName = `social_${social.id}_visible`;
                
                return (
                  <div key={social.id} className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-4 relative">
                    
                    {/* Header: Icon + Toggle */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-black dark:text-white font-bold text-sm">
                        <Icon className="w-4 h-4 text-blue-500" /> {social.label}
                      </div>
                      
                      {/* Premium Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name={visibilityFieldName} 
                          defaultChecked={settings?.[visibilityFieldName] === "true"} 
                          className="sr-only peer" 
                          value="true"
                        />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    {/* Input Field */}
                    <div>
                      <input 
                        type="url" 
                        name={linkFieldName} 
                        defaultValue={settings?.[linkFieldName] || ""} 
                        placeholder={social.placeholder} 
                        className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 transition-colors" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: SEO Settings */}
          <div className="p-6 md:p-10 space-y-6 bg-gray-50/50 dark:bg-[#050505]/50">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-blue-500" /> SEO & Meta Data
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
          <div className="p-6 md:p-10 flex items-center justify-end bg-gray-100/50 dark:bg-gray-900/20">
            <button type="submit" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-xl">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}