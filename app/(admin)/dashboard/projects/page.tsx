import { MongoClient } from "mongodb";
import { addProject, deleteProject } from "./actions";
import { Plus, Trash2, ExternalLink, GitBranch, Code2 } from "lucide-react";

// ডাটাবেজ থেকে প্রজেক্টগুলো আনার ফাংশন
async function getProjects() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  // নতুন প্রজেক্টগুলো আগে দেখানোর জন্য sort করা হয়েছে
  const projects = await db.collection("projects").find().sort({ createdAt: -1 }).toArray();
  await client.close();
  
  // MongoDB এর _id অবজেক্টকে স্ট্রিংয়ে কনভার্ট করা হচ্ছে
  return projects.map((p) => ({ ...p, _id: p._id.toString() }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-10 max-w-5xl">
      
      {/* 📌 Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          Project Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add new works to your portfolio or manage existing ones.
        </p>
      </div>

      {/* 📌 Add New Project Form */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" /> Add New Project
        </h2>
        
        {/* ফর্মটি সরাসরি আমাদের তৈরি করা Server Action কে কল করবে */}
        <form action={addProject} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Project Title</label>
              <input type="text" name="title" required placeholder="e.g. OmniStore E-Commerce" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Tech Stack (Comma Separated)</label>
              <input type="text" name="tech" required placeholder="e.g. Next.js, Tailwind, MongoDB" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Short Description</label>
            <textarea name="description" required rows={3} placeholder="What is this project about?" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">Live URL (Optional)</label>
              <input type="url" name="liveLink" placeholder="https://..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-gray-500">GitHub URL (Optional)</label>
              <input type="url" name="githubLink" placeholder="https://github.com/..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-80 transition-opacity w-full md:w-auto">
            Publish Project
          </button>
        </form>
      </div>

      {/* 📌 Existing Projects List */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-gray-500" /> Live Projects ({projects.length})
        </h2>
        
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm p-6 bg-white dark:bg-[#0a0a0a] border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl text-center">
            No projects found. Add your first project above!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div key={project._id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech?.map((t: string, i: number) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#111] flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors border border-gray-200 dark:border-gray-800">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#111] flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors border border-gray-200 dark:border-gray-800">
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                  
                  {/* Delete Form */}
                  <form action={async () => {
                    "use server";
                    await deleteProject(project._id);
                  }}>
                    <button type="submit" className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-100 dark:border-red-900/50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}