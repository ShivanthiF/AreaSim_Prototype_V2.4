"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

/** Multi-step wizard progress indicator with labels. */
export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile: progress bar */}
      <div className="sm:hidden mb-4">
        <div className="flex justify-between text-xs text-text-muted mb-2 font-body">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{steps[currentStep]?.label}</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <button 
                onClick={() => onStepClick?.(index)}
                className="flex flex-col items-center gap-1.5 group outline-none"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 font-body",
                    isCompleted
                      ? "bg-accent border-accent text-white group-hover:bg-accent/80 group-hover:border-accent/80"
                      : isCurrent
                      ? "bg-primary border-primary text-white scale-110 shadow-md shadow-primary/30"
                      : "bg-surface border-border text-text-muted group-hover:border-primary/50 group-hover:text-primary"
                  )}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-body whitespace-nowrap transition-colors",
                    isCurrent ? "text-primary font-semibold" : "text-text-muted group-hover:text-primary"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 -mt-5">
                  <div className="h-0.5 w-full bg-border rounded overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
