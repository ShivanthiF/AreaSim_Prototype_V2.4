"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enables glassmorphism surface */
  glass?: boolean;
  /** Enables lift-on-hover effect */
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Glass surface card with optional hover lift effect.
 */
export function Card({
  glass = false,
  hoverable = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border transition-all duration-300",
        glass
          ? "bg-white/85 backdrop-blur-xl border-[rgba(208,221,230,0.5)] shadow-glass"
          : "bg-surface shadow-card",
        hoverable &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-card-hover",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
