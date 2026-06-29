import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-light/50 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan" />
              <span className="font-display text-lg font-bold text-text-primary">
                Electro<span className="text-cyan">Bridge</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              Your gateway to electronics &amp; semiconductor opportunities in India and globally.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-cyan text-xs font-medium hover:underline"
            >
              Have a suggestion? Let us know →
            </Link>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Opportunities</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/category/jrf" className="text-text-muted hover:text-cyan transition-colors text-sm">JRF Positions</Link>
              <Link href="/category/srf" className="text-text-muted hover:text-cyan transition-colors text-sm">SRF Positions</Link>
              <Link href="/category/phd" className="text-text-muted hover:text-cyan transition-colors text-sm">PhD Opportunities</Link>
              <Link href="/category/govt-job" className="text-text-muted hover:text-cyan transition-colors text-sm">Government Jobs</Link>
              <Link href="/category/fellowship" className="text-text-muted hover:text-cyan transition-colors text-sm">Fellowships</Link>
              <Link href="/category/private" className="text-text-muted hover:text-cyan transition-colors text-sm">Private Sector</Link>
              <Link href="/category/international" className="text-text-muted hover:text-cyan transition-colors text-sm">International</Link>
              <Link href="/opportunities" className="text-text-muted hover:text-cyan transition-colors text-sm">All Opportunities</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/resources/jrf-guide" className="text-text-muted hover:text-cyan transition-colors text-sm">JRF Complete Guide</Link>
              <Link href="/resources/phd-guide" className="text-text-muted hover:text-cyan transition-colors text-sm">PhD Admission Guide</Link>
              <Link href="/resources/international-fellowships" className="text-text-muted hover:text-cyan transition-colors text-sm">International Fellowships</Link>
              <Link href="/resources/vlsi-careers" className="text-text-muted hover:text-cyan transition-colors text-sm">VLSI Career Guide</Link>
              <Link href="/resources/net-vs-gate" className="text-text-muted hover:text-cyan transition-colors text-sm">NET vs GATE Guide</Link>
              <Link href="/resources" className="text-text-muted hover:text-cyan transition-colors text-sm">All Resources</Link>
              <Link href="/news" className="text-text-muted hover:text-cyan transition-colors text-sm">Tech News</Link>
              <Link href="/organizations" className="text-text-muted hover:text-cyan transition-colors text-sm">Organizations</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Connect</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-text-muted hover:text-cyan transition-colors text-sm">About</Link>
              <Link href="/contact" className="text-text-muted hover:text-cyan transition-colors text-sm">Contact & Suggestions</Link>
              <Link href="/match" className="text-text-muted hover:text-cyan transition-colors text-sm">Find My Match</Link>
              <Link href="/chat" className="text-text-muted hover:text-cyan transition-colors text-sm">Ask AI</Link>
              <Link href="/opportunities-feed" className="text-text-muted hover:text-cyan transition-colors text-sm" target="_blank">JSON Feed</Link>
            </div>
            <div className="mt-6">
              <h4 className="font-display text-sm font-semibold text-text-primary mb-3">Newsletter</h4>
              <p className="text-text-muted text-xs mb-3">
                Get weekly updates on new opportunities.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 bg-cyan text-navy font-semibold rounded-lg px-4 py-2 text-xs hover:bg-cyan/90 transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800/50 mt-10 pt-6 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} ElectroBridge. Built for the electronics research community.
          </p>
        </div>
      </div>
    </footer>
  );
}
