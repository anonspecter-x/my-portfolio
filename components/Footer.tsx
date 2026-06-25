import Link from "next/link";
import { MongoClient } from "mongodb";
import { ArrowUpRight, ArrowUp, Mail, Globe, Sparkles } from "lucide-react";

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
  const email = settings?.developerEmail || "hello@nazmus.dev";
  const location = settings?.developerRegion || "Dhaka, Bangladesh • GMT+6";
  const tagline = "Engineering premium, high-performance web applications and scalable digital solutions.";

  // 📌 ডায়নামিক সোশ্যাল লিংকস (অ্যাডমিন প্যানেল থেকে Visible করা)
  const availablePlatforms = [
    { id: "github", name: "GitHub" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "twitter", name: "Twitter / X" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "youtube", name: "YouTube" },
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram" },
  ];

  const dynamicSocials = availablePlatforms
    .filter(platform => settings?.[`social_${platform.id}_visible`] === "true" && settings?.[`social_${platform.id}`])
    .map(platform => ({
      name: platform.name,
      url: settings?.[`social_${platform.id}`]
    }));

  const navLinks = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <footer className="bg-[#fafafa] dark:bg-[#030303] pt-12 md:pt-20 pb-6 transition-colors duration-1000 border-t border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* ================= COMPACT CTA SECTION ================= */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-gray-200/80 dark:border-gray-800/80 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black dark:text-white leading-tight">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">great.</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-2">Available for freelance opportunities and full-time roles.</p>
          </div>
          
          <Link 
            href="/contact"
            className="group flex items-center justify-center gap-2 px-6 py-3 w-full md:w-auto bg-black dark:bg-white text-white dark:text-black font-bold text-xs md:text-sm rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-md shrink-0"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 dark:text-yellow-500" />
            Start a Project
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* ================= MAIN CONTENT SECTION ================= */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 py-10 relative z-10">
          
          {/* Left Column: Original Logo & Direct Contact */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            <Link href="/" className="group w-fit block mb-1">
              {settings?.siteLogo ? (
                <img 
                  src={settings.siteLogo} 
                  alt={developerName} 
                  className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <span className="font-extrabold text-2xl tracking-tight text-black dark:text-white">
                  {developerName}
                </span>
              )}
            </Link>

            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              {tagline}
            </p>
            <a 
              href={`mailto:${email}`} 
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-black dark:text-white bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#222] border border-gray-200/50 dark:border-gray-800/50 px-4 py-2.5 rounded-xl w-fit transition-all duration-300 shadow-sm mt-1"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {email}
            </a>
          </div>

          {/* Right Column: Links (Flex row used to remove extra empty space) */}
          <div className="flex flex-row gap-16 md:gap-24 lg:justify-end">
            
            {/* Nav Links */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[10px] tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Index</h4>
              {navLinks.map((link, idx) => (
                <Link key={idx} href={link.url} className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors w-fit">
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Dynamic Social Links */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[10px] tracking-[0.15em] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Connect</h4>
              {dynamicSocials.length > 0 ? (
                dynamicSocials.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">
                    {link.name} 
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                ))
              ) : (
                <p className="text-xs text-gray-500">No social links added.</p>
              )}
            </div>

          </div>
        </div>

        {/* ================= BOTTOM METRICS ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200/80 dark:border-gray-800/80 gap-4 relative z-10">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-500 text-center sm:text-left w-full sm:w-auto">
            <p>&copy; {currentYear} {developerName}.</p>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>{location}</span>
            </div>
          </div>
          
          <a 
            href="#"
            className="group flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors w-full sm:w-auto justify-center bg-gray-100 dark:bg-[#111] sm:bg-transparent sm:dark:bg-transparent py-2.5 sm:py-0 rounded-xl sm:rounded-none mt-2 sm:mt-0 shadow-sm sm:shadow-none"
          >
            TOP 
            <span className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-[#222] border border-gray-300/50 dark:border-gray-700/50 rounded-full group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
              <ArrowUp className="w-3 h-3" />
            </span>
          </a>

        </div>
      </div>
    </footer>
  );
}