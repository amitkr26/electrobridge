"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, GraduationCap, Sparkles, Users, FileText,
  Search, Menu, X, User, LogOut, CircuitBoard
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

const PUBLIC_NAV_ITEMS = [
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/news", label: "News", icon: Sparkles },
  { href: "/organizations", label: "Organizations", icon: Users },
  { href: "/resources", label: "Resources", icon: FileText },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut: signOutUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CircuitBoard className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              electrobridge<span className="text-emerald-400">.</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase -mt-1">
              Verified Opportunity Engine
            </span>
          </div>
        </Link>

        {/* SEARCH BAR (⌘K) */}
        <form onSubmit={doSearch} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search JRF, PhD, DRDO, ISRO, Intel, RTL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-950 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-xs">
            ⌘K
          </kbd>
        </form>

        {/* NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1">
          {PUBLIC_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS - LIVE AGGREGATOR STATUS */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Ingestion Active
          </span>

          {/* MOBILE MENU TRIGGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
          {PUBLIC_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
            >
              <Icon className="w-4 h-4 text-blue-600" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
