"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Zap, Menu, X, ChevronDown, Home, Briefcase, Newspaper,
  Crosshair, Bot, Info, User, LogOut, LayoutDashboard,
  FileText, MessageSquare, ChevronRight, BookOpen, Sparkles,
  GraduationCap, Globe, BookMarked, Network, Search
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

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

  return (
    <nav className="bg-bg-primary/90 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group">
            <div className="relative">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-accent transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-text-primary">
              Electro<span className="text-accent">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.dropdown) {
                const isOpen = openDropdown === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => showDropdown(item.label)}
                    onMouseLeave={() => hideDropdown(item.label)}
                  >
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center gap-1 px-2.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        active
                          ? "text-accent bg-accent/10"
                          : isOpen
                            ? "text-text-primary bg-surface-elevated"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-xl shadow-card-dark py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                        onMouseEnter={() => showDropdown(item.label)}
                        onMouseLeave={() => hideDropdown(item.label)}
                      >
                        {item.dropdown.map((link: any) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 group/dd ${
                              isActive(link.href)
                                ? "text-accent bg-accent/5"
                                : "text-text-secondary hover:text-accent hover:bg-accent/5"
                            }`}
                          >
                            {link.icon && <link.icon className="w-4 h-4 text-text-muted group-hover/dd:text-accent transition-colors" />}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{link.label}</div>
                              {link.desc && (
                                <div className="text-xs text-text-muted mt-0.5">{link.desc}</div>
                              )}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-text-muted opacity-0 -translate-x-1 group-hover/dd:opacity-100 group-hover/dd:translate-x-0 transition-all duration-200" />
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
                  className={`flex items-center gap-1 px-2.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User / Auth */}
            <div className="hidden sm:flex items-center gap-1.5">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:text-accent hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-xs font-bold">
                        {getInitials(user.user_metadata?.full_name, user.email)}
                      </span>
                    </div>
                    <span className="hidden lg:inline max-w-[100px] truncate">{userDisplayName}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-card-dark py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">{userDisplayName}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-all duration-200 w-full text-left"
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
                    className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:text-text-primary hover:border-accent/30 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 text-sm font-medium bg-accent text-bg-primary rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-glow-sm hover:shadow-glow-cyan"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <Link
                href="/admin"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all duration-200 border border-accent/20"
              >
                Admin
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-text-secondary hover:text-text-primary transition-all duration-200 p-1.5"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="hidden sm:block border-t border-border bg-surface/95 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2.5 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-bg-primary border-l border-border z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-display text-lg font-bold text-text-primary">
              Electro<span className="text-accent">Bridge</span>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-all p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-3.5rem)] pb-8">
          {/* Mobile Search */}
          <div className="px-4 pt-3 pb-2">
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Mobile Nav Items */}
          <div className="px-3 py-2 space-y-0.5">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.dropdown) {
                const isOpen = openDropdown === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        active
                          ? "text-accent bg-accent/10"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="ml-3 mt-0.5 mb-1 pl-4 border-l border-border/50 space-y-0.5">
                        {item.dropdown.map((link: any) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2.5 text-sm text-text-secondary hover:text-accent rounded-lg hover:bg-accent/5 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              {link.icon && <link.icon className="w-4 h-4 text-text-muted" />}
                              {link.label}
                            </div>
                            {link.desc && (
                              <div className="text-xs text-text-muted mt-0.5 pl-6">{link.desc}</div>
                            )}
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
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Section */}
          <div className="px-3 mt-4">
            <div className="border-t border-border/50 mb-4" />
            {user ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 px-3 py-3 text-text-primary text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-sm font-bold">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate">{userDisplayName}</div>
                    <div className="text-xs text-text-muted truncate">{user.email}</div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-all duration-200"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-danger rounded-lg hover:bg-danger/10 transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-border text-text-secondary font-medium rounded-lg px-4 py-2.5 text-sm hover:text-text-primary hover:border-accent/30 transition-all duration-200 w-full"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-accent text-bg-primary font-medium rounded-lg px-4 py-2.5 text-sm hover:bg-accent-hover transition-all duration-200 w-full"
                >
                  Sign Up
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-accent/10 text-accent font-medium rounded-lg px-4 py-2.5 text-sm hover:bg-accent/20 transition-all duration-200 w-full border border-accent/20"
                >
                  <Zap className="w-4 h-4" />
                  Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
