"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Zap, Menu, X, ChevronDown, Home, Briefcase, Newspaper,
  Crosshair, Bot, Info, User, LogOut, LayoutDashboard,
  FileText, MessageSquare, ChevronRight, BookOpen, Sparkles,
  GraduationCap, Globe, BookMarked, Network, Search, ArrowUpRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const OPPORTUNITY_LINKS = [
  { href: "/category/jrf", label: "JRF Positions", desc: "Junior Research Fellowships" },
  { href: "/category/srf", label: "SRF Positions", desc: "Senior Research Fellowships" },
  { href: "/category/phd", label: "PhD Opportunities", desc: "Doctoral research positions" },
  { href: "/category/govt-job", label: "Government Jobs", desc: "Public sector R&D roles" },
  { href: "/category/fellowship", label: "Fellowships", desc: "Research funding & grants" },
  { href: "/category/private", label: "Private Sector", desc: "Industry R&D positions" },
  { href: "/category/international", label: "International", desc: "Global opportunities" },
];

const RESOURCE_LINKS = [
  { href: "/resources/jrf-guide", label: "JRF Complete Guide", icon: GraduationCap },
  { href: "/resources/phd-guide", label: "PhD Admission Guide", icon: BookOpen },
  { href: "/resources/international-fellowships", label: "International Fellowships", icon: Globe },
  { href: "/resources/vlsi-careers", label: "VLSI Career Guide", icon: Sparkles },
  { href: "/resources/net-vs-gate", label: "NET vs GATE", icon: Network },
  { href: "/resources", label: "All Resources", icon: BookMarked },
];

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase, dropdown: OPPORTUNITY_LINKS },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/match", label: "Find My Match", icon: Crosshair },
  { href: "/chat", label: "Ask AI", icon: Bot },
  { href: "/community", label: "Community", icon: MessageSquare },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/resources", label: "Resources", icon: BookOpen, dropdown: RESOURCE_LINKS },
  { href: "/about", label: "About", icon: Info },
];

function ActiveIndicator() {
  return (
    <span className="absolute inset-x-2 -bottom-0 h-0.5 bg-gradient-to-r from-accent via-accent/80 to-transparent rounded-full" />
  );
}

function DropdownIcon({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={`w-3 h-3 text-text-muted transition-all duration-300 ${open ? "rotate-180 text-accent" : ""}`}
    />
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showDropdown = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const hideDropdown = (name: string) => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown((prev) => (prev === name ? null : prev));
    }, 200);
  };

  const toggleDropdown = (name: string) => {
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
    }
    return email?.substring(0, 2).toUpperCase() ?? "U";
  };

  const userDisplayName = user?.user_metadata?.full_name || user?.email || "User";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isActiveDropdown = (links: { href: string }[]) =>
    links.some((l) => pathname.startsWith(l.href));

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(34,211,238,0.07)]"
            : "bg-gradient-to-b from-bg-primary/60 to-transparent backdrop-blur-0"
        }`}
      >
        {/* Subtle bottom glow line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group relative">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.15)]">
                <Zap className="w-4 h-4 text-accent transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="text-text-primary">Electro</span>
                <span className="text-accent">Bridge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const active = item.dropdown ? isActiveDropdown(item.dropdown) || isActive(item.href) : isActive(item.href);
                const isOpen = openDropdown === item.label;

                if (item.dropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => showDropdown(item.label)}
                      onMouseLeave={() => hideDropdown(item.label)}
                    >
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active
                            ? "text-accent"
                            : isOpen
                              ? "text-text-primary bg-white/[0.04]"
                              : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        <DropdownIcon open={isOpen} />
                        {active && <ActiveIndicator />}
                      </button>
                      {isOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 w-56 p-1.5 bg-surface/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-left"
                          onMouseEnter={() => showDropdown(item.label)}
                          onMouseLeave={() => hideDropdown(item.label)}
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />
                          {item.dropdown.map((link: any) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenDropdown(null)}
                              className="relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group/dd"
                            >
                              {link.icon && (
                                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] group-hover/dd:bg-accent/10 transition-colors duration-200">
                                  <link.icon className="w-3.5 h-3.5 text-text-muted group-hover/dd:text-accent transition-colors duration-200" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-text-secondary group-hover/dd:text-accent transition-colors duration-200">{link.label}</div>
                                {link.desc && (
                                  <div className="text-xs text-text-muted mt-0.5">{link.desc}</div>
                                )}
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-text-muted opacity-0 -translate-x-1 group-hover/dd:opacity-100 group-hover/dd:translate-x-0 transition-all duration-200" />
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
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? "text-accent"
                        : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {active && <ActiveIndicator />}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex items-center justify-center w-9 h-9 text-text-muted hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-white/[0.06]" />

              {/* User / Auth */}
              <div className="hidden sm:flex items-center gap-2">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center ring-1 ring-accent/20">
                        <span className="text-accent text-xs font-bold">
                          {getInitials(user.user_metadata?.full_name, user.email)}
                        </span>
                      </div>
                      <span className="hidden xl:inline text-text-secondary max-w-[100px] truncate">{userDisplayName}</span>
                      <DropdownIcon open={userDropdownOpen} />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 p-1.5 bg-surface/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />
                        <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                          <p className="text-sm font-medium text-text-primary truncate">{userDisplayName}</p>
                          <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-accent rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-accent rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <div className="border-t border-white/[0.06] my-1" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-danger/80 hover:text-danger rounded-xl hover:bg-danger/[0.06] transition-all duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3.5 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="relative px-4 py-1.5 text-sm font-medium text-bg-primary rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-hover" />
                      <span className="absolute inset-0 bg-gradient-to-r from-accent-hover to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Sign Up</span>
                    </Link>
                  </>
                )}
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-xs font-medium text-accent/70 hover:text-accent rounded-xl hover:bg-accent/[0.06] transition-all duration-200"
                >
                  Admin
                </Link>
              </div>

              {/* Mobile: condensed auth */}
              <div className="flex sm:hidden items-center gap-1.5">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center ring-1 ring-accent/20"
                  >
                    <span className="text-accent text-xs font-bold">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </span>
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary rounded-lg hover:bg-white/[0.04] transition-all">
                      Login
                    </Link>
                    <Link href="/signup" className="px-2.5 py-1.5 text-xs font-medium text-bg-primary rounded-lg bg-gradient-to-r from-accent to-accent-hover transition-all">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="hidden sm:block border-t border-white/[0.04]">
            <div className="max-w-3xl mx-auto px-6 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities, categories, organizations..."
                  className="w-full pl-10 pr-10 py-2.5 bg-bg-primary/80 border border-white/[0.08] rounded-xl text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-bg-primary border-l border-white/[0.06] shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/3 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <Zap className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-display text-lg font-bold">
                <span className="text-text-primary">Electro</span>
                <span className="text-accent">Bridge</span>
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-9 h-9 text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 overflow-y-auto h-[calc(100vh-4rem)] pb-10">
            {/* Mobile Search */}
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search opportunities..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/30 transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Nav Items */}
            <div className="px-3 py-2 space-y-0.5">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const active = item.dropdown ? isActiveDropdown(item.dropdown) || isActive(item.href) : isActive(item.href);
                const isOpen = openDropdown === item.label;

                if (item.dropdown) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active
                            ? "text-accent bg-accent/[0.06]"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="ml-4 mt-1 mb-1 space-y-0.5">
                          {item.dropdown.map((link: any) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-accent rounded-xl hover:bg-accent/[0.04] transition-all duration-200"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]" />
                              <div>
                                <div>{link.label}</div>
                                {link.desc && (
                                  <div className="text-xs text-text-muted mt-0.5">{link.desc}</div>
                                )}
                              </div>
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
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? "text-accent bg-accent/[0.06]"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Section */}
            <div className="px-3 mt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />
              {user ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center ring-1 ring-accent/20">
                      <span className="text-accent text-sm font-bold">
                        {getInitials(user.user_metadata?.full_name, user.email)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{userDisplayName}</div>
                      <div className="text-xs text-text-muted truncate">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-danger/80 hover:text-danger rounded-xl hover:bg-danger/[0.06] transition-all duration-200 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/[0.08] text-text-secondary font-medium rounded-xl px-4 py-2.5 text-sm hover:text-text-primary hover:border-white/[0.12] transition-all duration-200 w-full"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-hover text-bg-primary font-medium rounded-xl px-4 py-2.5 text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-200 w-full"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-accent/70 hover:text-accent font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 w-full"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Admin Panel
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
