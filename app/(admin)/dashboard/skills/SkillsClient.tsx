"use client";

import { useState, useRef } from "react";
import { saveSkill, deleteSkill, saveService, deleteService } from "./actions";
import { Zap, Plus, Trash2, Code2, Layout, Server, Database, Terminal, Smartphone, Palette, Monitor, Edit2, X, Briefcase, Image as ImageIcon, ChevronDown } from "lucide-react";

import React from "react";
// ... অন্যান্য ইমপোর্ট

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
};

interface Skill {
  _id: string;
  name: string;
  subtitle?: string; // 📌 New Field for UI Subtitle
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
  
  // States for Services (Experience Dropdowns)
  const [editService, setEditService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          onClick={() => { setActiveTab("skills"); handleCancelEditService(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "skills" ? "bg-white dark:bg-[#222] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
        >
          <Zap className="w-4 h-4" /> Technical Skills
        </button>
        <button 
          onClick={() => { setActiveTab("services"); handleCancelEditSkill(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "services" ? "bg-white dark:bg-[#222] text-purple-600 dark:text-purple-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
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
              action={async (formData) => {
                await saveSkill(formData);
                setEditSkill(null);
                formRef.current?.reset();
              }} 
              className="space-y-5"
            >
              {editSkill && <input type="hidden" name="id" value={editSkill._id} />}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Skill Name</label>
                <input type="text" name="name" defaultValue={editSkill?.name || ""} required key={editSkill?._id + 'name'} placeholder="e.g. React.js" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
              </div>

              {/* 📌 New Subtitle Field */}
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
                <select name="icon" required defaultValue={editSkill?.icon || "Code2"} key={editSkill?._id + 'icon'} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                  <option value="Code2">Code / Frontend (React, Next.js)</option>
                  <option value="Layout">UI / Layout (Tailwind, CSS)</option>
                  <option value="Server">Backend / API (Node, Express)</option>
                  <option value="Database">Database (MongoDB, SQL)</option>
                  <option value="Monitor">Web Dev / General</option>
                  <option value="Terminal">DevOps / Tools (Git, Docker)</option>
                  <option value="Smartphone">Mobile App (React Native)</option>
                  <option value="Palette">Design (Figma)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm">
                  {editSkill ? "Update Skill" : "Save Skill"}
                </button>
                {editSkill && (
                  <button type="button" onClick={handleCancelEditSkill} className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
                  <div key={skill._id} className="group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#222] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-800">
                          {iconMap[skill.icon] || <Code2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-black dark:text-white">{skill.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{skill.subtitle || "Skill"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditSkill(skill)} className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <form action={async () => { await deleteSkill(skill._id); }}>
                          <button type="submit" className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </form>
                      </div>
                    </div>
                    {/* Admin preview of 10-segment bar */}
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

      {/* ================= 🚀 TAB 2: EXPERIENCE / SERVICES (Accordion & Image) ================= */}
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
              onSubmit={() => setIsSubmitting(true)}
              action={async (formData) => {
                await saveService(formData);
                setEditService(null);
                setIsSubmitting(false);
                formRef.current?.reset();
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
                <button disabled={isSubmitting} type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-70">
                  {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : editService ? "Update Experience" : "Save Experience"}
                </button>
                {editService && (
                  <button type="button" disabled={isSubmitting} onClick={handleCancelEditService} className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
                  <div key={service._id} className="group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl flex overflow-hidden shadow-sm hover:border-purple-500/30 transition-colors">
                    
                    {/* Image Preview */}
                    <div className="w-1/3 min-w-[120px] bg-gray-200 dark:bg-[#222] relative border-r border-gray-200 dark:border-gray-800">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                      )}
                    </div>
                    
                    {/* Content & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="font-bold text-black dark:text-white flex items-center gap-1.5">{service.title} <ChevronDown className="w-4 h-4 text-gray-400" /></h4>
                           <div className="flex items-center gap-1.5">
                             <button onClick={() => handleEditService(service)} className="w-7 h-7 rounded-md bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                             <form action={async () => { await deleteService(service._id); }}>
                               <button type="submit" className="w-7 h-7 rounded-md bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                             </form>
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