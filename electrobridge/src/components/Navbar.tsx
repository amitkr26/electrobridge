"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Zap, ChevronDown, ChevronRight, User, LogOut, LayoutDashboard,
  Search, Menu, X, Briefcase, BookOpen, GraduationCap, BookMarked,
  Globe, Sparkles, Network, FileText, ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const OPPORTUNITY_LINKS = [
  { href: "/category/jrf", label: "JRF Positions" },
  { href: "/category/srf", label: "SRF Positions" },
  { href: "/category/phd", label: "PhD Opportunities" },
  { href: "/category/govt-job", label: "Government Jobs" },
  { href: "/category/fellowship", label: "Fellowships" },
  { href: "/category/private", label: "Private Sector" },
  { href: "/category/international", label: "International" },
];

const RESOURCE_LINKS = [
  { href: "/resources/jrf-guide", label: "JRF Complete Guide" },
  { href: "/resources/phd-guide", label: "PhD Admission Guide" },
  { href: "/resources/international-fellowships", label: "International Fellowships" },
  { href: "/resources/vlsi-careers", label: "VLSI Career Guide" },
  { href: "/resources/net-vs-gate", label: "NET vs GATE" },
];

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Opportunities", dropdown: OPPORTUNITY_LINKS },
  { href: "/resources", label: "Resources", dropdown: RESOURCE_LINKS },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const ddTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const showDD = (name: string) => {
    if (ddTimer.current) clearTimeout(ddTimer.current);
    setOpenDropdown(name);
  };

  const hideDD = (name: string) => {
    ddTimer.current = setTimeout(() => {
      setOpenDropdown((prev) => (prev === name ? null : prev));
    }, 200);
  };

  const toggleDD = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
      if (ddTimer.current) clearTimeout(ddTimer.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchRef.current?.blur();
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = (name?: string | null, email?: string) => {
    if (name) return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
    return email?.substring(0, 2).toUpperCase() ?? "U";
  };

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const isAdmin = user?.email === "admin@electrobridge.tech" || user?.user_metadata?.role === "admin";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/opportunities") return pathname.startsWith("/opportunities") || pathname.startsWith("/category");
    if (href === "/resources") return pathname.startsWith("/resources");
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_0_rgba(34,211,238,0.04)]"
          : "bg-bg-primary/60 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 group-hover:bg-accent/15 transition-all">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-text-primary">
                  Electro<span className="text-accent">Bridge</span>
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const isOpen = openDropdown === item.label;

                  if (item.dropdown) {
                    return (
                      <div
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => showDD(item.label)}
                        onMouseLeave={() => hideDD(item.label)}
                      >
                        <button
                          onClick={() => toggleDD(item.label)}
                          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                            active
                              ? "text-accent bg-accent/8"
                              : isOpen
                                ? "text-text-primary bg-surface-elevated"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                          }`}
                        >
                          {item.label}
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div
                            className="absolute top-full left-0 mt-1.5 w-52 bg-surface border border-border rounded-xl shadow-card-dark py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 origin-top-left"
                            onMouseEnter={() => showDD(item.label)}
                            onMouseLeave={() => hideDD(item.label)}
                          >
                            {item.dropdown.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center justify-between px-3.5 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors rounded-md mx-1"
                              >
                                <span>{link.label}</span>
                                <ChevronRight className="w-3 h-3 text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        active
                          ? "text-accent bg-accent/8"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <form onSubmit={doSearch} className="relative w-full group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  searchFocused ? "text-accent" : "text-text-muted"
                }`} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search opportunities..."
                  className="w-full pl-9 pr-20 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/40 focus:bg-surface-elevated transition-all"
                />
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity ${
                  searchFocused ? "opacity-0" : "opacity-100"
                }`}>
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-medium text-text-muted/60">
                    <span className="text-xs">&#8984;</span>K
                  </kbd>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium rounded-lg hover:bg-surface-elevated/50 transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                        <span className="text-accent text-xs font-bold">
                          {initials(user.user_metadata?.full_name, user.email)}
                        </span>
                      </div>
                      <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-card-dark py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right">
                        <div className="px-3.5 py-2 border-b border-border mb-1">
                          <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
                          <p className="text-xs text-text-muted truncate mt-px">{user.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors rounded-md mx-1">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors rounded-md mx-1">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors rounded-md mx-1">
                            <FileText className="w-4 h-4" /> Admin
                          </Link>
                        )}
                        <div className="border-t border-border my-1" />
                        <button onClick={signOut}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-danger hover:bg-danger/10 transition-colors w-full text-left rounded-md mx-1">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/login"
                      className="px-3.5 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                      Log in
                    </Link>
                    <Link href="/signup"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-accent text-bg-primary rounded-lg hover:bg-accent-hover transition-all shadow-glow-sm hover:shadow-glow-btn">
                      Sign Up
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </div>

              <div className="flex md:hidden items-center gap-1.5">
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                    <span className="text-accent text-xs font-bold">{initials(user.user_metadata?.full_name, user.email)}</span>
                  </div>
                ) : (
                  <Link href="/signup" className="px-2.5 py-1 text-xs font-semibold bg-accent text-bg-primary rounded-lg transition-colors">
                    Sign Up
                  </Link>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-200 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-bg-primary border-l border-border shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10">
                <Zap className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-display text-lg font-bold text-text-primary">
                Electro<span className="text-accent">Bridge</span>
              </span>
            </Link>
            <button onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-9 h-9 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors"
              aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-4rem)] pb-8">
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={(e) => { doSearch(e); setMenuOpen(false); }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search opportunities..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors" />
                </div>
              </form>
            </div>

            <div className="px-3 py-1 space-y-px">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const isOpen = openDropdown === item.label;

                if (item.dropdown) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDD(item.label)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          active ? "text-accent bg-accent/8" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="ml-4 mt-1 mb-1 pl-3 border-l border-border space-y-px">
                          {item.dropdown.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-accent rounded-lg hover:bg-accent/5 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-text-muted/30" />
                              <span>{link.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      active ? "text-accent bg-accent/8" : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="px-3 mt-4">
              <div className="h-px bg-border mb-4" />
              {user ? (
                <div className="space-y-px">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">{initials(user.user_metadata?.full_name, user.email)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{displayName}</div>
                      <div className="text-xs text-text-muted truncate">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors">
                      <FileText className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-colors w-full">
                    Log in
                  </Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-accent text-bg-primary font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-accent-hover transition-colors w-full">
                    Sign Up <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
