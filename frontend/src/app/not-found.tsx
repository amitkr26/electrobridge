import Link from "next/link";
import { Sparkles, MessageSquareText, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-emerald-400" />
      </div>
      <h1 className="font-display text-6xl font-bold text-white mb-2">404</h1>
      <p className="text-xl text-white font-semibold mb-2">Page Not Found</p>
      <p className="text-slate-400 max-w-md mb-8 text-sm">
        The requested URL could not be found. Use the tools below to get back on track.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-white text-xs font-medium transition-all">
          Home
        </Link>
        <Link href="/ask-ai" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-white text-xs font-medium transition-all">
          <MessageSquareText className="w-4 h-4 text-emerald-400" /> Ask AI
        </Link>
        <Link href="/resume" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-white text-xs font-medium transition-all">
          <FileText className="w-4 h-4 text-emerald-400" /> Resume Builder
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-semibold rounded-xl px-6 py-2.5 text-sm hover:bg-emerald-400 transition-colors"
      >
        &larr; Return to ElectroBridge
      </Link>
    </div>
  );
}
