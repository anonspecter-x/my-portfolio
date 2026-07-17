"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { 
  Terminal as TerminalIcon, ShieldCheck, Cpu, 
  Database, Network, Activity, ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";

// 📌 Interfaces
interface Project { slug: string; title: string; tech: string[]; description: string; }
interface Post { slug: string; title: string; category: string; }
interface Skill { name: string; percentage: number; }
interface Certificate { title: string; issuer: string; }
interface Brand { name: string; website?: string; }
interface Testimonial { name: string; role: string; review: string; }

interface TerminalClientProps {
  data: {
    projects: Project[];
    posts: Post[];
    skills: Skill[];
    certificates: Certificate[];
    brands?: Brand[];
    testimonials?: Testimonial[];
  };
}

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  path: string;
}

export default function TerminalClient({ data }: TerminalClientProps) {
  const router = useRouter();
  
  // 📌 State Management
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState("~");
  
  // Terminal Command History (Up/Down Arrow Keys)
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // 📌 Animation Variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // 📌 Initial Boot Sequence
  useEffect(() => {
    setHistory([
      {
        command: "",
        path: "",
        output: (
          <div className="text-gray-400 space-y-2 mb-4">
            <p>Booting MeetSakib OS v4.0.0...</p>
            <p>Loading kernel modules... <span className="text-green-400">[OK]</span></p>
            <p>Mounting full virtual file system (Projects, Blogs, Brands, Policies)... <span className="text-green-400">[OK]</span></p>
            <div className="text-white mt-4 border border-gray-700 bg-[#111] p-4 rounded-lg inline-block w-full shadow-lg">
              <span className="font-bold text-blue-400 block mb-2">Welcome to the Interactive Console.</span>
              Type <code className="text-yellow-400 font-bold">help</code> to see available commands.<br/>
              Type <code className="text-yellow-400 font-bold">ls</code> to list directory contents.<br/>
              Type <code className="text-yellow-400 font-bold">cat &lt;filename&gt;</code> to read files.
            </div>
          </div>
        )
      }
    ]);
  }, []);

  // 📌 Auto-scroll to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // 📌 Virtual File System Logic (All pages added)
  const getDirectoryContents = (path: string) => {
    const cleanPath = path.replace(/\/$/, "");

    if (cleanPath === "~") {
      return [
        { name: "projects", type: "dir" },
        { name: "blog", type: "dir" },
        { name: "certificates", type: "dir" },
        { name: "brands", type: "dir" },
        { name: "testimonials", type: "dir" },
        { name: "about.txt", type: "file" },
        { name: "skills.json", type: "file" },
        { name: "contact.txt", type: "file" },
        { name: "privacy_policy.md", type: "file" },
        { name: "terms_of_service.md", type: "file" },
        { name: "sitemap.xml", type: "file" }
      ];
    } else if (cleanPath === "~/projects") {
      return data.projects.map(p => ({ name: p.slug, type: "dir" }));
    } else if (cleanPath === "~/blog") {
      return data.posts.map(p => ({ name: p.slug, type: "dir" }));
    } else if (cleanPath === "~/certificates") {
      return data.certificates.map((c, i) => ({ name: `cert_${i}.txt`, type: "file", data: c }));
    } else if (cleanPath === "~/brands") {
      return (data.brands || []).map((b, i) => ({ name: `brand_${i}.json`, type: "file", data: b }));
    } else if (cleanPath === "~/testimonials") {
      return (data.testimonials || []).map((t, i) => ({ name: `review_${i}.txt`, type: "file", data: t }));
    } else if (cleanPath.startsWith("~/projects/")) {
      return [{ name: "details.json", type: "file" }, { name: "readme.md", type: "file" }];
    } else if (cleanPath.startsWith("~/blog/")) {
      return [{ name: "article.md", type: "file" }];
    }
    return null;
  };

  // 📌 Command Processor
  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
      setHistory(prev => [...prev, { command: "", output: "", path: currentPath }]);
      return;
    }

    const args = trimmedCmd.split(" ").filter(Boolean);
    const baseCmd = args[0].toLowerCase();
    let output: React.ReactNode = "";
    let newPath = currentPath;

    // Command History Logic
    setCommandHistory(prev => [trimmedCmd, ...prev]);
    setHistoryIndex(-1);

    switch (baseCmd) {
      case "help":
        output = (
          <div className="grid grid-cols-1 gap-2 text-gray-300">
            <div className="border-b border-gray-700 pb-2 mb-2 font-bold text-white">System Commands</div>
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-3 text-blue-400 font-bold">ls [dir]</span><span className="col-span-9">List directory contents</span>
              <span className="col-span-3 text-blue-400 font-bold">cd &lt;dir&gt;</span><span className="col-span-9">Change directory (e.g., cd projects)</span>
              <span className="col-span-3 text-blue-400 font-bold">cat &lt;file&gt;</span><span className="col-span-9">Read a file (e.g., cat privacy_policy.md)</span>
              <span className="col-span-3 text-blue-400 font-bold">pwd</span><span className="col-span-9">Print working directory</span>
              <span className="col-span-3 text-blue-400 font-bold">clear</span><span className="col-span-9">Clear terminal screen</span>
              <span className="col-span-3 text-blue-400 font-bold">open &lt;route&gt;</span><span className="col-span-9">Launch GUI routing (e.g., open /sitemap)</span>
              <span className="col-span-3 text-blue-400 font-bold">history</span><span className="col-span-9">View command history</span>
            </div>
          </div>
        );
        break;

      case "pwd":
        output = <span className="text-gray-300">{currentPath}</span>;
        break;

      case "ls":
        let targetForLs = currentPath;
        if (args.length > 1) {
          const target = args[1].toLowerCase();
          if (target === "~") {
            targetForLs = "~";
          } else if (target === "..") {
            if (currentPath !== "~") {
              const parts = currentPath.split("/");
              parts.pop();
              targetForLs = parts.join("/") || "~";
            }
          } else {
            targetForLs = currentPath === "~" ? `~/${target}` : `${currentPath}/${target}`;
          }
        }

        const contents = getDirectoryContents(targetForLs);
        if (contents) {
          output = (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {contents.map((item, i) => (
                <span key={i} className={item.type === "dir" ? "text-blue-400 font-bold" : "text-emerald-400"}>
                  {item.name}{item.type === "dir" ? "/" : ""}
                </span>
              ))}
            </div>
          );
        } else {
          output = <span className="text-red-400">ls: cannot access '{args[1]}': No such file or directory</span>;
        }
        break;

      case "cd":
        const targetDir = args[1];
        if (!targetDir || targetDir === "~") {
          newPath = "~";
        } else if (targetDir === "..") {
          if (currentPath !== "~") {
            const parts = currentPath.split("/");
            parts.pop();
            newPath = parts.join("/") || "~";
          }
        } else {
          const cleanTargetDir = targetDir.replace(/\/$/, ""); 
          const simulatedPath = currentPath === "~" ? `~/${cleanTargetDir}` : `${currentPath}/${cleanTargetDir}`;
          const isValid = getDirectoryContents(simulatedPath) !== null;
          
          if (isValid) {
            newPath = simulatedPath;
          } else {
            output = <span className="text-red-400">bash: cd: {targetDir}: No such file or directory</span>;
          }
        }
        break;

      case "cat":
        const file = args[1];
        if (!file) {
          output = <span className="text-red-400">cat: missing file operand</span>;
        } else if (currentPath === "~" && file === "about.txt") {
          output = "Senior Full-Stack Developer specializing in scalable architectures and premium web experiences.";
        } else if (currentPath === "~" && file === "contact.txt") {
          output = (
            <div className="text-gray-300">
              <p>Email: <a href="mailto:contact@meetsakib.com" className="text-blue-400 hover:underline">contact@meetsakib.com</a></p>
              <p>Location: Dhaka, Bangladesh</p>
              <p className="mt-2 text-yellow-400">💡 Hint: Type <code className="bg-gray-800 px-1 rounded text-white font-bold">open /contact</code> to access the secure contact form.</p>
            </div>
          );
        } else if (currentPath === "~" && file === "privacy_policy.md") {
          output = (
            <div className="text-gray-300">
              <h2 className="text-white font-bold text-lg mb-2"># Privacy Policy & Data Handling</h2>
              <p>We deeply respect your privacy and are committed to protecting any personally identifiable information you may provide us. We do not sell data to third parties.</p>
              <p className="mt-2 text-yellow-400">💡 Hint: Type <code className="bg-gray-800 px-1 rounded text-white font-bold">open /privacy</code> for the full legal document.</p>
            </div>
          );
        } else if (currentPath === "~" && file === "terms_of_service.md") {
          output = (
            <div className="text-gray-300">
              <h2 className="text-white font-bold text-lg mb-2"># Terms of Service</h2>
              <p>By accessing the site or initiating a project, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.</p>
              <p className="mt-2 text-yellow-400">💡 Hint: Type <code className="bg-gray-800 px-1 rounded text-white font-bold">open /terms</code> for the full legal document.</p>
            </div>
          );
        } else if (currentPath === "~" && file === "sitemap.xml") {
          output = (
            <pre className="text-gray-400 text-xs overflow-x-auto p-2 bg-[#111] rounded-lg border border-gray-800">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://meetsakib.com/</loc></url>
  <url><loc>https://meetsakib.com/projects</loc></url>
  <url><loc>https://meetsakib.com/blog</loc></url>
  <url><loc>https://meetsakib.com/certificates</loc></url>
  <url><loc>https://meetsakib.com/brands</loc></url>
  <url><loc>https://meetsakib.com/contact</loc></url>
</urlset>`}
            </pre>
          );
        } else if (currentPath === "~" && file === "skills.json") {
          output = (
            <pre className="text-yellow-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(data.skills, null, 2)}
            </pre>
          );
        } else if (currentPath.startsWith("~/projects/") && file === "details.json") {
          const slug = currentPath.split("/")[2];
          const project = data.projects.find(p => p.slug === slug);
          output = project ? (
            <pre className="text-yellow-300 text-xs overflow-x-auto">{JSON.stringify(project, null, 2)}</pre>
          ) : <span className="text-red-400">cat: details.json: No such file</span>;
        } else if (currentPath.startsWith("~/blog/") && file === "article.md") {
          const slug = currentPath.split("/")[2];
          const post = data.posts.find(p => p.slug === slug);
          output = post ? (
            <div className="text-orange-300 border border-gray-700 bg-[#111] p-3 rounded-lg w-fit shadow-md">
              <p className="font-bold text-white text-lg"># {post.title}</p>
              <p className="text-gray-400 mt-2">Category: {post.category}</p>
              <p className="mt-4 text-yellow-400 text-xs">💡 Hint: Use <code className="bg-gray-800 px-1 rounded text-white font-bold">open /blog/{slug}</code> to read the full article.</p>
            </div>
          ) : <span className="text-red-400">cat: article.md: No such file</span>;
        } else if (currentPath === "~/certificates" && file.startsWith("cert_") && file.endsWith(".txt")) {
          const index = parseInt(file.split("_")[1].split(".")[0]);
          const cert = data.certificates[index];
          output = cert ? (
            <div className="text-emerald-300 border border-gray-700 bg-[#111] p-3 rounded-lg w-fit shadow-md">
              <p className="font-bold text-white border-b border-gray-700 pb-1 mb-2">Certificate Information</p>
              <p><span className="text-gray-400">Title:</span> {cert.title}</p>
              <p><span className="text-gray-400">Issuer:</span> {cert.issuer}</p>
            </div>
          ) : <span className="text-red-400">cat: {file}: No such file</span>;
        } else if (currentPath === "~/brands" && file.startsWith("brand_") && file.endsWith(".json")) {
          const index = parseInt(file.split("_")[1].split(".")[0]);
          const brand = data.brands?.[index];
          output = brand ? (
            <pre className="text-yellow-300 text-xs overflow-x-auto">{JSON.stringify(brand, null, 2)}</pre>
          ) : <span className="text-red-400">cat: {file}: No such file</span>;
        } else if (currentPath === "~/testimonials" && file.startsWith("review_") && file.endsWith(".txt")) {
          const index = parseInt(file.split("_")[1].split(".")[0]);
          const review = data.testimonials?.[index];
          output = review ? (
            <div className="text-pink-300 border border-gray-700 bg-[#111] p-4 rounded-lg shadow-md max-w-lg">
              <p className="font-bold text-white text-lg">{review.name}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{review.role}</p>
              <p className="italic text-gray-300">"{review.review}"</p>
            </div>
          ) : <span className="text-red-400">cat: {file}: No such file</span>;
        } else {
          output = <span className="text-red-400">cat: {file}: No such file or directory</span>;
        }
        break;

      case "open":
      case "gui":
        const route = args[1];
        if (route) {
          router.push(route.startsWith("/") ? route : `/${route}`);
          output = <span className="text-blue-400">Opening GUI interface for {route}...</span>;
        } else {
          output = <span className="text-red-400">Usage: open &lt;route&gt;</span>;
        }
        break;

      case "clear":
        setHistory([]);
        return;

      case "history":
        output = (
          <div className="flex flex-col text-gray-400">
            {commandHistory.slice().reverse().map((cmd, i) => (
              <span key={i}><span className="mr-4">{i + 1}</span> {cmd}</span>
            ))}
          </div>
        );
        break;

      case "sudo":
        output = <span className="text-red-500 font-bold">sakib is not in the sudoers file. This incident will be reported.</span>;
        break;

      default:
        // Smart Fallback for UX
        const smartTarget = baseCmd.replace(/\/$/, ""); 
        const smartContents = getDirectoryContents(currentPath);
        
        let foundSmartItem = false;
        if (smartContents) {
          const foundItem = smartContents.find(item => item.name.toLowerCase() === smartTarget.toLowerCase());
          if (foundItem) {
            foundSmartItem = true;
            if (foundItem.type === "dir") {
              output = (
                <div>
                  <span className="text-red-400">bash: {baseCmd}: Is a directory</span><br />
                  <span className="text-yellow-400">💡 Hint: Use <code className="font-bold text-white bg-gray-800 px-1 rounded">cd {smartTarget}</code> to enter this directory, or <code className="font-bold text-white bg-gray-800 px-1 rounded">ls {smartTarget}</code> to see its contents.</span>
                </div>
              );
            } else {
              output = (
                <div>
                  <span className="text-red-400">bash: {baseCmd}: command not found</span><br />
                  <span className="text-yellow-400">💡 Hint: Use <code className="font-bold text-white bg-gray-800 px-1 rounded">cat {smartTarget}</code> to read this file.</span>
                </div>
              );
            }
          }
        }

        if (!foundSmartItem) {
          output = <span className="text-red-400">bash: {baseCmd}: command not found. Type 'help' for available commands.</span>;
        }
    }

    setCurrentPath(newPath);
    setHistory(prev => [...prev, { command: trimmedCmd, output, path: currentPath }]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#030303] text-[#111] dark:text-[#f5f5f5] pt-32 pb-20 px-6 sm:px-8 md:px-12 max-w-[85rem] mx-auto overflow-hidden selection:bg-blue-500/30">
      
      {/* 🎨 Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>

      {/* 🌟 Header Section */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mb-12 md:mb-16 relative z-10">
        <motion.div variants={fadeUp} className="inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-semibold mb-6 text-gray-600 dark:text-gray-400">
          <TerminalIcon className="w-3.5 h-3.5" /> Root Access Console
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] mb-6">
          System <span className="text-gray-400">Terminal.</span>
        </motion.h1>
      </motion.div>

      {/* 🌟 Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* 📌 Left Side: System Monitor & Stats (lg:col-span-4) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex flex-col gap-6 lg:col-span-4 sticky top-32"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> System Diagnostics
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><Cpu className="w-4 h-4"/> Runtime</span>
                <span className="text-sm font-bold text-black dark:text-white">Node.js V20.x</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><Database className="w-4 h-4"/> DB Status</span>
                <span className="text-sm font-bold text-emerald-500">Connected</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><Network className="w-4 h-4"/> Indexed Files</span>
                <span className="text-sm font-bold text-black dark:text-white">{(data.projects?.length || 0) + (data.posts?.length || 0) + (data.certificates?.length || 0) + 15} Total</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-[#111] border border-blue-100 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm">
            <h4 className="font-bold text-black dark:text-white mb-2">GUI Mode Available</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Prefer a visual interface? You can launch the graphical UI at any time by typing <code className="bg-white dark:bg-black px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">open /sitemap</code>.
            </p>
            <button onClick={() => router.push('/sitemap')} className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 w-fit hover:scale-105 transition-transform">
              Open Site Index <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* 📌 Right Side: Massive Terminal Window (lg:col-span-8) */}
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="lg:col-span-8 w-full"
        >
          <motion.div variants={fadeUp} className="bg-[#121212] border border-gray-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-mono text-sm h-[60vh] lg:h-[75vh]" onClick={handleTerminalClick}>
            
            {/* 💻 Terminal Header (Mac OS Style) */}
            <div className="bg-[#1e1e1e] px-5 py-4 flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
              </div>
              <div className="text-gray-400 text-xs font-semibold flex items-center gap-2 bg-[#2d2d2d] px-3 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> guest@meetsakib-os
              </div>
              <div className="w-16"></div> {/* Spacer */}
            </div>

            {/* 💻 Terminal Body */}
            <div ref={terminalBodyRef} className="p-6 text-gray-300 flex-1 overflow-y-auto custom-scrollbar cursor-text text-[13px] md:text-sm leading-relaxed">
              
              {/* History Output */}
              {history.map((item, idx) => (
                <div key={idx} className="mb-4">
                  {item.command && (
                    <div className="flex items-start gap-2 text-white">
                      <span className="text-emerald-400 font-bold shrink-0">guest@meetsakib:{item.path}$</span>
                      <span className="break-all">{item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <div className="mt-1.5 ml-1 opacity-90 break-words">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}

              {/* Current Input Line */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-emerald-400 font-bold shrink-0">guest@meetsakib:{currentPath}$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white caret-emerald-400 focus:ring-0 p-0"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 🎨 Heavy Terminal Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #121212; border-left: 1px solid #1e1e1e; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; border: 2px solid #121212; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}} />
    </main>
  );
}