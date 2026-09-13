"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-500 text-sm mb-6 max-w-md">
        An unexpected error occurred. Please try again or go back to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-blue-600 text-white font-semibold rounded-xl px-6 py-2.5 text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-slate-200 text-slate-700 font-medium rounded-xl px-6 py-2.5 text-sm hover:bg-slate-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
