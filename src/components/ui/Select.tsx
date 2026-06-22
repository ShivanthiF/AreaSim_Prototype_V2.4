"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

/** Custom styled select/dropdown component. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-text font-body"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-xl border border-[#969696] bg-white px-4 py-2.5 pr-10 text-sm text-[#222B27] font-body placeholder:text-[#98A1B2]",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)]",
              "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
              "disabled:bg-[#F5F5F5] disabled:border-[#E2E2E2] disabled:opacity-60 disabled:cursor-not-allowed",
              error && "border-accent-warm focus:border-accent-warm focus:ring-[rgba(196,122,44,0.18)]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>
        {error && <p className="text-xs text-accent-warm font-body">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted font-body">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
