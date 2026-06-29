"use client";

import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, Star, MessageSquareQuote, X, CheckCircle2, Clock } from "lucide-react";
import { addTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial } from "./actions";

export interface TestimonialType {
  _id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  priority: number;
  photoUrl: string;
  approved?: boolean;
}

export default function TestimonialManager({ testimonials }: { testimonials: TestimonialType[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  
  const formRef = useRef<HTMLFormElement>(null);

  // 📌 ফিল্টারিং লজিক
  const activeTestimonials = testimonials.filter(t => t.approved !== false);
  const pendingTestimonials = testimonials.filter(t => t.approved === false);

  const editData = activeTestimonials.find((t) => t._id === editingId);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await addTestimonial(formData);
      }
      setEditingId(null);
      formRef.current?.reset();
      setActiveTab("active"); // নতুন যোগ করলে অ্যাক্টিভ ট্যাবে নিয়ে যাবে
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the testimonial.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    try {
      await approveTestimonial(id);
      setActiveTab("active");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 📌 Left Side: Add / Edit Form */}
      <div className="lg:col-span-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />} 
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          {editingId && (
            <button 
              type="button"
              onClick={() => { setEditingId(null); formRef.current?.reset(); }} 
              className="text-xs font-bold text-red-500 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Client Name</label>
            <input type="text" name="name" defaultValue={editData?.name || ""} required placeholder="e.g. John Doe" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Role / Designation</label>
            <input type="text" name="role" defaultValue={editData?.role || ""} placeholder="e.g. CEO at TechCorp" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Review Text</label>
            <textarea name="review" defaultValue={editData?.review || ""} required rows={4} placeholder="What did they say about your work?" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Star Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" defaultValue={editData?.rating || 5} required className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Priority Order</label>
              <input type="number" name="priority" defaultValue={editData?.priority || 0} placeholder="Higher = First" className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Client Photo {editingId && "(Optional)"}</label>
            <input type="file" name="photo" accept="image/*" required={!editingId} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs rounded-xl px-4 py-2 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/20 cursor-pointer" />
            {editData?.photoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img src={editData.photoUrl} alt="Current" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                <span className="text-xs text-gray-500">Current Photo Active</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-3.5 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 mt-4 shadow-sm disabled:opacity-50">
            {isLoading ? "Processing..." : (editingId ? "Update Testimonial" : "Add Testimonial")}
          </button>
        </form>
      </div>

      {/* 📌 Right Side: Live & Pending Lists */}
      <div className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        
        {/* 🗂️ TABS */}
        <div className="flex bg-gray-100 dark:bg-[#111] p-1.5 rounded-2xl w-fit border border-gray-200 dark:border-gray-800 flex-wrap gap-1 mb-6">
          <button 
            onClick={() => { setActiveTab("active"); setEditingId(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "active" ? "bg-white dark:bg-[#222] text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Live ({activeTestimonials.length})
          </button>
          <button 
            onClick={() => { setActiveTab("pending"); setEditingId(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "pending" ? "bg-white dark:bg-[#222] text-amber-600 dark:text-amber-500 shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
          >
            <Clock className="w-4 h-4" /> Pending ({pendingTestimonials.length})
            {pendingTestimonials.length > 0 && (
              <span className="relative flex h-2 w-2 ml-1 -top-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </button>
        </div>
        
        {/* 📜 LIST RENDERER */}
        {activeTab === "active" ? (
          activeTestimonials.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">No live testimonials.</div>
          ) : (
            <div className="space-y-4">
              {activeTestimonials.map((testimonial) => (
                <div key={testimonial._id} className={`flex items-start gap-4 p-4 rounded-xl border ${editingId === testimonial._id ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]"} transition-colors`}>
                  <img src={testimonial.photoUrl || "https://via.placeholder.com/150"} alt={testimonial.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-black dark:text-white">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => setEditingId(testimonial._id)} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={async () => { if(confirm("Delete this review?")) await deleteTestimonial(testimonial._id) }} disabled={isLoading} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-700"}`} />
                      ))}
                      <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full ml-2 font-mono font-medium">Priority: {testimonial.priority}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mt-1">"{testimonial.review}"</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          pendingTestimonials.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">No pending reviews to approve.</div>
          ) : (
            <div className="space-y-4">
              {pendingTestimonials.map((testimonial) => (
                <div key={testimonial._id} className="flex items-start gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 transition-colors">
                  <img src={testimonial.photoUrl || "https://via.placeholder.com/150"} alt={testimonial.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-amber-200 dark:border-amber-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                          {testimonial.name} <span className="text-[9px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">New</span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{testimonial.role}</p>
                      </div>
                      
                      {/* Action Buttons for Pending */}
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => handleApprove(testimonial._id)} 
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button 
                          onClick={async () => { if(confirm("Delete this spam/fake review?")) await deleteTestimonial(testimonial._id) }} 
                          disabled={isLoading}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-700"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">"{testimonial.review}"</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
}