import { Loader2 } from "lucide-react";

export default function AskAiLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <span>Loading AI Assistant...</span>
      </div>
    </div>
  );
}
