"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { ResumeData, CertItem, PubItem } from "../../types";

interface ExtrasSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

function emptyCert(): CertItem {
  return { id: crypto.randomUUID(), name: "", issuer: "", year: "" };
}

function emptyPub(): PubItem {
  return { id: crypto.randomUUID(), title: "", venue: "", year: "", doi: "" };
}

export default function ExtrasSection({ data, onChange }: ExtrasSectionProps) {
  const [expandedCertIndex, setExpandedCertIndex] = useState<number | null>(null);
  const [expandedPubIndex, setExpandedPubIndex] = useState<number | null>(null);

  const updateCert = (index: number, field: keyof CertItem, value: string) => {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, certifications: updated });
  };

  const addCert = () => {
    const updated = [...data.certifications, emptyCert()];
    onChange({ ...data, certifications: updated });
    setExpandedCertIndex(updated.length - 1);
  };

  const removeCert = (index: number) => {
    const updated = data.certifications.filter((_, i) => i !== index);
    onChange({ ...data, certifications: updated });
    setExpandedCertIndex(null);
  };

  const updatePub = (index: number, field: keyof PubItem, value: string) => {
    const updated = [...data.publications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, publications: updated });
  };

  const addPub = () => {
    const updated = [...data.publications, emptyPub()];
    onChange({ ...data, publications: updated });
    setExpandedPubIndex(updated.length - 1);
  };

  const removePub = (index: number) => {
    const updated = data.publications.filter((_, i) => i !== index);
    onChange({ ...data, publications: updated });
    setExpandedPubIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Certifications */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
          {data.certifications.length > 0 && (
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
              {data.certifications.length}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {data.certifications.map((item, index) => {
            const isExpanded = expandedCertIndex === index;
            return (
              <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => setExpandedCertIndex(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical size={14} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 shrink-0" />
                    <span className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate block">
                        {item.name || "Untitled Certification"}
                      </span>
                      {item.year && (
                        <span className="text-xs text-slate-500 truncate block">{item.year}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeCert(index); }}
                    className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Name</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={item.name}
                          onChange={(e) => updateCert(index, "name", e.target.value)}
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Issuer</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={item.issuer ?? ""}
                          onChange={(e) => updateCert(index, "issuer", e.target.value)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.year ?? ""}
                        onChange={(e) => updateCert(index, "year", e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={addCert}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <Plus size={14} />
          Add Certification
        </button>
      </div>

      {/* Publications */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Publications</h3>
          {data.publications.length > 0 && (
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
              {data.publications.length}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {data.publications.map((item, index) => {
            const isExpanded = expandedPubIndex === index;
            return (
              <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => setExpandedPubIndex(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical size={14} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 shrink-0" />
                    <span className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate block">
                        {item.title || "Untitled Publication"}
                      </span>
                      {item.venue && (
                        <span className="text-xs text-slate-500 truncate block">{item.venue}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePub(index); }}
                    className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.title}
                        onChange={(e) => updatePub(index, "title", e.target.value)}
                        placeholder="Paper title"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Venue</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={item.venue ?? ""}
                          onChange={(e) => updatePub(index, "venue", e.target.value)}
                          placeholder="IEEE DAC 2024"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={item.year ?? ""}
                          onChange={(e) => updatePub(index, "year", e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>DOI</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.doi ?? ""}
                        onChange={(e) => updatePub(index, "doi", e.target.value)}
                        placeholder="10.1109/EXAMPLE.2024.12345"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={addPub}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
        >
          <Plus size={14} />
          Add Publication
        </button>
      </div>
    </div>
  );
}
