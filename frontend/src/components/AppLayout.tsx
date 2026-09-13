"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MessageSquare,
  LayoutTemplate,
  BarChart3,
  BookOpen,
  Briefcase,
  Pen,
  X,
  Linkedin,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

/* ── Navigation ──────────────────────────────────────────────────────────── */

const navLinks = [
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/cover-letter", label: "Cover Letter", icon: Pen },
  { href: "/ask-ai", label: "AI Career", icon: MessageSquare },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/resume-review", label: "ATS Score", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

/* ── Footer link columns ─────────────────────────────────────────────────── */

const footerProduct = [
  { href: "/resume", label: "Resume Builder" },
  { href: "/templates", label: "Resume Templates" },
  { href: "/ask-ai", label: "AI Career Assistant" },
  { href: "/resume-review", label: "ATS Score Checker" },
  { href: "/cover-letter", label: "Cover Letter Builder" },
];

const footerResources = [
  { href: "/resources", label: "Career Resources" },
  { href: "/resources", label: "Resume Writing Guide" },
  { href: "/resources", label: "ATS Optimization Guide" },
  { href: "/ask-ai", label: "Interview Preparation" },
  { href: "/templates", label: "Template Gallery" },
];

const footerCompany = [
  { href: "/about", label: "About ElectroBridge" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "Privacy Policy" },
  { href: "/about", label: "Terms of Service" },
];

const footerEcosystem = [
  { href: "https://berojgardegreewala.vercel.app", label: "BerojgarDegreeWala", desc: "Opportunities & Jobs" },
  { href: "https://siliconpath.vercel.app", label: "SiliconPath", desc: "Free VLSI Learning" },
];

/* ── Social profiles ─────────────────────────────────────────────────────── */

const socialLinks = [
  { href: "https://www.linkedin.com/in/rankrseo/", label: "LinkedIn", icon: Linkedin },
  { href: "https://www.instagram.com/rankrseo", label: "Instagram (@rankrseo)", icon: Instagram },
  { href: "https://www.instagram.com/berojgaracademy/", label: "Instagram (@berojgaracademy)", icon: Instagram },
  { href: "https://www.youtube.com/@rankrseo", label: "YouTube", icon: Youtube },
  { href: "https://x.com/rankrseo", label: "X (Twitter)", icon: XIcon },
  { href: "https://www.facebook.com/RankrSEOs", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.reddit.com/user/rankrseo/", label: "Reddit", icon: RedditIcon },
  { href: "https://in.pinterest.com/rankrseo/", label: "Pinterest", icon: PinterestIcon },
];

/* ── Inline SVG icon components (lucide-react doesn't ship all of these) ─── */

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.635 24 24 18.633 24 12.013 24 5.393 18.635 0 12.017 0z" />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gradient-primary tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm text-[10px] font-black">EB</div>
            <span className="hidden sm:inline">ElectroBridge</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200">
              <span className="text-lg font-bold text-gradient-primary tracking-tight">ElectroBridge</span>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    pathname === href
                      ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Top row: brand + columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gradient-primary tracking-tight">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm text-[10px] font-black">EB</div>
                ElectroBridge
              </Link>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-xs">
                Build your resume. Find better jobs. Get hired. A free career platform powered by AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2">
                {footerProduct.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2">
                {footerResources.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2">
                {footerCompany.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ecosystem */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Ecosystem</h4>
              <ul className="space-y-2">
                {footerEcosystem.map(({ href, label, desc }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1 text-slate-500 text-sm hover:text-blue-600 transition-colors">
                      {label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-slate-400 text-xs">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Follow Us</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Career resources, resume tips, VLSI content and community updates.
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title={label}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-400 text-xs">
              100% Free &bull; No Login Required &bull; Built for Engineers
            </p>
            <p className="text-slate-400 text-xs">
              &copy; {new Date().getFullYear()} ElectroBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
