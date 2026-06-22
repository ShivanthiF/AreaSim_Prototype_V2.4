"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-500/10 to-amber-500/10 flex items-center justify-center">
            <span
              className="text-7xl font-extrabold text-red-400 select-none"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              500
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-400/30" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-amber-400/30" />
        </div>

        <div className="mb-2 flex justify-center">
          <Logo size="md" showText />
        </div>

        <h1
          className="text-2xl font-bold text-text mt-4 mb-2"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Something went wrong
        </h1>
        <p className="text-sm text-text-muted font-body leading-relaxed mb-8">
          An unexpected error occurred. This has been logged automatically.
          Please try refreshing the page.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold font-body hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
