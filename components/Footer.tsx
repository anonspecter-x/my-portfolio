import Link from "next/link";
import { MongoClient } from "mongodb";
import { ArrowUpRight, ArrowUp, Code2, Mail, Send, Award, Briefcase, CheckCircle2, Users } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import FooterActiveLink from "./FooterActiveLink";

// ==========================================
// 🗄️ FETCH DYNAMIC DATA FROM MONGODB
// ==========================================
async function getFooterData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    const projects = await db.collection("projects").find({}).sort({ createdAt: -1 }).limit(5).toArray();
    const skills = await db.collection("skills").find({}).sort({ percentage: -1 }).limit(16).toArray(); 
    
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
  const tagline = settings?.developerRole || "Engineering premium, high-performance web applications.";
  // নতুন ডেসক্রিপশন ফিল্ড (Settings থেকে আসবে, না থাকলে ডিফল্ট)
  const description = settings?.developerDescription || "Specializing in the MERN stack and modern frameworks to engineer secure, SEO-optimized, and scalable digital solutions for visionary brands.";

  // 📌 সোশ্যাল লিংকস উইথ কাস্টম আইকনস
  const availablePlatforms = [
    { id: "github", name: "GitHub" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "twitter", name: "Twitter" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "youtube", name: "YouTube" },
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram" },
  ];

  const dynamicSocials = availablePlatforms
    .filter(platform => settings?.[`social_${platform.id}_visible`] === "true" && settings?.[`social_${platform.id}`])
    .map(platform => ({
      ...platform,
      url: settings?.[`social_${platform.id}`],
    }));

  const navLinks = [
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Contact", url: "/contact" },
  ];

  // 📌 স্ট্যাটস / অ্যাচিভমেন্ট ডেটা
  const stats = [
    { id: 1, title: "Experience", value: "04+", icon: Briefcase },
    { id: 2, title: "Projects", value: "50+", icon: CheckCircle2 },
    { id: 3, title: "Happy Clients", value: "30+", icon: Users },
    { id: 4, title: "Awards", value: "05+", icon: Award },
  ];

  return (
    <footer className="bg-[#fafafa] dark:bg-[#030303] pt-10 pb-6 transition-colors duration-1000 border-t border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden font-sans">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* ================= 1. COMPACT NEWSLETTER ================= */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm group">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Join the Newsletter
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Get insights on web development and my newest projects directly in your inbox.
            </p>
          </div>
          
          <form action="/api/subscribe" method="POST" className="w-full md:w-1/2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-semibold text-sm px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm">
              Subscribe <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ================= 2. GRID SYSTEM ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 pb-12">
          
          {/* Column 1: Branding (Full width on mobile) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="group w-fit block">
              {settings?.siteLogo ? (
                <img 
                  src={settings.siteLogo} 
                  alt={developerName} 
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <span className="font-extrabold text-2xl tracking-tight text-black dark:text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <Code2 className="w-3.5 h-3.5" />
                  </span>
                  {developerName.split(" ")[0]}.
                </span>
              )}
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold leading-tight">
              {tagline}
            </p>
            {/* নতুন ডেসক্রিপশন ফিল্ড */}
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Column 2: Index */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Index</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link, idx) => (
                <FooterActiveLink key={idx} href={link.url}>
                  {link.name}
                </FooterActiveLink>
              ))}
            </nav>
          </div>

          {/* Column 3: Projects */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Projects</h4>
            <nav className="flex flex-col gap-3">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <Link key={project._id} href={`/projects/${project._id}`} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit truncate max-w-full">
                    {project.title}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-500">No projects yet.</p>
              )}
            </nav>
          </div>

          {/* Column 4: Tech Stack (Full width on mobile, max 6 per row, centered last row) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold text-center lg:text-left">Stack</h4>
            {skills.length > 0 ? (
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-3 w-full lg:w-fit px-4 lg:px-0">
                {skills.map((skill: any) => {
                  const mappedIconKey = skill.icon ? skill.icon.charAt(0).toUpperCase() + skill.icon.slice(1) : skill.name;
                  const IconComponent = iconMap[mappedIconKey] || iconMap[skill.name] || <Code2 className="w-5 h-5 text-gray-400" />;
                  
                  return (
                    <div key={skill._id} className="w-6 h-6 flex items-center justify-center group relative cursor-pointer hover:scale-110 transition-transform shrink-0">
                      {IconComponent}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {skill.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center lg:text-left">No skills added.</p>
            )}
          </div>

          {/* Column 5: Connect (Full width on mobile, centered content) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Connect</h4>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {dynamicSocials.map((link, idx) => {
                const mappedIconKey = link.name.charAt(0).toUpperCase() + link.name.slice(1);
                const SocialIcon = iconMap[mappedIconKey] || iconMap[link.name] || <ArrowUpRight className="w-4 h-4 text-gray-500" />;
                return (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#222] hover:-translate-y-1 flex items-center justify-center transition-all duration-300 group">
                    <span className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {SocialIcon}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Redesigned Clean Start a Project Button */}
            <Link href="/contact" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-black dark:text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#111] hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2">
              Start a Project <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>

        </div>

        {/* ================= 3. COMPACT STATS SECTION ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 border-t border-gray-200/80 dark:border-gray-800/80">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-transparent flex flex-row items-center gap-3 sm:gap-4 group cursor-default py-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-[#111] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-black dark:text-white tracking-tight leading-tight">{stat.value}</h3>
                  <p className="text-[9px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 4. BOTTOM COPYRIGHT & ELONGATED TOP BUTTON ================= */}
        <div className="flex flex-row items-end justify-between pt-6 border-t border-gray-200/80 dark:border-gray-800/80 mt-2">
          
          {/* Left Aligned Content */}
          <div className="flex flex-col items-start gap-2 sm:gap-3 text-left">
            
            {/* এক লাইনে কপিরাইট (মোবাইল ও ডেস্কটপ উভয়ের জন্য) */}
            <div className="text-[11px] sm:text-xs font-medium text-gray-500 flex flex-wrap items-center gap-1.5">
              <span>&copy; {currentYear}. meetsakib.com</span>
              <span className="mx-1 text-gray-300 dark:text-gray-700">•</span>
              <span>Crafted with</span>
              <svg className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg> 
              <span>by {developerName}</span>
            </div>
            
            {/* লিংকস এবং লম্বালম্বি ডিভাইডার */}
            <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-gray-500">
              <Link href="/sitemap" className="hover:text-black dark:hover:text-white transition-colors">Site Map</Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Right Aligned: Elongated Top Button (ফ্লোটিং বটম স্পেস দেওয়া হয়েছে চ্যাটবটের জন্য) */}
          <a 
            href="#"
            aria-label="Back to top"
            className="group flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200/60 dark:bg-[#222] rounded-full hover:-translate-y-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm shrink-0 mb-14 md:mb-0"
          >
            <span className="text-[10px] font-bold tracking-wider hidden sm:block">TOP</span>
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 group-hover:text-current transition-colors" />
          </a>

        </div>
      </div>
    </footer>
  );
}