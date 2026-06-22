import * as React from "react";
import { cn } from "@/lib/utils";

export type ChipTone = "neutral" | "success" | "warning" | "info" | "accent";

const TONES: Record<ChipTone, string> = {
  neutral: "bg-[#F1F5F9] text-text-muted border-transparent",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  info:    "bg-primary/10 text-primary border-transparent",
  accent:  "bg-accent/10 text-accent border-transparent",
};

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  icon?: React.ReactNode;
}

/** One consistent pill used for table categories, statuses, and small labels. */
export function Chip({ tone = "neutral", icon, className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold font-body whitespace-nowrap",
        TONES[tone],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
