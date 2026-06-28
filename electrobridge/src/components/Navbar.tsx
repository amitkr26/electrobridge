import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-navy border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan" />
            <span className="font-display text-xl font-bold text-text-primary">
              Electro<span className="text-cyan">Bridge</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/opportunities"
              className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
            >
              Opportunities
            </Link>
            <Link
              href="/news"
              className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
            >
              News
            </Link>
            <Link
              href="/organizations"
              className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
            >
              Organizations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
