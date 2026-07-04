"use client";

import React, { useState, useRef } from "react";
import { 
  saveSkill, deleteSkill, saveService, deleteService, saveBrand, deleteBrand, saveFooterIcons 
} from "./actions"; // 📌 saveFooterIcons ইমপোর্ট করা হলো
import { 
  Zap, Plus, Trash2, Edit2, X, Briefcase, 
  Image as ImageIcon, ChevronDown, Loader2, Code2, Award, Building2,
  CheckSquare
} from "lucide-react";

// 📌 আলাদা করা iconMap ফাইলটি ইমপোর্ট করা হলো
import { iconMap } from "@/lib/iconMap"; 

interface Skill {
  _id: string;
  name: string;
  subtitle?: string;
  percentage: number;
  icon: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
  order: number;
}

export default function SkillsClient({ 
  skills, 
  services, 
  brands = [],
  footerIcons = [] // 📌 ফুটার আইকনের লিস্ট রিসিভ করার জন্য
}: { 
  skills: Skill[]; 
  services: Service[]; 
  brands?: Brand[]; 
  footerIcons?: string[]; // 📌 টাইপ অ্যাড করা হলো
}) {
  const [activeTab, setActiveTab] = useState<"skills" | "services" | "brands">("skills");
  
  // States for Skills
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);
  
  // States for Footer Skills Management
  const [isSubmittingFooter, setIsSubmittingFooter] = useState(false);
  
  // States for Services
  const [editService, setEditService] = useState<Service | null>(null);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // States for Brands
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isSubmittingBrand, setIsSubmittingBrand] = useState(false);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // ✏️ Handlers for Skills
  const handleEditSkill = (skill: Skill) => {
    setEditSkill(skill);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelEditSkill = () => {
    setEditSkill(null);
    formRef.current?.reset();
  };

  // ✏️ Handlers for Services
  const handleEditService = (service: Service) => {
    setEditService(service);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelEditService = () => {
    setEditService(null);
    formRef.current?.reset();
  };

  // ✏️ Handlers for Brands
  const handleEditBrand = (brand: Brand) => {
    setEditBrand(brand);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelEditBrand = () => {
    setEditBrand(null);
    formRef.current?.reset();
  };

  // 📌 iconMap থেকে সব আইকনের নাম বের করা হলো
  const allAvailableIcons = Object.keys(iconMap);

  return (
    <div className="space-y-8">
      
      {/* ================= 🗂️ TABS NAVIGATION ================= */}
      <div className="flex bg-gray-100 dark:bg-[#111] p-1.5 rounded-2xl w-fit border border-gray-200 dark:border-gray-800 flex-wrap gap-1">
        <button 
          disabled={isSubmittingSkill || isSubmittingService || isSubmittingBrand}
          onClick={() => { setActiveTab("skills"); handleCancelEditService(); handleCancelEditBrand(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "skills" ? "bg-white dark:bg-[#222] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"} disabled:opacity-50`}
        >
          <Zap className="w-4 h-4" /> Technical Skills
        </button>
        <button 
          disabled={isSubmittingSkill || isSubmittingService || isSubmittingBrand}
          onClick={() => { setActiveTab("services"); handleCancelEditSkill(); handleCancelEditBrand(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "services" ? "bg-white dark:bg-[#222] text-purple-600 dark:text-purple-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"} disabled:opacity-50`}
        >
          <Briefcase className="w-4 h-4" /> Experience & Services
        </button>
        <button 
          disabled={isSubmittingSkill || isSubmittingService || isSubmittingBrand}
          onClick={() => { setActiveTab("brands"); handleCancelEditSkill(); handleCancelEditService(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "brands" ? "bg-white dark:bg-[#222] text-amber-600 dark:text-amber-500 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"} disabled:opacity-50`}
        >
          <Award className="w-4 h-4" /> Trusted Brands
        </button>
      </div>

      {/* ================= 🚀 TAB 1: TECHNICAL SKILLS ================= */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Skill Form --- */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              {editSkill ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
              {editSkill ? "Edit Skill" : "Add New Skill"}
            </h2>
            
            <form 
              ref={formRef} 
              onSubmit={() => setIsSubmittingSkill(true)}
              action={async (formData) => {
                try {
                  await saveSkill(formData);
                  setEditSkill(null);
                  formRef.current?.reset();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSubmittingSkill(false);
                }
              }} 
              className="space-y-5"
            >
              {editSkill && <input type="hidden" name="id" value={editSkill._id} />}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Skill Name</label>
                <input type="text" name="name" defaultValue={editSkill?.name || ""} required key={editSkill?._id + 'name'} placeholder="e.g. React.js" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Subtitle (Category)</label>
                <input type="text" name="subtitle" defaultValue={editSkill?.subtitle || ""} key={editSkill?._id + 'sub'} placeholder="e.g. JavaScript Library" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Expertise (%)</label>
                <div className="relative">
                  <input type="number" name="percentage" min="10" max="100" defaultValue={editSkill?.percentage || 80} required key={editSkill?._id + 'pct'} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors pr-8" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Icon</label>
                <select name="icon" required defaultValue={editSkill?.icon || "React"} key={editSkill?._id + 'icon'} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                  {/* Web Fundamentals */}
                  <optgroup label="Fundamentals">
                    <option value="HTML5">HTML5</option>
                    <option value="CSS3">CSS3</option>
                    <option value="Sass">Sass</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                  </optgroup>
                  {/* Frontend */}
                  <optgroup label="Frontend Frameworks/Libs">
                    <option value="React">React.js</option>
                    <option value="NextJS">Next.js</option>
                    <option value="VueJS">Vue.js</option>
                    <option value="Angular">Angular</option>
                    <option value="Svelte">Svelte</option>
                    <option value="Tailwind">Tailwind CSS</option>
                  </optgroup>
                  {/* Backend */}
                  <optgroup label="Backend & Languages">
                    <option value="PHP">PHP</option>
                    <option value="Laravel">Laravel</option>
                    <option value="NodeJS">Node.js</option>
                    <option value="Express">Express.js</option>
                    <option value="NestJS">NestJS</option>
                    <option value="Python">Python</option>
                    <option value="Django">Django</option>
                    <option value="CPlusPlus">C++</option>
                    <option value="CSharp">C#</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Ruby">Ruby</option>
                    <option value="RubyOnRails">Ruby on Rails</option>
                  </optgroup>
                  {/* Databases */}
                  <optgroup label="Databases & ORMs">
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Redis">Redis</option>
                    <option value="Prisma">Prisma</option>
                  </optgroup>
                  {/* Tools / DevOps */}
                  <optgroup label="Cloud, DevOps & Tools">
                    <option value="Git">GIT</option>
                    <option value="Docker">Docker</option>
                    <option value="Kubernetes">Kubernetes</option>
                    <option value="AWS">AWS</option>
                    <option value="Firebase">Firebase Auth</option>
                    <option value="Supabase">Supabase</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="Vercel">Vercel</option>
                    <option value="Netlify">Netlify</option>
                    <option value="Linux">Linux</option>
                  </optgroup>
                  {/* Others */}
                  <optgroup label="CMS & Design">
                    <option value="Figma">Figma</option>
                    <option value="WordPress">WordPress</option>
                  </optgroup>
                  {/* Custom */}
                  <optgroup label="Other / Custom">
                    <option value="Custom">Custom / Code</option>
                  </optgroup>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button disabled={isSubmittingSkill} type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                  {isSubmittingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : editSkill ? "Update Skill" : "Save Skill"}
                </button>
                {editSkill && (
                  <button type="button" disabled={isSubmittingSkill} onClick={handleCancelEditSkill} className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- Skills List --- */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-gray-400" /> Live Homepage Skills ({skills.length})
            </h2>
            {skills.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm text-gray-500">No skills added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {skills.map((skill) => (
                  <div key={skill._id} className={`group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-opacity ${deletingSkillId === skill._id ? "opacity-40" : ""}`}>
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#222] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                          {iconMap[skill.icon] || <Code2 className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-black dark:text-white">{skill.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{skill.subtitle || "Skill"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button disabled={deletingSkillId !== null} onClick={() => handleEditSkill(skill)} className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button 
                          disabled={deletingSkillId !== null} 
                          onClick={async () => {
                            if(confirm("Delete this skill?")) {
                              setDeletingSkillId(skill._id);
                              try { await deleteSkill(skill._id); } finally { setDeletingSkillId(null); }
                            }
                          }} 
                          className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          {deletingSkillId === skill._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1 w-full mt-1">
                      {[...Array(10)].map((_, i) => (
                         <div key={i} className={`h-1 flex-1 rounded-sm ${i < Math.round(skill.percentage / 10) ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= 📌 NEW: FOOTER SKILLS MANAGEMENT SECTION (Full Library) ================= */}
          <div className="lg:col-span-12 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mt-4">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-2">
              <CheckSquare className="w-5 h-5 text-green-500" /> Footer Tech Stack Visibility
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Select any technology from the full library below to display in the footer section. You can choose as many as you want.
            </p>

            <form 
              action={async (formData) => {
                setIsSubmittingFooter(true);
                try {
                  await saveFooterIcons(formData);
                } catch (error) {
                  console.error(error);
                  alert("❌ Failed to update footer skills.");
                } finally {
                  setIsSubmittingFooter(false);
                }
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {/* 📌 iconMap থেকে সব আইকন ম্যাপ করা হচ্ছে */}
                {allAvailableIcons.map((iconKey) => (
                  <label key={iconKey} className="cursor-pointer group flex flex-col items-center justify-center gap-3 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 relative bg-gray-50 dark:bg-[#111]">
                    
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      name="footerIcons"
                      value={iconKey}
                      defaultChecked={footerIcons.includes(iconKey)}
                      className="absolute top-3 right-3 w-4 h-4 accent-green-500 cursor-pointer"
                    />
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#222] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 group-hover:scale-105 transition-transform">
                      {iconMap[iconKey] || <Code2 className="w-6 h-6 text-gray-400" />}
                    </div>
                    
                    {/* Title */}
                    <span className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 line-clamp-1 w-full truncate px-1">
                      {iconKey}
                    </span>
                  </label>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-5 border-t border-gray-200 dark:border-gray-800">
                <button 
                  disabled={isSubmittingFooter} 
                  type="submit" 
                  className="bg-green-600 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {isSubmittingFooter ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Footer Selection"}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ================= 🚀 TAB 2: EXPERIENCE / SERVICES ================= */}
      {activeTab === "services" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Service Form --- */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              {editService ? <Edit2 className="w-5 h-5 text-purple-500" /> : <Plus className="w-5 h-5 text-purple-500" />}
              {editService ? "Edit Experience Dropdown" : "Add Experience Dropdown"}
            </h2>
            
            <form 
              ref={formRef} 
              onSubmit={() => setIsSubmittingService(true)}
              action={async (formData) => {
                try {
                  await saveService(formData);
                  setEditService(null);
                  formRef.current?.reset();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSubmittingService(false);
                }
              }} 
              className="space-y-5"
            >
              {editService && <input type="hidden" name="id" value={editService._id} />}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Title / Category</label>
                <input type="text" name="title" defaultValue={editService?.title || ""} required key={editService?._id + 'title'} placeholder="e.g. Development, UI/UX Design" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
                <textarea name="description" defaultValue={editService?.description || ""} required key={editService?._id + 'desc'} rows={4} placeholder="Brief details about this experience..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-colors resize-none"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Side Image</label>
                {editService?.image && <img src={editService.image} alt="Cover" className="h-20 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover mb-2" />}
                <input type="file" name="image" accept="image/*" required={!editService} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-purple-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-[#222] dark:file:text-gray-300 cursor-pointer" />
              </div>

              <div className="pt-2 flex gap-2">
                <button disabled={isSubmittingService} type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                  {isSubmittingService ? <Loader2 className="w-4 h-4 animate-spin" /> : editService ? "Update Experience" : "Save Experience"}
                </button>
                {editService && (
                  <button type="button" disabled={isSubmittingService} onClick={handleCancelEditService} className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- Services List --- */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-gray-400" /> Live Dropdowns ({services?.length || 0})
            </h2>
            {(!services || services.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm text-gray-500">No experience dropdowns added yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {services.map((service) => (
                  <div key={service._id} className={`group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl flex items-stretch overflow-hidden shadow-sm hover:border-purple-500/30 transition-colors ${deletingServiceId === service._id ? "opacity-40" : ""}`}>
                    
                    {/* ১৬:৯ রেশিও (aspect-video) এবং ফিক্সড উইডথ যোগ করা হয়েছে */}
                    <div className="w-[160px] sm:w-[220px] aspect-video bg-gray-200 dark:bg-[#222] relative border-r border-gray-200 dark:border-gray-800 shrink-0">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="font-bold text-black dark:text-white flex items-center gap-1.5">{service.title} <ChevronDown className="w-4 h-4 text-gray-400" /></h4>
                           <div className="flex items-center gap-1.5">
                             <button disabled={deletingServiceId !== null} onClick={() => handleEditService(service)} className="w-7 h-7 rounded-md bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                             <button 
                              disabled={deletingServiceId !== null}
                              onClick={async () => {
                                if(confirm("Delete this experience?")) {
                                  setDeletingServiceId(service._id);
                                  try { await deleteService(service._id); } finally { setDeletingServiceId(null); }
                                }
                              }}
                              className="w-7 h-7 rounded-md bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                             >
                               {deletingServiceId === service._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                             </button>
                           </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 🚀 TAB 3: TRUSTED BRANDS / LOGOS ================= */}
      {activeTab === "brands" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Brand Form --- */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              {editBrand ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
              {editBrand ? "Edit Brand" : "Add Brand Logo"}
            </h2>
            
            <form 
              ref={formRef} 
              onSubmit={() => setIsSubmittingBrand(true)}
              action={async (formData) => {
                try {
                  await saveBrand(formData);
                  setEditBrand(null);
                  formRef.current?.reset();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSubmittingBrand(false);
                }
              }} 
              className="space-y-5"
            >
              {editBrand && <input type="hidden" name="id" value={editBrand._id} />}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Company Name</label>
                <input type="text" name="name" defaultValue={editBrand?.name || ""} required key={editBrand?._id + 'name'} placeholder="e.g. Google, Amazon" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Logo Priority / Order</label>
                <input type="number" name="order" defaultValue={editBrand?.order || 0} required key={editBrand?._id + 'order'} placeholder="1, 2, 3..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-colors" />
                <p className="text-[10px] text-gray-500">Lower numbers will show up first (e.g. 1 will be before 2).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Upload Logo (Cloudflare R2)</label>
                {editBrand?.logo && (
                  <div className="mb-2 p-2 bg-gray-100 dark:bg-[#222] rounded-lg inline-block">
                    <img src={editBrand.logo} alt="Brand Logo" className="h-10 w-auto object-contain" />
                  </div>
                )}
                <input type="file" name="logo" accept="image/*" required={!editBrand} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-amber-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-[#222] dark:file:text-gray-300 cursor-pointer" />
              </div>

              <div className="pt-2 flex gap-2">
                <button disabled={isSubmittingBrand} type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                  {isSubmittingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : editBrand ? "Update Brand" : "Save Brand"}
                </button>
                {editBrand && (
                  <button type="button" disabled={isSubmittingBrand} onClick={handleCancelEditBrand} className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- Brands List --- */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-gray-400" /> Trusted Brands List ({brands?.length || 0})
            </h2>
            {(!brands || brands.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm text-gray-500">No brand logos added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {brands.map((brand) => (
                  <div key={brand._id} className={`group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col items-center gap-3 relative overflow-hidden transition-opacity shadow-sm hover:border-amber-500/30 ${deletingBrandId === brand._id ? "opacity-40" : ""}`}>
                    
                    <div className="absolute top-2 left-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{brand.order}
                    </div>

                    <div className="w-full h-16 mt-4 flex items-center justify-center p-2">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain filter dark:brightness-200 contrast-125 grayscale hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 w-full text-center truncate">{brand.name}</h4>
                    
                    <div className="flex items-center gap-2 w-full pt-2 border-t border-gray-200 dark:border-gray-800 justify-center">
                      <button disabled={deletingBrandId !== null} onClick={() => handleEditBrand(brand)} className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button 
                        disabled={deletingBrandId !== null} 
                        onClick={async () => {
                          if(confirm("Delete this brand logo?")) {
                            setDeletingBrandId(brand._id);
                            try { await deleteBrand(brand._id); } finally { setDeletingBrandId(null); }
                          }
                        }} 
                        className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                      >
                        {deletingBrandId === brand._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}