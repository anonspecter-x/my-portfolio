"use client";

import { useState, useRef } from "react";
import { saveBlogPost, deleteBlogPost } from "./actions";
import RichEditor from "@/components/RichEditor";
import { PenTool, Trash2, Edit2, Image as ImageIcon, Search } from "lucide-react"; // Search আইকন যুক্ত করা হয়েছে

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  slug: string;
  createdAt: string;
  seoTitle?: string;       // 📌 ইন্টারফেসে যোগ করা হলো
  seoDescription?: string; // 📌 ইন্টারফেসে যোগ করা হলো
  seoKeywords?: string;    // 📌 ইন্টারফেসে যোগ করা হলো
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleEditClick = (post: Post) => {
    setEditPost(post);
    setContent(post.content); // ✏️ এডিটরে আগের কন্টেন্ট লোড করা হচ্ছে
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditPost(null);
    setContent(""); // ❌ এডিটর ক্লিয়ার করা হচ্ছে
    formRef.current?.reset();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* ================= 📝 EDITOR FORM ================= */}
      <div className="xl:col-span-7 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-8">
          {editPost ? <Edit2 className="w-5 h-5 text-blue-500" /> : <PenTool className="w-5 h-5 text-blue-500" />}
          {editPost ? "Edit Article" : "Write New Article"}
        </h2>
        
        <form 
          ref={formRef}
          action={async (formData) => {
            await saveBlogPost(formData);
            handleCancelEdit();
          }} 
          className="space-y-6"
        >
          {editPost && <input type="hidden" name="id" value={editPost._id} />}
          <input type="hidden" name="content" value={content} /> {/* রিচ টেক্সট ডাটা পাস করার জন্য */}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Post Title</label>
            <input 
              type="text" 
              name="title" 
              required 
              defaultValue={editPost?.title || ""}
              key={editPost ? editPost._id + 'title' : 'new-title'}
              placeholder="e.g. How to build a scalable SaaS..." 
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors font-semibold" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Image</label>
            {editPost?.coverImage && (
              <div className="mb-2">
                <img src={editPost.coverImage} alt="Cover" className="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover" />
              </div>
            )}
            <input 
              type="file" 
              name="coverImage" 
              accept="image/*" 
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Article Content</label>
            {/* 📌 Updated Rich Text Editor Wrapper */}
            <div className="prose-editor">
              <RichEditor value={content} onChange={(val) => setContent(val)} />
            </div>
          </div>

          {/* ================= 📌 SEO OPTIMIZATION SECTION ================= */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-5">
            <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-blue-500" /> SEO Optimization
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Title (Optional)</label>
              <input 
                type="text" 
                name="seoTitle" 
                defaultValue={editPost?.seoTitle || ""}
                key={editPost ? editPost._id + 'seoTitle' : 'new-seoTitle'}
                placeholder="Leave blank to use the main Post Title" 
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Description</label>
              <textarea 
                name="seoDescription" 
                defaultValue={editPost?.seoDescription || ""}
                key={editPost ? editPost._id + 'seoDesc' : 'new-seoDesc'}
                placeholder="Short description for Google Search Snippet (Max 160 characters)" 
                rows={3}
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Keywords</label>
              <input 
                type="text" 
                name="seoKeywords" 
                defaultValue={editPost?.seoKeywords || ""}
                key={editPost ? editPost._id + 'seoKey' : 'new-seoKey'}
                placeholder="e.g. Next.js, Web Development, JavaScript" 
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" 
              />
            </div>
          </div>
          {/* ================= END SEO SECTION ================= */}

          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black text-sm font-bold py-3.5 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-sm">
              {editPost ? "Update Post" : "Publish Post"}
            </button>
            {editPost && (
              <button type="button" onClick={handleCancelEdit} className="px-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= 📊 PUBLISHED POSTS ================= */}
      <div className="xl:col-span-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
          <PenTool className="w-5 h-5 text-gray-400" /> Published Articles ({posts.length})
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-500">No articles published yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {posts.map((post) => (
              <div key={post._id} className="group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-4 relative overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-700">
                
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-800 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white truncate" title={post.title}>{post.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1">/{post.slug}</p>
                </div>
                
                {/* ✏️ Actions */}
                <div className="flex flex-col gap-1.5 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(post)} className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <form action={async () => { await deleteBlogPost(post._id); }}>
                    <button type="submit" className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
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