import Link from "next/link";
import { MessageSquareText, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
        ElectroBridge
        <span className="block text-emerald-400 mt-2">AI Career Assistant for Semiconductor Engineers</span>
      </h1>
      <p className="mt-6 text-slate-400 max-w-xl text-base sm:text-lg">
        Chat with an AI expert in VLSI, semiconductor, and electronics careers — then generate a polished resume in seconds.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/ask-ai"
          className="group bg-slate-900 border border-slate-800 rounded-2xl p-8 text-left hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquareText className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Ask AI</h2>
          <p className="text-slate-400 text-sm">
            Get instant answers on VLSI roles, semiconductor trends, interview prep, and career guidance.
          </p>
        </Link>

        <Link
          href="/resume"
          className="group bg-slate-900 border border-slate-800 rounded-2xl p-8 text-left hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Resume Builder</h2>
          <p className="text-slate-400 text-sm">
            Build a tailored, ATS-optimized resume for semiconductor and VLSI positions.
          </p>
        </Link>
      </div>
    </div>
  );
}
