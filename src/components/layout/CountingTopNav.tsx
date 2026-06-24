"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { mockProject } from "@/lib/mockData";

interface CountingTopNavProps {
  floorValue: string;
  floorOptions: { value: string; label: string }[];
  onFloorChange: (value: string) => void;
}

/** Top navbar shared across all counting-stepper steps — mirrors the canvas page navbar. */
export function CountingTopNav({ floorValue, floorOptions, onFloorChange }: CountingTopNavProps) {
  const router = useRouter();

  return (
    <header className="flex items-center gap-3 px-3 py-2 bg-surface shrink-0">
      {/* Logo — navigates to dashboard */}
      <button onClick={() => router.push("/dashboard")} className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
        <Logo size="md" showText={false} />
      </button>

      <div className="w-px h-5 bg-border" />

      {/* Project name */}
      <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[200px]">
        {mockProject.name}
      </span>

      <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />

      {/* Floor selector */}
      <div className="relative min-w-[148px]">
        <select
          value={floorValue}
          onChange={(e) => onFloorChange(e.target.value)}
          className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
        >
          {floorOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSelector />
        <UserAvatar onClick={() => router.push("/settings")} />
      </div>
    </header>
  );
}
