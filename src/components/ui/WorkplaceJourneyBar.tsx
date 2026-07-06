"use client";

import { cn } from "@/lib/utils";

// ─── Step icons (each uses its step's brand color) ─────────────────────────────

function IconCountCollect() {
  // Purple — grid/spreadsheet
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2" width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.85" />
      <rect x="12" y="2" width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.65" />
      <rect x="2" y="9" width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.65" />
      <rect x="12" y="9" width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.45" />
      <rect x="2" y="16" width="8" height="3" rx="1.2" fill="#6D5FAD" fillOpacity="0.32" />
      <rect x="12" y="16" width="8" height="3" rx="1.2" fill="#6D5FAD" fillOpacity="0.22" />
      {/* 3D bottom edge */}
      <rect x="2" y="6" width="8" height="1.5" rx="0" fill="#3D2F8A" fillOpacity="0.18" />
      <rect x="12" y="6" width="8" height="1.5" rx="0" fill="#3D2F8A" fillOpacity="0.12" />
    </svg>
  );
}

function IconAnalysis() {
  // Amber — bar chart
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* bars with 3D bottom shadow */}
      <rect x="2" y="15" width="3.5" height="5" rx="0.8" fill="#C47A2C" fillOpacity="0.7" />
      <rect x="2" y="19" width="3.5" height="1" rx="0" fill="#7A4A10" fillOpacity="0.25" />
      <rect x="7" y="10" width="3.5" height="10" rx="0.8" fill="#C47A2C" fillOpacity="0.82" />
      <rect x="7" y="19" width="3.5" height="1" rx="0" fill="#7A4A10" fillOpacity="0.25" />
      <rect x="12" y="5" width="3.5" height="15" rx="0.8" fill="#C47A2C" fillOpacity="0.95" />
      <rect x="12" y="19" width="3.5" height="1" rx="0" fill="#7A4A10" fillOpacity="0.25" />
      {/* axes */}
      <rect x="17" y="2" width="1" height="18" rx="0.5" fill="#C47A2C" fillOpacity="0.18" />
      <rect x="1" y="20" width="18" height="1" rx="0.5" fill="#C47A2C" fillOpacity="0.18" />
    </svg>
  );
}

function IconWorkplaceConcept() {
  // Green — 4-zone squares
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#139485" fillOpacity="0.7" />
      <rect x="12" y="2" width="8" height="8" rx="1.5" fill="#32b057ff" fillOpacity="0.65" />
      <rect x="2" y="12" width="8" height="8" rx="1.5" fill="#32b057ff" fillOpacity="0.65" />
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#139485" fillOpacity="0.65" />
      {/* 3D bottom edge on each */}
      <rect x="2" y="9" width="8" height="1" rx="0" fill="#139485" fillOpacity="0.2" />
      <rect x="12" y="9" width="8" height="1" rx="0" fill="#32b057ff" fillOpacity="0.2" />
      <rect x="2" y="19" width="8" height="1" rx="0" fill="#32b057ff" fillOpacity="0.2" />
      <rect x="12" y="19" width="8" height="1" rx="0" fill="#139485" fillOpacity="0.2" />
    </svg>
  );
}

function IconRoomProgram() {
  // Blue — calendar grid
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="1.5" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="1.3" />
      {/* 3D bottom */}
      <rect x="3" y="19" width="16" height="1" rx="0.5" fill="#1E3E8A" fillOpacity="0.18" />
      <path d="M7 2v4M15 2v4" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 9h18" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="5" y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.65" />
      <rect x="9.5" y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.45" />
      <rect x="14" y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.45" />
    </svg>
  );
}

function IconDesignPhase() {
  // Rose — blueprint floor plan
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="1.5" width="19" height="19" rx="1.8" fill="#E05D8B" fillOpacity="0.07" stroke="#E05D8B" strokeWidth="1.3" strokeDasharray="2.5 2" />
      {/* 3D offset */}
      <rect x="2.5" y="20" width="17" height="1" rx="0.5" fill="#A02060" fillOpacity="0.15" />
      <rect x="3.5" y="3.5" width="6" height="8" rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12" />
      <rect x="11" y="3.5" width="7.5" height="5" rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12" />
      <rect x="3.5" y="13" width="15" height="5.5" rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12" />
    </svg>
  );
}

function IconOptimization() {
  // Green — trend line with dots
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* shadow path */}
      <path d="M2 17.5l5-5 3.5 2.5 5.5-7 4 3" stroke="#0A6E61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.18" />
      {/* main path */}
      <path d="M2 16.5l5-5 3.5 2.5 5.5-7 4 3" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19.5" cy="9" r="2.5" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.1" />
      <path d="M2 20h18" stroke="#10B981" strokeWidth="0.8" strokeOpacity="0.2" />
    </svg>
  );
}

// ─── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "1-2",
    label: "Step 1 and 2",
    name: "Count + Collect",
    Icon: IconCountCollect,
    color: "#6351AC",          // active text — #6351AC per spec
    textColor: "#6351AC",      // same for step number
    bg: "#F0EEFF",             // light purple tint (inactive)
    activeBg: "linear-gradient(159deg, #E8E2F5 0%, #C4B8E8 100%)",
    borderColor: "#9887DB",    // 1.5px solid border per spec
  },
  {
    id: "3",
    label: "Step 3",
    name: "Analysis + Advice",
    Icon: IconAnalysis,
    color: "#7A4A10",          // darker amber
    textColor: "#7A4A10",
    bg: "rgba(196,122,44,0.15)",
    activeBg: "linear-gradient(135deg, rgba(196,122,44,0.22) 0%, rgba(160,90,15,0.16) 100%)",
    borderColor: "rgba(196,122,44,0.35)",
  },
  {
    id: "4",
    label: "Step 4",
    name: "Workplace Concept",
    Icon: IconWorkplaceConcept,
    color: "#0A6359",          // darker teal
    textColor: "#0A6359",
    bg: "rgba(19,148,133,0.15)",
    activeBg: "linear-gradient(135deg, rgba(19,148,133,0.22) 0%, rgba(10,110,97,0.16) 100%)",
    borderColor: "rgba(19,148,133,0.35)",
  },
  {
    id: "5",
    label: "Step 5",
    name: "Room Program",
    Icon: IconRoomProgram,
    color: "#1D4ED8",          // darker blue
    textColor: "#1D4ED8",
    bg: "rgba(59,130,246,0.15)",
    activeBg: "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(30,90,200,0.16) 100%)",
    borderColor: "rgba(59,130,246,0.35)",
  },
  {
    id: "6",
    label: "Step 6",
    name: "Design Phase",
    Icon: IconDesignPhase,
    color: "#9D174D",          // darker rose
    textColor: "#9D174D",
    bg: "rgba(224,93,139,0.15)",
    activeBg: "linear-gradient(135deg, rgba(224,93,139,0.22) 0%, rgba(180,50,100,0.16) 100%)",
    borderColor: "rgba(224,93,139,0.35)",
  },
  {
    id: "7",
    label: "Step 7",
    name: "Optimisation",
    Icon: IconOptimization,
    color: "#065F46",          // darker green
    textColor: "#065F46",
    bg: "rgba(16,185,129,0.15)",
    activeBg: "linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(8,130,90,0.16) 100%)",
    borderColor: "rgba(16,185,129,0.35)",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WorkplaceJourneyBarProps {
  activeStep?: StepId;
}

export function WorkplaceJourneyBar({ activeStep = "1-2" }: WorkplaceJourneyBarProps) {
  const activeIdx = STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="hidden md:flex w-full px-4 py-2 border-b border-border items-stretch shrink-0 bg-white min-h-[72px] overflow-x-auto">
      {/* ── GO badge — flat left, pointy right ── */}
      <div
        className="flex flex-col items-center justify-center pl-3 pr-6 py-1.5 text-white shrink-0"
        style={{
          background: "#917963", // Tan/brown from screenshot
          clipPath: "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)",
          minWidth: 72,
          zIndex: 30,
        }}
      >
        <span className="text-[14px] font-black leading-none tracking-tight">Start</span>
        <span className="text-[10px] font-semibold leading-none mt-0.5">Journey</span>
      </div>

      {/* ── Steps — notched left, pointy right (except last) ── */}
      <div className="flex-1 flex items-stretch ml-1">
        {STEPS.map((step, i) => {
          const isActive = step.id === activeStep;
          const isPast = i < activeIdx;
          const isFirstStep = i === 0;
          const isLast = i === STEPS.length - 1;
          const { Icon } = step;

          const bgFill = isActive ? step.activeBg : step.bg;
          const clipShape = isLast
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12px 50%)"
            : "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)";

          // Step 1 gets a visible border via drop-shadow on an outer wrapper
          // (filter on outer, clip-path on inner — the only way to make drop-shadow follow clip-path)
          const outerFilter = isFirstStep
            ? "drop-shadow(1.5px 0 0 #9887DB) drop-shadow(-1.5px 0 0 #9887DB) drop-shadow(0 1.5px 0 #9887DB) drop-shadow(0 -1.5px 0 #9887DB)"
            : undefined;

          return (
            // Outer wrapper — carries the drop-shadow filter for step 1 border
            <div
              key={step.id}
              className={cn(
                "transition-all duration-300 outline-none focus-visible:relative focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-offset-2",
                isActive
                  ? "flex-1 min-w-[140px] shrink grow"
                  : "flex-1 max-md:flex-none opacity-80 hover:opacity-100",
                !isActive && !isPast && "opacity-90"
              )}
              style={{ zIndex: isActive ? 100 : STEPS.length - i, filter: outerFilter }}
            >
              {/* Inner — clip-path shape + background */}
              <div
                className="flex items-center gap-2 py-1.5 pl-7 pr-3 h-full"
                style={{ background: bgFill, clipPath: clipShape }}
              >
                {/* Icon box */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white"
                  style={{
                    border: `1.2px solid ${step.borderColor}`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="scale-75 flex items-center justify-center">
                    <Icon />
                  </div>
                </div>

                {/* Text */}
                <div className={cn("min-w-0 flex-1", !isActive && "max-md:hidden")}>
                  <p
                    className="text-[8px] font-extrabold tracking-[0.05em] leading-none truncate"
                    style={{ color: step.textColor, opacity: isActive ? 1 : 0.75 }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-[11px] font-bold leading-tight mt-[3px] whitespace-nowrap truncate"
                    style={{
                      color: step.textColor,
                      opacity: isActive ? 1 : 0.75,
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
