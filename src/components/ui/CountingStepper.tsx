"use client";

import { Check } from "lucide-react";

// ─── Count + Collect sub-steps (sits directly under the WorkplaceJourneyBar) ───
// Mirrors the stepper from the counting prototype: the six stops of the
// "Count + Collect" journey, highlighting where the user currently is.

export type CountingStepId =
  | "floor-plan"
  | "org-setup"
  | "room-setup"
  | "session-details"
  | "active-session"
  | "room-counting";

const COUNT_COLLECT_STEPS: { id: CountingStepId; label: string }[] = [
  { id: "floor-plan", label: "Open floor plan" },
  { id: "org-setup", label: "Organisation setup" },
  { id: "room-setup", label: "Room setup" },
  { id: "session-details", label: "Prepare session" },
  { id: "active-session", label: "Pick rooms to count" },
  { id: "room-counting", label: "Enter headcount" },
];

/**
 * Canonical destination for each counting step. Every target page renders the
 * stepper with the matching `activeStep`, so navigation stays consistent.
 * (`org-setup` opens the modal on the canvas page via the `#org-setup` hash.)
 */
export function countingStepHref(
  projectId: string,
  floorId: string,
  id: CountingStepId
): string {
  switch (id) {
    case "floor-plan":
      return `/project/${projectId}/floor/${floorId}`;
    case "org-setup":
      return `/project/${projectId}/floor/${floorId}#org-setup`;
    case "room-setup":
      return `/project/${projectId}/floor/${floorId}/count`;
    case "session-details":
      return `/project/${projectId}/floor/${floorId}/count#session-details`;
    case "active-session":
      return `/project/${projectId}/session-overview`;
    case "room-counting":
      return `/project/${projectId}/floor/${floorId}/history`;
  }
}

interface CountingStepperProps {
  activeStep: CountingStepId;
  /** Optional — when provided, steps become clickable and call this with the step id. */
  onStepClick?: (id: CountingStepId) => void;
}

export function CountingStepper({ activeStep, onStepClick }: CountingStepperProps) {
  const activeIdx = COUNT_COLLECT_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="w-full shrink-0 border-b border-border bg-surface-2 px-5 py-2">
      {/* Section label + progress */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className="text-[10px] font-extrabold tracking-[0.06em] uppercase"
          style={{ color: "#6351AC" }}
        >
          Count + Collect
        </span>
        <span className="text-[11px] text-text-muted font-body">
          {activeIdx + 1} of {COUNT_COLLECT_STEPS.length}
        </span>
      </div>

      {/* Step pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {COUNT_COLLECT_STEPS.map((step, i) => {
          const isActive = step.id === activeStep;
          const isDone = i < activeIdx;
          const interactive = Boolean(onStepClick);
          const pillStyle = {
            padding: "6px 10px",
            background: isActive ? "#F0EEFF" : "#fff",
            border: `1px solid ${isActive ? "#9887DB" : isDone ? "#CCC5BB" : "#E4DED4"}`,
            color: isActive
              ? "#6351AC"
              : isDone
                ? "var(--color-text)"
                : "var(--color-text-muted)",
            fontSize: 11,
            fontWeight: isActive ? 700 : 600,
            boxShadow: isActive ? "0 0 0 2px rgba(99,81,172,.12)" : "none",
          } as const;
          const pillInner = (
            <>
              <span
                className="inline-flex shrink-0 items-center justify-center rounded-full"
                style={{
                  width: 18,
                  height: 18,
                  fontSize: 9,
                  fontWeight: 800,
                  background: isActive ? "#6351AC" : isDone ? "#E4DED4" : "#F5F0E8",
                  color: isActive ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {isDone && !isActive ? <Check size={10} strokeWidth={3} /> : i + 1}
              </span>
              {step.label}
            </>
          );
          const pillClass =
            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-body";
          return (
            <div key={step.id} className="flex shrink-0 items-center">
              {i > 0 && (
                <div
                  className="mr-1.5 h-px w-3.5"
                  style={{ background: isDone || isActive ? "#9887DB" : "#E4DED4" }}
                />
              )}
              {interactive ? (
                <button
                  type="button"
                  title={step.label}
                  onClick={() => onStepClick?.(step.id)}
                  className={`${pillClass} cursor-pointer`}
                  style={pillStyle}
                >
                  {pillInner}
                </button>
              ) : (
                <div title={step.label} className={pillClass} style={pillStyle}>
                  {pillInner}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
