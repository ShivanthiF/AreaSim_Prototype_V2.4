"use client";

import { cn } from "@/lib/utils";

interface PotentialScoreWidgetProps {
  className?: string;
  score?: number;
  total?: number;
  level?: string;
}

export function PotentialScoreWidget({
  className,
  score = 385,
  total = 1000,
  level = "Explorer",
}: PotentialScoreWidgetProps) {
  return (
    <div className={cn("shrink-0", className)}>
      <div
        className="relative flex items-center gap-3 px-4 py-2 rounded-xl overflow-hidden bg-brand-gradient"
        style={{
          border: "1px solid #B2DFDE",
          boxShadow: "0 4px 14px rgba(31,167,160,0.35), 0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        {/* Shield icon — purple gradient */}
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" className="shrink-0">
          <defs>
            <linearGradient id="shieldGradWidget" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4AB7B2" />
              <stop offset="100%" stopColor="#00978E" />
            </linearGradient>
          </defs>
          <path
            d="M16 1L2 7V18C2 27 8.6 35.2 16 37C23.4 35.2 30 27 30 18V7L16 1Z"
            fill="url(#shieldGradWidget)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1"
          />
          {/* White star inside shield */}
          <path
            d="M16 11l1.8 5.5H23l-4.6 3.3 1.8 5.5L16 22l-4.2 3.3 1.8-5.5L9 16.5h5.2Z"
            fill="rgba(255,255,255,0.92)"
          />
        </svg>

        {/* Score info */}
        <div className="relative z-10">
          <p className="text-[8px] font-bold tracking-widest leading-none text-[#006A61]">
            Your Potential Score
          </p>
          <p
            className="text-[16px] font-black text-[#006A61] leading-tight mt-[2px]"
            style={{ fontFamily: "var(--font-manrope)", textShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            {score}
            <span className="text-[11px] font-medium text-[#006A61]"> / {total.toLocaleString()}</span>
          </p>
          {/* Progress bar + level */}
          <div className="flex items-center gap-2 mt-0.5">
            <div
              className="h-[5px] rounded-full overflow-hidden"
              style={{ background: "rgba(0,0,0,0.08)", width: 76 }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(score / total) * 100}%`,
                  background: "linear-gradient(106deg, #D67D00 0%, #FADB00 100%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.5)",
                }}
              />
            </div>
            <span className="text-[8px] font-bold whitespace-nowrap text-[#006A61]">
              Lv.1 · {level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
