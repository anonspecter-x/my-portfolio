"use client";

import { useState, useRef } from "react";
import { saveCertificate, deleteCertificate } from "./actions";
import { 
  Plus, Trash2, Edit2, Award, ExternalLink, 
  Image as ImageIcon, CheckCircle2, X, Building2, Info, ShieldCheck 
} from "lucide-react";

interface Certificate {
  _id: string;
  title: string;
  issuerName: string;
  issuerLogo?: string;
  certificateImage?: string;
  credentialUrl?: string;
  certificateId?: string; // 📌 নতুন ফিল্ড যুক্ত করা হলো
}

export default function CertificatesClient({ certificates }: { certificates: Certificate[] }) {
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEditClick = (cert: Certificate) => {
    setEditCert(cert);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditCert(null);
    formRef.current?.reset();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* ================= 🛡️ PREMIUM FORM GENERATION ================= */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2.5">
              {editCert ? (
                <><Edit2 className="w-5 h-5 text-blue-500" /> Modify Credential</>
              ) : (
                <><Plus className="w-5 h-5 text-blue-500" /> Register New Certificate</>
              )}
            </h2>
            {editCert && (
              <button 
                onClick={handleCancelEdit} 
                className="text-sm font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>

          <form
            ref={formRef}
            onSubmit={() => setIsSubmitting(true)}
            action={async (formData) => {
              try {
                await saveCertificate(formData);
                handleCancelEdit();
              } catch (error) {
                alert("Operation failed. Check network or configuration.");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-6"
          >
            {editCert && <input type="hidden" name="id" value={editCert._id} />}

            {/* SECTION 1: Certificate Specs */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-2xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> 1. Credential Identity
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Course / Certificate Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={editCert?.title || ""} 
                  key={editCert?._id + 'title'}
                  placeholder="e.g. Advanced Next.js Architecture Masterclass" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors shadow-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Issuing Organization / Authority *</label>
                <input 
                  type="text" 
                  name="issuerName" 
                  required 
                  defaultValue={editCert?.issuerName || ""} 
                  key={editCert?._id + 'issuer'}
                  placeholder="e.g. Udemy, Coursera, Harvard University" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors shadow-sm" 
                />
              </div>
            </div>

            {/* SECTION 2: Media Management */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-2xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> 2. Media Uploads
              </h3>

              {/* Authority Logo Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Issuer Authority Logo</label>
                {editCert?.issuerLogo && (
                  <img src={editCert.issuerLogo} alt="Logo" className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-800 object-contain mb-2 bg-white p-1" />
                )}
                <input 
                  type="file" 
                  name="issuerLogo" 
                  accept="image/*" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 dark:file:bg-[#222] file:text-gray-700 dark:file:text-gray-300" 
                />
              </div>

              {/* Main Certificate Showcase Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Certificate Image (Supports any Aspect Ratio)</label>
                {editCert?.certificateImage && (
                  <img src={editCert.certificateImage} alt="Certificate" className="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-800 object-cover mb-2 shadow-sm" />
                )}
                <input 
                  type="file" 
                  name="certificateImage" 
                  accept="image/*" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 dark:file:bg-[#222] file:text-gray-700 dark:file:text-gray-300" 
                />
              </div>
            </div>

            {/* SECTION 3: External Verification Link & ID */}
            <div className="p-5 bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800/60 rounded-2xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> 3. Verification Routing
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Credential Verification URL (Optional)</label>
                <input 
                  type="url" 
                  name="credentialUrl" 
                  defaultValue={editCert?.credentialUrl || ""} 
                  key={editCert?._id + 'url'}
                  placeholder="https://coursera.org/verify/..." 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors shadow-sm" 
                />
              </div>

              {/* 📌 নতুন Certificate ID ইনপুট ফিল্ড */}
              <div className="space-y-1.5 mt-4">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Certificate ID / No. (If URL is not available)</label>
                <input 
                  type="text" 
                  name="certificateId" 
                  defaultValue={editCert?.certificateId || ""} 
                  key={editCert?._id + 'certId'}
                  placeholder="e.g. UC-12345678" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors shadow-sm" 
                />
              </div>
            </div>

            {/* Safety Notification */}
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs p-4 rounded-xl flex gap-2 items-start shadow-sm">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p><b>R2 Asset Synchronization Active:</b> Modifying or deleting a credential will trigger an automated secure deletion payload over Cloudflare R2 object stores to prevent garbage assets.</p>
            </div>

            {/* SUBMIT TRIGGERS */}
            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-blue-600 text-white text-sm font-bold py-4 rounded-xl hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : editCert ? (
                <><CheckCircle2 className="w-4 h-4" /> Commit Modifications</>
              ) : (
                <><Plus className="w-4 h-4" /> Publish Credential</>
              )}
            </button>

          </form>
        </div>
      </div>

      {/* ================= 🎓 LIVE CREDENTIAL SHOWCASE ================= */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm sticky top-6">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <Building2 className="w-5 h-5 text-gray-400" /> Live Repositories ({certificates.length})
          </h2>

          {certificates.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-[#111]/50">
              <p className="text-sm text-gray-500">No verification licenses uploaded.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar">
              {certificates.map((cert) => (
                <div 
                  key={cert._id} 
                  className="group bg-white dark:bg-[#050505] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-3.5 transition-all hover:border-blue-500/30 hover:shadow-md"
                >
                  <div className="flex gap-4 items-center">
                    {cert.issuerLogo ? (
                      <img src={cert.issuerLogo} alt={cert.issuerName} className="w-12 h-12 rounded-xl object-contain border border-gray-100 dark:border-gray-800 bg-white p-1 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#111] flex items-center justify-center text-gray-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-black dark:text-white truncate" title={cert.title}>{cert.title}</h4>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5 truncate">{cert.issuerName}</p>
                    </div>
                  </div>

                  {/* মেইন সার্টিফিকেটের প্রিভিউ থাম্বনেইল */}
                  {cert.certificateImage && (
                    <div className="w-full aspect-[16/10] bg-gray-150 dark:bg-[#111] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800/80 relative">
                      <img src={cert.certificateImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    <div>
                      {/* 📌 লিংক, আইডি অথবা ইন্টার্নালি ভেরিফাইড ডিসপ্লে করার লজিক */}
                      {cert.credentialUrl ? (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" /> Verify
                        </a>
                      ) : cert.certificateId ? (
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-xs font-semibold">
                          ID: {cert.certificateId}
                        </span>
                      ) : (
                        <span className="text-green-500 flex items-center gap-1 text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Internally Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(cert)} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm" 
                        title="Edit Credential"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <form 
                        action={async () => {
                          if(confirm("Are you sure you want to delete this certificate from DB and Cloudflare R2?")) {
                            await deleteCertificate(cert._id);
                          }
                        }}
                      >
                        <button 
                          type="submit" 
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                          title="Purge Credential"
                        >
                          <Trash2 className="w-4 h-4" />
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