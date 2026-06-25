"use client";

import React, { useState, useRef } from "react";
import { saveSkill, deleteSkill, saveService, deleteService } from "./actions";
import { 
  Zap, Plus, Trash2, Edit2, X, Briefcase, 
  Image as ImageIcon, ChevronDown, Loader2, Code2
} from "lucide-react";

// 📌 প্রতিটি টেকনোলজির জন্য ইন্ডিভিজুয়াল অফিশিয়াল ব্র্যান্ড SVG আইকন ম্যাপ
const iconMap: Record<string, React.ReactNode> = {
  React: (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 fill-none stroke-[#61dafb]" strokeWidth="1">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g>
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  ),
  NextJS: (
    <svg viewBox="0 0 180 180" className="w-5 h-5 fill-black dark:fill-white">
      <path d="M148.9 31.3c-16.1-16.1-38.4-26-63.1-26C38.4 5.3 0 43.7 0 91.1s38.4 85.8 85.8 85.8c25.1 0 47.7-10.2 63.9-26.6l-57.2-73.4H80v43.2H67.4V64.8h26.2l55.3 66.5z"/>
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#38bdf8]">
      <path d="M12 6.036c-2.286 0-3.428 1.143-3.428 3.429 0 2.285 1.142 3.428 3.428 3.428 2.286 0 3.428-1.143 3.428-3.428 0-2.286-1.142-3.429-3.428-3.429zm-6.857 6.857c-2.286 0-3.429 1.143-3.429 3.429 0 2.285 1.143 3.428 3.429 3.428 2.286 0 3.428-1.143 3.428-3.428 0-2.286-1.142-3.429-3.428-3.429z"/>
    </svg>
  ),
  JavaScript: (
    <div className="w-5 h-5 bg-[#f7df1e] text-black font-extrabold flex items-center justify-end pr-0.5 pb-0.5 rounded text-[10px] select-none">JS</div>
  ),
  TypeScript: (
    <div className="w-5 h-5 bg-[#3178c6] text-white font-extrabold flex items-center justify-end pr-0.5 pb-0.5 rounded text-[10px] select-none">TS</div>
  ),
  NodeJS: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#339933]">
      <path d="M12 1L3.5 6v12L12 23l8.5-5V6L12 1zm6.5 16.2l-6.5 3.8-6.5-3.8V7.8l6.5-3.8 6.5 3.8v9.4z"/>
    </svg>
  ),
  Express: (
    <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-800 text-black dark:text-white font-bold flex items-center justify-center rounded text-[9px] border border-gray-300 dark:border-zinc-700 select-none">EX</div>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#47A248]">
      <path d="M12 .5c0 0-4.5 4.5-4.5 8.5s3 7 4.5 14.5c1.5-7.5 4.5-10.5 4.5-14.5S12 .5 12 .5z"/>
    </svg>
  ),
  Firebase: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FFCA28]">
      <path d="M3.89 15.75L1.13 4.41c-.16-.64.44-1.18 1.01-.87l10.53 5.67-8.78 6.54zM20.11 15.75l2.76-11.34c.16-.64-.44-1.18-1.01-.87l-10.53 5.67 8.78 6.54zM12 8.73L3.89 15.75l7.53 4.24c.36.2.79.2 1.15 0l7.53-4.24L12 8.73z"/>
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M8 2h4v4H8V2zm0 4h4v4H8V6zm0 4h4v4H8v-4zm0 4a2 2 0 11-4 0 2 2 0 014 0zm4-8h4a2 2 0 11-2 2V6zm0 4h4a2 2 0 11-2 2v-2z" fill="#F24E1E"/>
      <path d="M12 14h4a2 2 0 11-2 2v-2z" fill="#0ACF83"/>
      <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 4a2 2 0 11-4 0 2 2 0 014 0zm0 4V10H4a2 2 0 002 2h2z" fill="#1ABC9C"/>
      <path d="M8 2a2 2 0 012 2v2H6a2 2 0 012-2z" fill="#FF7262"/>
      <path d="M12 2h4a2 2 0 11-2 2V2z" fill="#A259FF"/>
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#F05032]">
      <path d="M23.2 11.4l-10.6-10.6c-.4-.4-1-.4-1.4 0l-2.4 2.4 3.1 3.1c.3-.1.6-.2.9-.2 1.1 0 2 .9 2 2 0 .3-.1.6-.2.9l3.1 3.1c.3-.1.6-.2.9-.2 1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-.3.1-.6.2-.9l-3.1-3.1c-.3.1-.6.2-.9.2-1.1 0-2-.9-2-2 0-.4.1-.7.3-1l-3.1-3.1-4.8 4.8c-.4.4-.4 1 0 1.4l10.6 10.6c.4.4 1 .4 1.4 0l10.6-10.6c.4-.4.4-1 0-1.4z"/>
    </svg>
  ),
  WordPress: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#21759b]">
      <path d="M12.158 12.786l-2.698 7.83c2.147.625 4.423.415 6.425-.595-.11-.014-.21-.035-.296-.035-.744 0-1.266.635-1.266 1.25 0 .074.008.15.02.224-2.22 1.09-4.82 1.114-7.058.067l3.873-11.391zm-4.752.6l-2.62-7.14C2.564 8.783 2.195 11.956 3.738 14.8c.02-.317.065-.635.152-.942.344-1.076.994-2.18 1.554-3.16.59-.99 1.196-1.85 1.196-2.88 0-.4-.08-.774-.216-1.113l2.844 7.741-2.062 5.941zm15.422-4.08c0-1.433-.513-2.427-1.03-3.238-.687-1.041-1.332-1.928-1.332-2.977 0-1.144.87-2.203 2.083-2.203.116 0 .229.008.341.022A11.932 11.932 0 0 0 12 0C6.634 0 2.031 3.518.397 8.441c.176-.007.348-.01.513-.01.996 0 2.545.12 2.545.12.516.03.575.783.058.843 0 0-.52.06-1.098.09l3.483 10.37 2.093-6.284-1.492-4.086c-.52-.03-1.014-.09-1.014-.09-.517-.03-.458-.813.058-.843 0 0 1.58-.12 2.518-.12.996 0 2.546.12 2.546.12.516.03.576.783.059.843 0 0-.52.06-1.1.09l3.453 10.276 1.004-3.26c.465-1.434.808-2.5.808-3.393zm-4.457 4.773c.968-2.88 2.01-5.323 2.01-7.234 0-1.53-.514-2.583-1.053-3.414-.145-.23-.29-.444-.424-.658A11.91 11.91 0 0 1 23.4 12c0 2.768-.94 5.318-2.506 7.34l-2.523-7.261z"/>
    </svg>
  )
};

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

export default function SkillsClient({ skills, services }: { skills: Skill[], services: Service[] }) {
  const [activeTab, setActiveTab] = useState<"skills" | "services">("skills");
  
  // States for Skills
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);
  
  // States for Services
  const [editService, setEditService] = useState<Service | null>(null);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

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

  return (
    <div className="space-y-8">
      
      {/* ================= 🗂️ TABS NAVIGATION ================= */}
      <div className="flex bg-gray-100 dark:bg-[#111] p-1.5 rounded-2xl w-fit border border-gray-200 dark:border-gray-800">
        <button 
          disabled={isSubmittingSkill || isSubmittingService}
          onClick={() => { setActiveTab("skills"); handleCancelEditService(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "skills" ? "bg-white dark:bg-[#222] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"} disabled:opacity-50`}
        >
          <Zap className="w-4 h-4" /> Technical Skills
        </button>
        <button 
          disabled={isSubmittingSkill || isSubmittingService}
          onClick={() => { setActiveTab("services"); handleCancelEditSkill(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "services" ? "bg-white dark:bg-[#222] text-purple-600 dark:text-purple-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"} disabled:opacity-50`}
        >
          <Briefcase className="w-4 h-4" /> Experience & Services
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
                  <option value="React">React.js</option>
                  <option value="NextJS">Next.js</option>
                  <option value="Tailwind">Tailwind CSS</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="NodeJS">Node.js</option>
                  <option value="Express">Express.js</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Firebase">Firebase Auth</option>
                  <option value="Figma">Figma</option>
                  <option value="Git">GIT</option>
                  <option value="WordPress">WordPress</option>
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
              <Zap className="w-5 h-5 text-gray-400" /> Live Skills ({skills.length})
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
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {services.map((service) => (
                  <div key={service._id} className={`group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl flex overflow-hidden shadow-sm hover:border-purple-500/30 transition-colors ${deletingServiceId === service._id ? "opacity-40" : ""}`}>
                    
                    <div className="w-1/3 min-w-[120px] bg-gray-200 dark:bg-[#222] relative border-r border-gray-200 dark:border-gray-800">
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
    </div>
  );
}