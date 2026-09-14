"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight, X } from "lucide-react";
import type { ResumeData, CertItem, PubItem, LangItem, VolItem, AwardItem } from "../../types";

interface ExtrasSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";
const PROFICIENCY_OPTIONS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] as const;

function emptyCert(): CertItem { return { id: crypto.randomUUID(), name: "", issuer: "", year: "" }; }
function emptyPub(): PubItem { return { id: crypto.randomUUID(), title: "", venue: "", year: "", doi: "" }; }
function emptyLang(): LangItem { return { id: crypto.randomUUID(), name: "", proficiency: "Intermediate" }; }
function emptyVol(): VolItem { return { id: crypto.randomUUID(), role: "", org: "", period: "", detail: "" }; }
function emptyAward(): AwardItem { return { id: crypto.randomUUID(), name: "", issuer: "", year: "" }; }

export default function ExtrasSection({ data, onChange }: ExtrasSectionProps) {
  const [expandedCertIndex, setExpandedCertIndex] = useState<number | null>(null);
  const [expandedPubIndex, setExpandedPubIndex] = useState<number | null>(null);
  const [expandedVolIndex, setExpandedVolIndex] = useState<number | null>(null);
  const [newInterest, setNewInterest] = useState("");

  // ── Certifications ──
  const updateCert = (index: number, field: keyof CertItem, value: string) => {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, certifications: updated });
  };
  const addCert = () => { const u = [...data.certifications, emptyCert()]; onChange({ ...data, certifications: u }); setExpandedCertIndex(u.length - 1); };
  const removeCert = (index: number) => { onChange({ ...data, certifications: data.certifications.filter((_, i) => i !== index) }); setExpandedCertIndex(null); };

  // ── Publications ──
  const updatePub = (index: number, field: keyof PubItem, value: string) => {
    const updated = [...data.publications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, publications: updated });
  };
  const addPub = () => { const u = [...data.publications, emptyPub()]; onChange({ ...data, publications: u }); setExpandedPubIndex(u.length - 1); };
  const removePub = (index: number) => { onChange({ ...data, publications: data.publications.filter((_, i) => i !== index) }); setExpandedPubIndex(null); };

  // ── Languages ──
  const updateLang = (index: number, field: keyof LangItem, value: string) => {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, languages: updated });
  };
  const addLang = () => { onChange({ ...data, languages: [...data.languages, emptyLang()] }); };
  const removeLang = (index: number) => { onChange({ ...data, languages: data.languages.filter((_, i) => i !== index) }); };

  // ── Volunteer ──
  const updateVol = (index: number, field: keyof VolItem, value: string) => {
    const updated = [...data.volunteer];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, volunteer: updated });
  };
  const addVol = () => { const u = [...data.volunteer, emptyVol()]; onChange({ ...data, volunteer: u }); setExpandedVolIndex(u.length - 1); };
  const removeVol = (index: number) => { onChange({ ...data, volunteer: data.volunteer.filter((_, i) => i !== index) }); setExpandedVolIndex(null); };

  // ── Awards ──
  const updateAward = (index: number, field: keyof AwardItem, value: string) => {
    const updated = [...data.awards];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, awards: updated });
  };
  const addAward = () => { onChange({ ...data, awards: [...data.awards, emptyAward()] }); };
  const removeAward = (index: number) => { onChange({ ...data, awards: data.awards.filter((_, i) => i !== index) }); };

  // ── Interests ──
  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || data.interests.includes(trimmed)) { setNewInterest(""); return; }
    onChange({ ...data, interests: [...data.interests, trimmed] });
    setNewInterest("");
  };
  const removeInterest = (index: number) => { onChange({ ...data, interests: data.interests.filter((_, i) => i !== index) }); };

  return (
    <div className="space-y-6">

      {/* ── Certifications ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
          {data.certifications.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.certifications.length}</span>}
        </div>
        <div className="space-y-2">
          {data.certifications.map((item, index) => {
            const isExpanded = expandedCertIndex === index;
            return (
              <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition" onClick={() => setExpandedCertIndex(isExpanded ? null : index)}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical size={14} className="text-slate-300 p-1 shrink-0" />
                    <span className="text-slate-400 shrink-0">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate block">{item.name || "Untitled Certification"}</span>
                      {item.year && <span className="text-xs text-slate-500 truncate block">{item.year}</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeCert(index); }} className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0" aria-label="Remove certification"><Trash2 size={14} /></button>
                </div>
                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>Name</label><input type="text" className={inputClass} value={item.name} onChange={(e) => updateCert(index, "name", e.target.value)} placeholder="AWS Solutions Architect" /></div>
                      <div><label className={labelClass}>Issuer</label><input type="text" className={inputClass} value={item.issuer ?? ""} onChange={(e) => updateCert(index, "issuer", e.target.value)} placeholder="Amazon Web Services" /></div>
                    </div>
                    <div><label className={labelClass}>Year</label><input type="text" className={inputClass} value={item.year ?? ""} onChange={(e) => updateCert(index, "year", e.target.value)} placeholder="2024" /></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addCert} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"><Plus size={14} />Add Certification</button>
      </div>

      {/* ── Publications ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Publications</h3>
          {data.publications.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.publications.length}</span>}
        </div>
        <div className="space-y-2">
          {data.publications.map((item, index) => {
            const isExpanded = expandedPubIndex === index;
            return (
              <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition" onClick={() => setExpandedPubIndex(isExpanded ? null : index)}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical size={14} className="text-slate-300 p-1 shrink-0" />
                    <span className="text-slate-400 shrink-0">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate block">{item.title || "Untitled Publication"}</span>
                      {item.venue && <span className="text-xs text-slate-500 truncate block">{item.venue}</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removePub(index); }} className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0" aria-label="Remove publication"><Trash2 size={14} /></button>
                </div>
                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div><label className={labelClass}>Title</label><input type="text" className={inputClass} value={item.title} onChange={(e) => updatePub(index, "title", e.target.value)} placeholder="Paper title" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>Venue</label><input type="text" className={inputClass} value={item.venue ?? ""} onChange={(e) => updatePub(index, "venue", e.target.value)} placeholder="IEEE DAC 2024" /></div>
                      <div><label className={labelClass}>Year</label><input type="text" className={inputClass} value={item.year ?? ""} onChange={(e) => updatePub(index, "year", e.target.value)} placeholder="2024" /></div>
                    </div>
                    <div><label className={labelClass}>DOI</label><input type="text" className={inputClass} value={item.doi ?? ""} onChange={(e) => updatePub(index, "doi", e.target.value)} placeholder="10.1109/EXAMPLE.2024.12345" /></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addPub} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"><Plus size={14} />Add Publication</button>
      </div>

      {/* ── Languages ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Languages</h3>
          {data.languages.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.languages.length}</span>}
        </div>
        <div className="space-y-2">
          {data.languages.map((item, index) => (
            <div key={item.id ?? index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
              <GripVertical size={14} className="text-slate-300 shrink-0" />
              <input type="text" className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-900 px-1" value={item.name} onChange={(e) => updateLang(index, "name", e.target.value)} placeholder="Language" />
              <select className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={item.proficiency} onChange={(e) => updateLang(index, "proficiency", e.target.value)}>
                {PROFICIENCY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={() => removeLang(index)} className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0" aria-label="Remove language"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={addLang} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"><Plus size={14} />Add Language</button>
      </div>

      {/* ── Volunteer Experience ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Volunteer Experience</h3>
          {data.volunteer.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.volunteer.length}</span>}
        </div>
        <div className="space-y-2">
          {data.volunteer.map((item, index) => {
            const isExpanded = expandedVolIndex === index;
            return (
              <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition" onClick={() => setExpandedVolIndex(isExpanded ? null : index)}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical size={14} className="text-slate-300 p-1 shrink-0" />
                    <span className="text-slate-400 shrink-0">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate block">{item.role || "Untitled Role"}</span>
                      <span className="text-xs text-slate-500 truncate block">{item.org}{item.period ? ` · ${item.period}` : ""}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeVol(index); }} className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0" aria-label="Remove volunteer experience"><Trash2 size={14} /></button>
                </div>
                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>Role</label><input type="text" className={inputClass} value={item.role} onChange={(e) => updateVol(index, "role", e.target.value)} placeholder="Volunteer Coordinator" /></div>
                      <div><label className={labelClass}>Organization</label><input type="text" className={inputClass} value={item.org} onChange={(e) => updateVol(index, "org", e.target.value)} placeholder="Organization name" /></div>
                    </div>
                    <div><label className={labelClass}>Period</label><input type="text" className={inputClass} value={item.period} onChange={(e) => updateVol(index, "period", e.target.value)} placeholder="Jan 2023 - Dec 2023" /></div>
                    <div><label className={labelClass}>Description</label><textarea className={inputClass} rows={3} value={item.detail} onChange={(e) => updateVol(index, "detail", e.target.value)} placeholder="Describe your volunteer work..." /></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addVol} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"><Plus size={14} />Add Volunteer Experience</button>
      </div>

      {/* ── Awards ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Awards & Achievements</h3>
          {data.awards.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.awards.length}</span>}
        </div>
        <div className="space-y-2">
          {data.awards.map((item, index) => (
            <div key={item.id ?? index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
              <GripVertical size={14} className="text-slate-300 shrink-0" />
              <input type="text" className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-900 px-1" value={item.name} onChange={(e) => updateAward(index, "name", e.target.value)} placeholder="Award name" />
              <input type="text" className="w-28 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs text-slate-500 px-1" value={item.issuer ?? ""} onChange={(e) => updateAward(index, "issuer", e.target.value)} placeholder="Issuer" />
              <input type="text" className="w-16 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs text-slate-500 px-1" value={item.year ?? ""} onChange={(e) => updateAward(index, "year", e.target.value)} placeholder="Year" />
              <button onClick={() => removeAward(index)} className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0" aria-label="Remove award"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={addAward} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"><Plus size={14} />Add Award</button>
      </div>

      {/* ── Interests ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Interests</h3>
          {data.interests.length > 0 && <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{data.interests.length}</span>}
        </div>
        {data.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.interests.map((interest, index) => (
              <span key={`${interest}-${index}`} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1">
                {interest}
                <button onClick={() => removeInterest(index)} className="text-blue-400 hover:text-red-500 transition ml-0.5" aria-label="Remove interest"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input type="text" className={inputClass} value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); } }} placeholder="e.g. Open-source hardware, Hiking, Photography..." />
          <button onClick={addInterest} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0"><Plus size={14} />Add</button>
        </div>
      </div>
    </div>
  );
}
