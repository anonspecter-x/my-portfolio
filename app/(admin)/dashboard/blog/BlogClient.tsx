"use client";

import { useState, useRef } from "react";
import { saveBlogPost, deleteBlogPost } from "./actions";
import RichEditor from "@/components/RichEditor";
import { PenTool, Trash2, Edit2, Image as ImageIcon, Search, Loader2, Code, ImagePlus } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  slug: string;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEditClick = (post: Post) => {
    setEditPost(post);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditPost(null);
    setContent("");
    formRef.current?.reset();
  };

  // 📌 ফর্ম সাবমিট হ্যান্ডলার (লোডিং স্টেট সহ)
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await saveBlogPost(formData);
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 ডিলিট হ্যান্ডলার (লোডিং স্টেট সহ)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* ================= 📝 EDITOR FORM ================= */}
      <div className="xl:col-span-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm h-fit">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            {editPost ? <Edit2 className="w-6 h-6 text-blue-500" /> : <PenTool className="w-6 h-6 text-blue-500" />}
            {editPost ? "Edit Article" : "Write New Article"}
          </h2>
          <div className="flex gap-2 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1 bg-gray-100 dark:bg-[#111] px-2 py-1 rounded-md"><Code className="w-3 h-3"/> Code Snippets</span>
            <span className="flex items-center gap-1 bg-gray-100 dark:bg-[#111] px-2 py-1 rounded-md"><ImagePlus className="w-3 h-3"/> Rich Media</span>
          </div>
        </div>
        
        <form 
          ref={formRef}
          action={handleSubmit} 
          className="space-y-6"
        >
          {editPost && <input type="hidden" name="id" value={editPost._id} />}
          <input type="hidden" name="content" value={content} />

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Post Title *</label>
            <input 
              type="text" 
              name="title" 
              required 
              defaultValue={editPost?.title || ""}
              key={editPost ? editPost._id + 'title' : 'new-title'}
              placeholder="e.g. The Ultimate Guide to Next.js 14..." 
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Image</label>
            {editPost?.coverImage && (
              <div className="mb-2">
                <img src={editPost.coverImage} alt="Cover" className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover shadow-sm" />
              </div>
            )}
            <input 
              type="file" 
              name="coverImage" 
              accept="image/*" 
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 cursor-pointer" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Article Content *</label>
            <div className="prose-editor border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <RichEditor value={content} onChange={(val) => setContent(val)} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Use the editor above to add headers, bold text, code blocks, and inline images.</p>
          </div>

          {/* ================= 📌 SEO OPTIMIZATION SECTION ================= */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-5 bg-gray-50/50 dark:bg-[#111]/50 p-4 rounded-xl mt-6">
            <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-blue-500" /> SEO Parameters
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Title</label>
              <input 
                type="text" 
                name="seoTitle" 
                defaultValue={editPost?.seoTitle || ""}
                key={editPost ? editPost._id + 'seoTitle' : 'new-seoTitle'}
                placeholder="Leave blank to default to Post Title" 
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meta Description</label>
              <textarea 
                name="seoDescription" 
                defaultValue={editPost?.seoDescription || ""}
                key={editPost ? editPost._id + 'seoDesc' : 'new-seoDesc'}
                placeholder="Write a compelling snippet for Google (Max 160 characters)" 
                rows={3}
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Keywords</label>
              <input 
                type="text" 
                name="seoKeywords" 
                defaultValue={editPost?.seoKeywords || ""}
                key={editPost ? editPost._id + 'seoKey' : 'new-seoKey'}
                placeholder="e.g. Next.js, React, Tailwind CSS" 
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" 
              />
            </div>
          </div>

          {/* ================= 📌 BUTTONS ================= */}
          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black text-sm font-bold py-3.5 rounded-xl hover:opacity-80 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving..." : (editPost ? "Update Article" : "Publish Article")}
            </button>
            {editPost && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                disabled={isSubmitting}
                className="px-6 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= 📊 PUBLISHED POSTS ================= */}
      <div className="xl:col-span-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
        <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
          <PenTool className="w-5 h-5 text-gray-400" /> Published ({posts.length})
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-500">No articles published yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {posts.map((post) => (
              <div key={post._id} className="group bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-3 flex gap-3 relative overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm">
                
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-800 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-black dark:text-white truncate" title={post.title}>{post.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">/{post.slug}</p>
                </div>
                
                {/* ✏️ Actions */}
                <div className="flex flex-col gap-1.5 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditClick(post)} 
                    className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white active:scale-90 transition-all" 
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white active:scale-90 transition-all disabled:opacity-50" 
                    title="Delete"
                  >
                    {deletingId === post._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}