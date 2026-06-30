import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A2438]/50 border-t border-[#1F2937] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-[#00E5FF]" />
              <span className="font-display text-lg font-bold text-white">
                Electro<span className="text-[#00E5FF]">Bridge</span>
              </span>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
              Your gateway to electronics &amp; semiconductor opportunities in India and globally.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[#00E5FF] text-xs font-medium hover:underline"
            >
              Have a suggestion? Let us know →
            </Link>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Opportunities</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/category/jrf" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">JRF Positions</Link>
              <Link href="/category/srf" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">SRF Positions</Link>
              <Link href="/category/phd" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">PhD Opportunities</Link>
              <Link href="/category/govt-job" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Government Jobs</Link>
              <Link href="/category/fellowship" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Fellowships</Link>
              <Link href="/category/private" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Private Sector</Link>
              <Link href="/category/international" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">International</Link>
              <Link href="/opportunities" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">All Opportunities</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Resources</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/resources/jrf-guide" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">JRF Complete Guide</Link>
              <Link href="/resources/phd-guide" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">PhD Admission Guide</Link>
              <Link href="/resources/international-fellowships" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">International Fellowships</Link>
              <Link href="/resources/vlsi-careers" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">VLSI Career Guide</Link>
              <Link href="/resources/net-vs-gate" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">NET vs GATE Guide</Link>
              <Link href="/resources" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">All Resources</Link>
              <Link href="/news" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Tech News</Link>
              <Link href="/organizations" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Organizations</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">About</Link>
              <Link href="/contact" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Contact & Suggestions</Link>
              <Link href="/match" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Find My Match</Link>
              <Link href="/chat" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm">Ask AI</Link>
              <Link href="/opportunities-feed" className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors text-sm" target="_blank">JSON Feed</Link>
            </div>
            <div className="mt-6">
              <h4 className="font-display text-sm font-semibold text-white mb-3">Newsletter</h4>
              <p className="text-[#94A3B8] text-xs mb-3">
                Get weekly updates on new opportunities.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 bg-[#00E5FF] text-[#0B1120] font-semibold rounded-xl px-4 py-2 text-xs hover:bg-[#00E5FF]/90 transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[#1F2937]/50 mt-10 pt-6 text-center">
          <p className="text-[#94A3B8] text-xs">
            &copy; {new Date().getFullYear()} ElectroBridge. Built for the electronics research community.
          </p>
        </div>
      </div>
    </footer>
  );
}
