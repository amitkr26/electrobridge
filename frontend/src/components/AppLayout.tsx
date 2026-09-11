"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/ask-ai", label: "Ask AI" },
    { href: "/resume", label: "Resume Builder" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-emerald-400 tracking-tight">
            ElectroBridge
          </Link>
          <nav className="flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href ? "text-emerald-400" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ElectroBridge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
