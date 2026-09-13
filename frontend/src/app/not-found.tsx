import Link from "next/link";
import { MessageSquare, FileText, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
        <span className="text-2xl font-extrabold text-blue-600">?</span>
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 mb-2">404</h1>
      <p className="text-xl text-slate-900 font-semibold mb-2">Page Not Found</p>
      <p className="text-slate-500 max-w-md mb-8 text-sm">
        The requested page doesn&apos;t exist. Use the links below to get back on track.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/resume" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all">
          <FileText className="w-4 h-4" /> Resume Builder
        </Link>
        <Link href="/ask-ai" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all">
          <MessageSquare className="w-4 h-4" /> AI Assistant
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-xl px-6 py-2.5 text-sm hover:bg-blue-700 transition-colors shadow-sm"
      >
        &larr; Return to ElectroBridge
      </Link>
    </div>
  );
}
