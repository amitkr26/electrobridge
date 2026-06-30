"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Target, ExternalLink, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

interface MatchItem {
  id?: string;
  title: string;
  organization: string;
  category: string;
  location: string | null;
  stipend: string | null;
  deadline: string | null;
  eligibility: string | null;
  slug?: string;
  matchScore: number;
  matchReason: string;
}

export default function MatchPage() {
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hasNET, setHasNET] = useState(false);
  const [hasGATE, setHasGATE] = useState(false);
  const [location, setLocation] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const toggleLooking = (cat: string) => {
    setLookingFor((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qualification,
          specialization,
          hasNET,
          hasGATE,
          preferredLocation: location,
          lookingFor: lookingFor.length > 0 ? lookingFor : ["JRF", "PhD"],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Match failed");
      }

      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCats = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-[#00E5FF]" />
          Find My Match
        </h1>
        <p className="text-[#94A3B8] mt-2 text-sm">
          Tell us about your profile and we&apos;ll find the best opportunities for you using AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1A2438] border border-[#1F2937] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#94A3B8] text-xs font-medium mb-1">Highest Qualification</label>
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
              className="w-full bg-[#111827] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none"
            >
              <option value="">Select...</option>
              <option value="MSc Electronics">MSc Electronics</option>
              <option value="MSc Physics">MSc Physics</option>
              <option value="BTech ECE">BTech ECE</option>
              <option value="BTech EE">BTech EE</option>
              <option value="MTech VLSI">MTech VLSI</option>
              <option value="MTech ECE">MTech ECE</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[#94A3B8] text-xs font-medium mb-1">Specialization</label>
            <input
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="thin film, spintronics, VLSI, embedded..."
              className="w-full bg-[#111827] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasNET}
              onChange={(e) => setHasNET(e.target.checked)}
              className="accent-cyan"
            />
            <span className="text-white text-sm">NET Qualified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasGATE}
              onChange={(e) => setHasGATE(e.target.checked)}
              className="accent-cyan"
            />
            <span className="text-white text-sm">GATE Qualified</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-[#94A3B8] text-xs font-medium mb-2">Looking For</label>
          <div className="flex flex-wrap gap-2">
            {filterCats.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleLooking(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  lookingFor.includes(cat)
                    ? "bg-[#00E5FF] text-[#0B1120]"
                    : "bg-[#111827] text-[#94A3B8] border border-gray-700 hover:border-cyan/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[#94A3B8] text-xs font-medium mb-1">Preferred Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Delhi, Bangalore, Hyderabad, International..."
            className="w-full bg-[#111827] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#00E5FF] text-[#0B1120] font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-[#00E5FF]/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Matching...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Find My Match</>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
        </div>
      )}

      {searched && !loading && matches.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#94A3B8] text-lg">No matching opportunities found.</p>
          <p className="text-[#94A3B8] text-sm mt-1">Try broadening your search criteria.</p>
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Your Matches ({matches.length})
          </h2>
          <div className="space-y-4">
            {matches
              .sort((a, b) => b.matchScore - a.matchScore)
              .map((match, idx) => (
                <div
                  key={match.id || idx}
                  className="bg-[#1A2438] border border-[#1F2937] rounded-lg p-4 hover:border-cyan/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">
                          {match.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            match.matchScore >= 80
                              ? "bg-green-900/40 text-green-400"
                              : match.matchScore >= 60
                                ? "bg-yellow-900/40 text-yellow-400"
                                : "bg-[#111827] text-[#94A3B8]"
                          }`}
                        >
                          {match.matchScore}%
                        </span>
                      </div>
                      <p className="text-[#94A3B8] text-xs">
                        {match.organization} {match.stipend ? `• ${match.stipend}` : ""}
                      </p>
                      <p className="text-[#94A3B8] text-xs mt-1">
                        <GraduationCap className="w-3 h-3 inline mr-1" />
                        {match.eligibility || "See details"}
                        {match.location && (
                          <>
                            {" "}• <MapPin className="w-3 h-3 inline mr-1" />
                            {match.location}
                          </>
                        )}
                      </p>
                      <p className="text-[#00E5FF] text-xs mt-2 italic">{match.matchReason}</p>
                    </div>
                    {match.slug && (
                      <Link
                        href={`/opportunities/${match.slug}`}
                        className="flex items-center gap-1 text-[#00E5FF] text-xs font-medium hover:underline flex-shrink-0"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
