"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MessageSquare,
  LayoutTemplate,
  BarChart3,
  BookOpen,
  Info,
  Pen,
  Mail,
} from "lucide-react";

const navLinks = [
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/cover-letter", label: "Cover Letter", icon: Pen },
  { href: "/ask-ai", label: "AI Assistant", icon: MessageSquare },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/resume-review", label: "ATS Score", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

const productLinks = [
  { href: "/resume", label: "Resume Builder" },
  { href: "/cover-letter", label: "Cover Letter Builder" },
  { href: "/ask-ai", label: "AI Assistant" },
  { href: "/templates", label: "Templates" },
  { href: "/resume-review", label: "ATS Score" },
];

const resourceLinks = [
  { href: "/resources", label: "Career Resources" },
  { href: "/ask-ai", label: "Interview Tips" },
  { href: "/resources", label: "VLSI Career Guide" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gradient-primary tracking-tight">
            ElectroBridge
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-blue-600 bg-blue-50"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
              <Link href="/" className="text-lg font-bold text-gradient-primary tracking-tight">
                ElectroBridge
              </Link>
              <p className="mt-3 text-text-muted text-sm leading-relaxed">
                AI-powered career tools for semiconductor engineers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {productLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-text-muted text-sm hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {resourceLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-text-muted text-sm hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {companyLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-text-muted text-sm hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-4">Our Ecosystem</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://berojgardegreewala.vercel.app"
                    target="_blank"
                    rel="noopener"
                    className="text-text-muted text-sm hover:text-blue-600 transition-colors"
                  >
                    BerojgarDegreeWala &mdash; Opportunities &amp; Career Hub
                  </a>
                </li>
                <li>
                  <a
                    href="https://siliconpath.vercel.app"
                    target="_blank"
                    rel="noopener"
                    className="text-text-muted text-sm hover:text-blue-600 transition-colors"
                  >
                    SiliconPath &mdash; Free VLSI Learning Platform
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-xs">
              100% Free &bull; No Login Required &bull; Built for VLSI Engineers
            </p>
            <p className="text-text-muted text-xs">
              &copy; {new Date().getFullYear()} ElectroBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
