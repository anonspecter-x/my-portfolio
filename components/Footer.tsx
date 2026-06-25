import Link from "next/link";
import { MongoClient } from "mongodb";
import { ArrowUpRight, ArrowUp, Globe, Sparkles } from "lucide-react";

// ==========================================
// 📌 CUSTOM SVG ICONS FOR SOCIAL BRANDS (From Settings)
// ==========================================
const FacebookIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const GithubIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const WhatsappIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;

// ==========================================
// 🗄️ FETCH DYNAMIC DATA FROM MONGODB
// ==========================================
async function getFooterData() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const settings = await client.db().collection("settings").findOne({});
    await client.close();
    return settings;
  } catch (error) {
    return null;
  }
}

export default async function Footer() {
  const settings = await getFooterData();
  const currentYear = new Date().getFullYear();

  // 📌 ডায়নামিক ভ্যালু সেট করা
  const developerName = settings?.developerName || "Md Nazmus Shakib";
  const location = settings?.developerRegion || "Dhaka, Bangladesh • GMT+6";
  const tagline = "Engineering premium, high-performance web applications and scalable digital solutions.";

  // 📌 সোশ্যাল লিংকস উইথ আইকনস
  const availablePlatforms = [
    { id: "github", name: "GitHub", icon: GithubIcon },
    { id: "linkedin", name: "LinkedIn", icon: LinkedinIcon },
    { id: "twitter", name: "Twitter / X", icon: TwitterIcon },
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

  return (
    <footer className="bg-[#fafafa] dark:bg-[#030303] pt-10 md:pt-16 pb-6 transition-colors duration-1000 border-t border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* ================= HEAVY CTA SECTION ================= */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-gray-200/80 dark:border-gray-800/80 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">great.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 md:mt-3 leading-relaxed">
              Have an idea in mind? Let's collaborate and engineer the perfect digital solution for your next big project.
            </p>
          </div>
          
          <Link 
            href="/contact"
            className="group flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto bg-black dark:bg-white text-white dark:text-black font-bold text-sm md:text-base rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shrink-0"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 dark:text-yellow-500" />
            Start a Project
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* ================= MAIN GRID SECTION ================= */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 py-12 relative z-10">
          
          {/* Left Column: Big Logo & Info */}
          <div className="flex flex-col gap-5 lg:w-5/12">
            <Link href="/" className="group w-fit block">
              {settings?.siteLogo ? (
                <img 
                  src={settings.siteLogo} 
                  alt={developerName} 
                  className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <span className="font-extrabold text-3xl md:text-4xl tracking-tight text-black dark:text-white">
                  {developerName}
                </span>
              )}
            </Link>

            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-md font-medium mt-2">
              {tagline}
            </p>
          </div>

          {/* Right Column: Links Grid (Mobile Compact, Desktop Heavy) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:w-7/12 w-full">
            
            {/* Nav Links */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Index</h4>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link, idx) => (
                  <Link key={idx} href={link.url} className="text-sm md:text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Dynamic Social Links (Pill Buttons Grid) */}
            <div className="flex flex-col gap-4 col-span-1 sm:col-span-2">
              <h4 className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase font-bold">Connect</h4>
              {dynamicSocials.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {dynamicSocials.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 hover:bg-white dark:hover:bg-[#111] px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        {link.name}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No social links added.</p>
              )}
            </div>

          </div>
        </div>

        {/* ================= BOTTOM METRICS ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200/80 dark:border-gray-800/80 gap-4 relative z-10">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs md:text-sm font-semibold text-gray-500 text-center sm:text-left w-full sm:w-auto">
            <p>&copy; {currentYear} {developerName}. All rights reserved.</p>
            <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            
            {/* Location Badge */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/50">
              <Globe className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>{location}</span>
            </div>
          </div>
          
          <a 
            href="#"
            className="group flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors w-full sm:w-auto justify-center bg-gray-100 dark:bg-[#111] sm:bg-transparent sm:dark:bg-transparent py-3 sm:py-0 rounded-xl sm:rounded-none mt-2 sm:mt-0 shadow-sm sm:shadow-none"
          >
            BACK TO TOP 
            <span className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-[#222] border border-gray-300/50 dark:border-gray-700/50 rounded-full group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </a>

        </div>
      </div>
    </footer>
  );
}