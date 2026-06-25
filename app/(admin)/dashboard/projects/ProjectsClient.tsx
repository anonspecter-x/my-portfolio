"use client";

import { useState, useRef } from "react";
import { saveProject, deleteProject } from "./actions";
import RichEditor from "@/components/RichEditor";
import { Plus, Trash2, Edit2, Code2, ExternalLink, GitBranch, Image as ImageIcon, CheckCircle2, X, Info } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  tagline?: string; // 📌 New: Short punchy text
  slug?: string;
  description: string;
  content?: string;
  features?: string; // 📌 New: Key Features
  liveLink?: string;
  githubLink?: string;
  image?: string;
  category?: string;
  year?: string;
  clientName?: string;
  role?: string;
  status?: string;
  frontend?: string[];
  backend?: string[];
  tools?: string[];
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEditClick = (project: Project) => {
    setEditProject(project);
    setContent(project.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditProject(null);
    setContent("");
    formRef.current?.reset();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* ================= 📝 PREMIUM PROJECT FORM ================= */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2.5">
              {editProject ? (
                <><Edit2 className="w-5 h-5 text-blue-500" /> Edit Case Study</>
              ) : (
                <><Plus className="w-5 h-5 text-blue-500" /> Draft New Case Study</>
              )}
            </h2>
            {editProject && (
              <button onClick={handleCancelEdit} className="text-sm font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>
          
          <form 
            ref={formRef}
            onSubmit={() => setIsSubmitting(true)}
            action={async (formData) => {
              await saveProject(formData);
              handleCancelEdit();
              setIsSubmitting(false);
            }} 
            className="space-y-8"
          >
            {editProject && <input type="hidden" name="id" value={editProject._id} />}
            <input type="hidden" name="content" value={content} />

            {/* --- SECTION 1: Identity --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">1. Project Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Project Title *</label>
                  <input type="text" name="title" required defaultValue={editProject?.title || ""} key={editProject?._id + 't'} placeholder="e.g. BokBok" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Hero Tagline</label>
                  <input type="text" name="tagline" defaultValue={editProject?.tagline || ""} key={editProject?._id + 'tag'} placeholder="e.g. Real-Time Chat Rooms" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Short Summary (Used in Hero & Cards) *</label>
                <textarea name="description" required defaultValue={editProject?.description || ""} key={editProject?._id + 'desc'} rows={2} placeholder="A frictionless, ephemeral public chat platform..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Hero Cover Image</label>
                {editProject?.image && <img src={editProject.image} alt="Cover" className="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover mb-2 shadow-sm" />}
                <input type="file" name="coverImage" accept="image/*" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-[#222] dark:file:text-gray-300 cursor-pointer" />
              </div>
            </div>

            {/* --- SECTION 2: Meta Info --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">2. General Info</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Client</label>
                  <input type="text" name="clientName" defaultValue={editProject?.clientName || ""} key={editProject?._id + 'client'} placeholder="e.g. Personal Project" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Role</label>
                  <input type="text" name="role" defaultValue={editProject?.role || ""} key={editProject?._id + 'role'} placeholder="e.g. Full-Stack Dev" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Status</label>
                  <input type="text" name="status" defaultValue={editProject?.status || ""} key={editProject?._id + 'status'} placeholder="e.g. Completed" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Category / Year</label>
                  <div className="flex gap-2">
                    <input type="text" name="category" defaultValue={editProject?.category || ""} key={editProject?._id + 'cat'} placeholder="Type" className="w-1/2 bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                    <input type="text" name="year" defaultValue={editProject?.year || ""} key={editProject?._id + 'y'} placeholder="Year" className="w-1/2 bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECTION 3: Tech Stack --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">3. Tech Stack (Badges)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Front-End (Comma separated)</label>
                  <input type="text" name="frontend" defaultValue={editProject?.frontend?.join(", ") || ""} key={editProject?._id + 'fe'} placeholder="React, Tailwind CSS, Vite..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Back-End</label>
                  <input type="text" name="backend" defaultValue={editProject?.backend?.join(", ") || ""} key={editProject?._id + 'be'} placeholder="Express.js, MongoDB, Socket.IO..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Tools</label>
                  <input type="text" name="tools" defaultValue={editProject?.tools?.join(", ") || ""} key={editProject?._id + 'tool'} placeholder="VS Code, Git, Vercel..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* --- SECTION 4: High-Level Features (Optional) --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-3">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">4. Key Features</h3>
               <p className="text-[11px] text-gray-500">List core features here (One per line). This will be mapped as a list in the UI.</p>
               <textarea name="features" defaultValue={editProject?.features || ""} key={editProject?._id + 'feat'} rows={4} placeholder="Real-Time Messaging via Socket.IO&#10;Zero-Account Authentication&#10;TTL Indexes for auto-deletion" className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
            </div>

            {/* --- SECTION 5: Rich Content (The core of the case study) --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">5. Case Study Details (Rich Text)</h3>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs p-3 rounded-lg flex gap-2 items-start mb-4">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Use this editor to write your <b>"Core Problem & Solution"</b>, <b>"Backend Architecture"</b>, and create your <b>API Routes Table</b>. Format with H2/H3 headings for sections.</p>
              </div>

              <div className="bg-white dark:bg-[#050505] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden min-h-[300px]">
                <RichEditor value={content} onChange={setContent} />
              </div>
            </div>

            {/* --- SECTION 6: Links --- */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">6. Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Live Preview URL</label>
                  <input type="url" name="liveLink" defaultValue={editProject?.liveLink || ""} key={editProject?._id + 'live'} placeholder="https://..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Source Code (GitHub)</label>
                  <input type="url" name="githubLink" defaultValue={editProject?.githubLink || ""} key={editProject?._id + 'git'} placeholder="https://github.com/..." className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <div className="pt-4 flex gap-4">
              <button disabled={isSubmitting} type="submit" className="flex-1 bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-70">
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : editProject ? (
                  <><CheckCircle2 className="w-4 h-4" /> Update Case Study</>
                ) : (
                  <><Plus className="w-4 h-4" /> Publish Case Study</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= 📊 PUBLISHED PROJECTS (Compact List) ================= */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit sticky top-6">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <Code2 className="w-5 h-5 text-gray-400" /> Live Projects
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-[#111]/50">
              <p className="text-sm text-gray-500">No case studies added yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {projects.map((project) => (
                <div key={project._id} className="group bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 flex flex-col gap-3 relative transition-all hover:border-blue-500/30 hover:shadow-md">
                  <div className="flex gap-3 items-center">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-12 h-12 rounded-md object-cover border border-gray-100 dark:border-gray-800 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-[#111] flex items-center justify-center text-gray-400 shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-black dark:text-white truncate" title={project.title}>{project.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 truncate">{project.tagline || project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                      {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><GitBranch className="w-4 h-4" /></a>}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditClick(project)} className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <form action={async () => { await deleteProject(project._id); }}>
                        <button type="submit" className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}