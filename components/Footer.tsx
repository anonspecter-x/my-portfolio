import Link from "next/link";
import { MongoClient } from "mongodb";
import { ArrowUpRight, ArrowUp, Code2, Mail, Send, Award, Briefcase, CheckCircle2, Users } from "lucide-react";
import { iconMap } from "@/lib/iconMap";

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

  // Home বাদ দিয়ে ইনডেক্স লিংক
  const navLinks = [
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Contact", url: "/contact" },
  ];

  // 📌 স্ট্যাটস / অ্যাচিভমেন্ট ডেটা
  const stats = [
    { id: 1, title: "Years Experience", value: "04+", icon: Briefcase },
    { id: 2, title: "Completed Projects", value: "50+", icon: CheckCircle2 },
    { id: 3, title: "Happy Clients", value: "30+", icon: Users },
    { id: 4, title: "Global Awards", value: "05+", icon: Award },
  ];

  return (
    <footer className="bg-[#fafafa] dark:bg-[#030303] pt-10 pb-6 transition-colors duration-1000 border-t border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden font-sans">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* ================= 1. COMPACT NEWSLETTER ================= */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white mb-1">
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

        {/* ================= 2. EQUAL 5 COLUMN MAIN GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col gap-4">
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
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed font-medium">
              {tagline}
            </p>
          </div>

          {/* Column 2: Index (No Home) */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Index</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link, idx) => (
                <Link key={idx} href={link.url} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Projects */}
          <div className="flex flex-col gap-4">
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

          {/* Column 4: Tech Stack (IconMap Integrated, No Borders) */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Stack</h4>
            {skills.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 w-fit">
                {skills.map((skill: any) => {
                  const mappedIconKey = skill.icon ? skill.icon.charAt(0).toUpperCase() + skill.icon.slice(1) : skill.name;
                  const IconComponent = iconMap[mappedIconKey] || iconMap[skill.name] || <Code2 className="w-5 h-5 text-gray-400" />;
                  
                  return (
                    <div key={skill._id} className="w-6 h-6 flex items-center justify-center group relative cursor-pointer hover:scale-110 transition-transform">
                      {IconComponent}
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
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

          {/* Column 5: Connect & Full-width Contact Button */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Connect</h4>
            
            {/* Just Icons Grid for Socials */}
            <div className="flex flex-wrap gap-3">
              {dynamicSocials.map((link, idx) => {
                const mappedIconKey = link.name.charAt(0).toUpperCase() + link.name.slice(1);
                // Getting the matching SVG from iconMap (e.g. Github, Linkedin)
                const SocialIcon = iconMap[mappedIconKey] || <ArrowUpRight className="w-4 h-4 text-gray-500" />;
                return (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#222] flex items-center justify-center transition-colors group">
                    <span className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {SocialIcon}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Redesigned Full Width Let's Talk Button */}
            <Link href="/contact" className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-xs font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2">
              Let's Talk <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* ================= 3. DESKTOP ONLY STATS SECTION ================= */}
        <div className="hidden md:grid grid-cols-4 gap-6 py-10 border-t border-gray-200/80 dark:border-gray-800/80">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-transparent flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#111] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  {/* ফন্ট থিকনেস কমানো হয়েছে */}
                  <h3 className="text-xl font-semibold text-black dark:text-white tracking-tight">{stat.value}</h3>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 4. BOTTOM COPYRIGHT & CLEAN TOP BUTTON ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200/80 dark:border-gray-800/80 gap-4 mt-6 md:mt-0">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm font-medium text-gray-500 text-center sm:text-left">
            {/* সম্পূর্ণ নাম ব্যবহার করা হয়েছে */}
            <p>&copy; {currentYear} {developerName}.</p>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <p className="flex items-center gap-1.5">
              Crafted with 
              <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg> 
              by {developerName}
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <nav className="flex items-center gap-4 text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Link href="/sitemap" className="hover:text-black dark:hover:text-white transition-colors">Site Map</Link>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
            </nav>

            {/* শুধু রাউন্ডেড আইকন ব্যাক-টু-টপ বাটন (লেখা ও বক্স রিমুভ করা হয়েছে) */}
            <a 
              href="#"
              aria-label="Back to top"
              className="group flex items-center justify-center w-8 h-8 bg-gray-200/60 dark:bg-[#222] rounded-full hover:-translate-y-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <ArrowUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-current transition-colors" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}