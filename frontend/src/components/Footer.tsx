import Link from "next/link";
import { CircuitBoard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* BRAND COLUMN */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CircuitBoard className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                electrobridge<span className="text-emerald-400">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              AI-powered verified opportunity engine for the semiconductor, VLSI, and electronics engineering community. Real-time ingestion.
            </p>
          </div>

          {/* ENGINE COLUMN */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Platform Engine</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/opportunities" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium">Opportunities Engine</Link>
              <Link href="/news" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">News Feed</Link>
              <Link href="/organizations" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Organizations Directory</Link>
              <Link href="/resources" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Research Resources</Link>
            </div>
          </div>

          {/* OPPORTUNITY CATEGORIES */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Opportunities</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/category/jrf" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">JRF Positions</Link>
              <Link href="/category/srf" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">SRF Positions</Link>
              <Link href="/category/phd" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">PhD Admissions</Link>
              <Link href="/category/govt-job" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Government Jobs</Link>
              <Link href="/category/fellowship" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Fellowships</Link>
              <Link href="/category/private" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Private Sector</Link>
              <Link href="/category/international" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">International</Link>
            </div>
          </div>

          {/* RESOURCES COLUMN */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Company & Resources</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">About electrobridge</Link>
              <Link href="/resources/jrf-guide" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">JRF Complete Guide</Link>
              <Link href="/resources/phd-guide" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">PhD Admission Guide</Link>
              <Link href="/resources/vlsi-careers" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">VLSI Career Guide</Link>
              <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Contact Support</Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} electrobridge. Built for India&apos;s semiconductor revolution.</p>
          <p>Data aggregated from DRDO, ISRO, CSIR, IITs & 100+ organizations</p>
        </div>
      </div>
    </footer>
  );
}
