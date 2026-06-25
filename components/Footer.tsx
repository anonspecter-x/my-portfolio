import Link from "next/link";
import { MongoClient } from "mongodb";
import { ArrowUpRight, ArrowUp, Code2, Mail, Send, Award, Briefcase, CheckCircle2, Users } from "lucide-react";

// ==========================================
// 📌 CUSTOM SVG ICONS FOR SOCIAL BRANDS
// ==========================================
const GithubIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const FacebookIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const WhatsappIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;

// ==========================================
// 🗄️ FETCH DYNAMIC DATA FROM MONGODB
// ==========================================
async function getFooterData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    const projects = await db.collection("projects").find({}).sort({ createdAt: -1 }).limit(5).toArray();
    const skills = await db.collection("skills").find({}).sort({ percentage: -1 }).limit(16).toArray(); // Fetch top 16 skills for the grid
    
    await client.close();
    return { settings, projects, skills };
  } catch (error) {
    return { settings: null, projects: [], skills: [] };
  }
}

export default async function Footer() {
  const { settings, projects, skills } = await getFooterData();
  const currentYear = new Date().getFullYear();

  // 📌 ডায়নামিক ভ্যালু সেট করা
  const developerName = settings?.developerName || "Md Nazmus Shakib";
  const tagline = settings?.developerRole || "Engineering premium, high-performance web applications and scalable digital solutions.";

  // 📌 সোশ্যাল লিংকস উইথ আইকনস
  const availablePlatforms = [
    { id: "github", name: "GitHub", icon: GithubIcon },
    { id: "linkedin", name: "LinkedIn", icon: LinkedinIcon },
    { id: "twitter", name: "Twitter", icon: TwitterIcon },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsappIcon },
    { id: "youtube", name: "YouTube", icon: YoutubeIcon },
    { id: "facebook", name: "Facebook", icon: FacebookIcon },
    { id: "instagram", name: "Instagram", icon: InstagramIcon },
  ];

  const dynamicSocials = availablePlatforms
    .filter(platform => settings?.[`social_${platform.id}_visible`] === "true" && settings?.[`social_${platform.id}`])
    .map(platform => ({
      name: platform.name,
      url: settings?.[`social_${platform.id}`],
      icon: platform.icon
    }));

  const navLinks = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Contact", url: "/contact" },
  ];

  // 📌 স্ট্যাটস / অ্যাচিভমেন্ট ডেটা (তুমি চাইলে এটাও DB থেকে আনতে পারো)
  const stats = [
    { id: 1, title: "Years Experience", value: "04+", icon: Briefcase },
    { id: 2, title: "Completed Projects", value: "50+", icon: CheckCircle2 },
    { id: 3, title: "Happy Clients", value: "30+", icon: Users },
    { id: 4, title: "Global Awards", value: "05+", icon: Award },
  ];

  return (
    <footer className="bg-[#fafafa] dark:bg-[#030303] pt-12 md:pt-20 pb-6 transition-colors duration-1000 border-t border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden font-sans">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* ================= 1. NEWSLETTER SECTION (COMPACT & PROFESSIONAL) ================= */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-10 mb-16 md:mb-20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="text-center lg:text-left w-full lg:w-1/2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white mb-2">
              Subscribe to my Newsletter
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Get the latest insights on web development, tech trends, and my newest projects directly in your inbox.
            </p>
          </div>
          
          <form className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm md:text-base rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-bold text-sm px-6 py-3.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md">
              Subscribe <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ================= 2. MAIN FOOTER GRID (5 COLUMNS) ================= */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 pb-16">
          
          {/* Column 1: Branding (Takes full width on mobile, 4/12 on Desktop) */}
          <div className="w-full lg:w-4/12 flex flex-col gap-5">
            <Link href="/" className="group w-fit block">
              {settings?.siteLogo ? (
                <img 
                  src={settings.siteLogo} 
                  alt={developerName} 
                  className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <span className="font-extrabold text-2xl md:text-3xl tracking-tight text-black dark:text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <Code2 className="w-4 h-4" />
                  </span>
                  {developerName.split(" ")[0]}.
                </span>
              )}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium max-w-sm">
              {tagline}
            </p>
          </div>

          {/* Column 2 to 5: 2x2 Grid on Mobile, 4 Columns on Desktop */}
          <div className="w-full lg:w-8/12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            
            {/* Column 2: Navigation */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Index</h4>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link, idx) => (
                  <Link key={idx} href={link.url} className="text-[13px] md:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Projects (Dynamic Titles) */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Projects</h4>
              <nav className="flex flex-col gap-3">
                {projects.length > 0 ? (
                  projects.map((project: any) => (
                    <Link key={project._id} href={`/projects/${project._id}`} className="text-[13px] md:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit truncate max-w-[150px] md:max-w-full">
                      {project.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No projects yet.</p>
                )}
              </nav>
            </div>

            {/* Column 4: Tech Skills (Only Icons, Grid 4x4, No Borders) */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Stack</h4>
              {skills.length > 0 ? (
                <div className="grid grid-cols-4 gap-3 w-fit">
                  {skills.map((skill: any) => {
                    const isImageUrl = skill.icon && (skill.icon.startsWith("http") || skill.icon.startsWith("/") || skill.icon.startsWith("data:image"));
                    return (
                      <div key={skill._id} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center group relative cursor-pointer">
                        {isImageUrl ? (
                          <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                        ) : (
                          <Code2 className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        )}
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {skill.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No skills added.</p>
              )}
            </div>

            {/* Column 5: Connect & Contact Button */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Connect</h4>
              
              {/* Header-like Contact Button */}
              <Link href="/contact" className="inline-flex items-center justify-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-xs font-bold hover:scale-[1.04] active:scale-95 transition-all shadow-sm border border-black/10 dark:border-white/10 w-fit mb-2">
                Let's Talk <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </Link>

              {/* Social Links List */}
              <nav className="flex flex-col gap-2.5 mt-1">
                {dynamicSocials.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[13px] md:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit">
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>

          </div>
        </div>

        {/* ================= 3. STATS & ACHIEVEMENTS SECTION (4 Columns) ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-10 md:py-12 border-t border-gray-200/80 dark:border-gray-800/80">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800/60 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center sm:items-start sm:text-left gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight">{stat.value}</h3>
                  <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 4. BOTTOM COPYRIGHT & LINKS ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-8 pb-4 border-t border-gray-200/80 dark:border-gray-800/80 gap-6">
          
          {/* Copyright & Crafted With Love */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm font-medium text-gray-500 text-center sm:text-left">
            <p>&copy; {currentYear} {developerName}.</p>
            <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <p className="flex items-center gap-1.5">
              Crafted with 
              {/* No Emoji SVG Heart */}
              <svg className="w-4 h-4 text-red-500 fill-current animate-pulse" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg> 
              by {developerName.split(" ")[0]}
            </p>
          </div>

          {/* Extra Links (Sitemap, Privacy) & Back To Top */}
          <div className="flex items-center gap-6 md:gap-8">
            <nav className="flex items-center gap-4 text-xs md:text-sm font-semibold text-gray-500">
              <Link href="/sitemap" className="hover:text-black dark:hover:text-white transition-colors">Site Map</Link>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            </nav>

            {/* Back to top button */}
            <a 
              href="#"
              className="group flex items-center gap-2 text-[11px] font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-[#111] px-4 py-2.5 rounded-full shadow-sm"
            >
              TOP 
              <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-[#222] rounded-full group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <ArrowUp className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}