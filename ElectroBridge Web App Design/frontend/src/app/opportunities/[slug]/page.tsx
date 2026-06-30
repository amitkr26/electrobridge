'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ChevronRight, MapPin, Zap, Clock, ExternalLink, Bookmark, Share2,
  Flag, Bot, CheckCircle, Award, ThumbsUp, MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AvatarCircle } from '@/components/AvatarCircle';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { OPPORTUNITIES } from '@/data/opportunities';

const sectionData = [
  {
    title: 'Description',
    content: 'Join Intel India R&D\'s AI Architecture team to research next-generation neural processing units. You will collaborate with global hardware teams on micro-architectural innovations for inference acceleration.\n\nThis position offers exposure to the full AI chip design pipeline — from workload characterization to RTL implementation and silicon validation. You will use industry-standard simulation and modeling tools to evaluate architectural trade-offs.',
  },
  {
    title: 'Eligibility',
    content: '• Final year M.Tech or registered PhD students in ECE, EEE, or CSE\n• Strong proficiency in SystemVerilog or Verilog\n• Knowledge of computer architecture fundamentals (pipeline, cache, memory hierarchy)\n• Familiarity with ML frameworks (PyTorch/TensorFlow) preferred\n• CGPA ≥ 8.0 from a recognized institute',
  },
  {
    title: 'Required Documents',
    content: '1. Updated CV/Resume (PDF, max 2MB)\n2. Statement of Purpose (500 words)\n3. Transcripts from current institution\n4. One letter of recommendation from advisor/professor\n5. Sample project report or published paper (optional but preferred)',
  },
  {
    title: 'Application Steps',
    content: 'Step 1: Register on the Intel University Program portal\nStep 2: Complete the online technical assessment (SystemVerilog + Architecture MCQs — 60 min)\nStep 3: Submit all required documents through the portal\nStep 4: Shortlisted candidates will be invited for a 45-min video interview\nStep 5: Offer letters sent within 7 business days of final interview',
  },
];

const quickFacts = [
  { label: 'Org Type', val: 'Private R&D' },
  { label: 'Position Type', val: 'Research Internship' },
  { label: 'Duration', val: '6 months' },
  { label: 'Location', val: 'Hyderabad, WFO' },
  { label: 'Age Limit', val: 'No bar' },
  { label: 'GATE Required', val: 'Preferred, not mandatory' },
];

const aiInsights = [
  { icon: '🎯', title: 'Match Score', val: '87%', sub: 'Based on your profile skills and experience' },
  { icon: '📈', title: 'Competition Level', val: 'High', sub: '~340 applicants expected based on historical data' },
  { icon: '⚡', title: 'Key Skill Gap', val: 'Arch Sim', sub: 'Add gem5 or MachSuite to your resume to improve match' },
];

export default function OpportunityDetailPage() {
  const [saved, setSaved] = useState(false);
  const params = useParams();
  const slug = (params.slug as string) || '3';
  const opp = OPPORTUNITIES.find((o) => o.id === Number(slug)) || OPPORTUNITIES[2];
  const daysLeft = 64;

  if (!opp && !OPPORTUNITIES[2]) notFound();

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white mb-6 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to Opportunities
        </Link>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-7 mb-5">
              <div className="flex items-start gap-4 mb-5">
                <AvatarCircle initials={opp.logo} color={opp.color} />
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{opp.title}</h1>
                  <p className="text-[#94A3B8]">{opp.org}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <VerifiedBadge />
                    <Badge variant="default">{opp.type}</Badge>
                    <Badge variant="gray">{opp.degree}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-[#94A3B8] pb-5 border-b border-[#1F2937]">
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#00E5FF]" />{opp.location}</span>
                <span className="flex items-center gap-1.5"><Zap size={13} className="text-[#00E5FF]" />{opp.stipend}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#F59E0B]" /> Deadline: {opp.deadline} ({daysLeft} days)</span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[#94A3B8]">Deadline in</p>
                  <p className="text-xs text-[#F59E0B] font-semibold">{daysLeft} days</p>
                </div>
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full" style={{ width: `${(1 - daysLeft / 90) * 100}%` }} />
                </div>
              </div>
            </div>

            {sectionData.map((s) => (
              <div key={s.title} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 rounded-full bg-[#00E5FF]" /> {s.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#00E5FF]/5 to-[#3B82F6]/5 border border-[#00E5FF]/15 rounded-2xl p-6 mb-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bot size={16} className="text-[#00E5FF]" /> AI Insights
              </h3>
              <div className="space-y-3">
                {aiInsights.map((i) => (
                  <div key={i.title} className="flex items-start gap-3 p-3 bg-[#0B1120]/50 rounded-xl border border-[#1F2937]">
                    <span className="text-lg">{i.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{i.title}: <span className="text-[#00E5FF]">{i.val}</span></p>
                      <p className="text-xs text-[#94A3B8]">{i.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <a href="#" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_24px_rgba(0,229,255,0.2)] mb-3">
                  <ExternalLink size={15} /> Apply Now
                </a>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(!saved)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${saved ? 'bg-[#00E5FF]/10 border-[#00E5FF]/25 text-[#00E5FF]' : 'border-[#1F2937] text-[#94A3B8] hover:text-white'}`}>
                    <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#1F2937] text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
                    <Share2 size={14} /> Share
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#EF4444] transition-colors mt-2">
                  <Flag size={12} /> Report Issue
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-4">Quick Facts</h4>
                <div className="space-y-3">
                  {quickFacts.map((f) => (
                    <div key={f.label} className="flex justify-between text-sm">
                      <span className="text-[#94A3B8]">{f.label}</span>
                      <span className="text-white font-medium">{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3">Related Opportunities</h4>
                <div className="space-y-3">
                  {OPPORTUNITIES.filter((o) => o.id !== opp.id).slice(0, 3).map((o) => (
                    <Link key={o.id} href={`/opportunities/${o.id}`} className="flex items-start gap-2 group">
                      <AvatarCircle initials={o.logo} color={o.color} />
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">{o.title}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{o.daysLeft}d left · {o.stipend}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
