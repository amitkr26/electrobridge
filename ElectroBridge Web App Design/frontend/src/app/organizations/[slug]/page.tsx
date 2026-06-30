'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Calendar } from 'lucide-react';
import { OPPORTUNITIES } from '@/data/opportunities';
import { Badge } from '@/components/ui/badge';
import { OpportunityCard } from '@/components/OpportunityCard';

export default function OrganizationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const orgName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const orgOpps = OPPORTUNITIES.filter((o) => o.org.toLowerCase().includes(orgName.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <Link href="/organizations" className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> All Organizations
        </Link>

        <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] text-lg font-bold shrink-0">
              {orgName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{orgName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1"><Building2 size={12} /> {orgOpps.length} active opportunities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgOpps.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
          {orgOpps.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <Building2 size={40} className="text-[#1F2937] mx-auto mb-3" />
              <p className="text-[#94A3B8] text-sm">No opportunities found for this organization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}