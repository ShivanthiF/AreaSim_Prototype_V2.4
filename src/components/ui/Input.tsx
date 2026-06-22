"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Size tokens ──────────────────────────────────────────────────────────────
export type InputFieldSize = "sm" | "md" | "lg";

const FIELD_SIZE: Record<
  InputFieldSize,
  { h: string; px: string; text: string; label: string; helper: string; iconL: string; iconR: string; iconW: string }
> = {
  sm: { h: "h-9", px: "px-4", text: "text-xs", label: "text-xs", helper: "text-[11px]", iconL: "left-3", iconR: "right-3", iconW: "w-3.5 h-3.5" },
  md: { h: "h-11", px: "px-5", text: "text-sm", label: "text-[13px]", helper: "text-xs", iconL: "left-4", iconR: "right-4", iconW: "w-4 h-4" },
  lg: { h: "h-14", px: "px-6", text: "text-base", label: "text-sm", helper: "text-xs", iconL: "left-5", iconR: "right-5", iconW: "w-5 h-5" },
};

const ICON_PAD: Record<InputFieldSize, { l: string; r: string }> = {
  sm: { l: "pl-9", r: "pr-9" },
  md: { l: "pl-10", r: "pr-10" },
  lg: { l: "pl-12", r: "pr-12" },
};

// ─── Base classes ─────────────────────────────────────────────────────────────
const BASE = [
  "w-full rounded-xl border border-[#969696]",
  "bg-white text-[#222B27] placeholder:text-[#98A1B2]",
  "transition-all duration-200",
  // Hover
  "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
  // Focus — green glow, no blue
  "focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] focus:shadow-none",
  // Disabled
  "disabled:bg-[#F5F5F5] disabled:border-[#E2E2E2] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
].join(" ");

const ERROR_CLS = "border-[#D47A1F] hover:border-[#D47A1F] focus:border-[#D47A1F] focus:ring-[rgba(212,122,31,0.18)] caret-[#D47A1F]";
const SUCCESS_CLS = "border-[#139485] focus:border-[#139485]";

// ─── Props ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label above the field */
  label?: string;
  /** Error message — activates orange error state */
  error?: string;
  /** Success message — activates green success state */
  success?: string;
  /** Subdued helper text below the field */
  hint?: string;
  /** Left or right icon node */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  /** Called when the icon is clicked */
  onIconClick?: () => void;
  /** Field height / typography size */
  fieldSize?: InputFieldSize;
  /** Shows spinner in the left icon slot */
  loading?: boolean;
  /** Shows a × clear button in the right slot when there is a value */
  clearable?: boolean;
  /** Called when the clear button is clicked */
  onClear?: () => void;
  /** Appends "Optional" label to the right of the label row */
  optionalLabel?: boolean;
  /** Shows a character counter — requires maxLength */
  counter?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      icon,
      iconPosition = "left",
      onIconClick,
      fieldSize = "md",
      loading,
      clearable,
      onClear,
      optionalLabel,
      counter,
      className,
      id,
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    const sz = FIELD_SIZE[fieldSize];
    const ip = ICON_PAD[fieldSize];
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const hasError = !!error;
    const hasSuccess = !!success && !error;
    const hasLeft = !!(icon && iconPosition === "left") || !!loading;
    const hasRight = !!(icon && iconPosition === "right") || !!(clearable && value);

    return (
      <div className="flex flex-col w-full gap-1.5">

        {/* ── Label row ── */}
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className={cn("font-semibold text-[#222B27] font-body", sz.label)}>
              {label}
              {props.required && <span className="ml-0.5 text-[#D47A1F]">*</span>}
            </label>
            {optionalLabel && <span className="text-[11px] text-[#98A1B2] font-body">Optional</span>}
          </div>
        )}

        {/* ── Input wrapper ── */}
        <div className="relative flex items-center">

          {/* Left slot — icon or spinner */}
          {hasLeft && (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-[#98A1B2] pointer-events-none",
                sz.iconL,
                loading && "text-[#139485] animate-spin",
                onIconClick && !loading && "pointer-events-auto cursor-pointer hover:text-[#139485] transition-colors"
              )}
              onClick={!loading ? onIconClick : undefined}
            >
              {loading
                ? <Loader2 className={sz.iconW} />
                : icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            className={cn(
              BASE,
              sz.h, sz.px, sz.text,
              hasLeft && ip.l,
              hasRight && ip.r,
              hasError && ERROR_CLS,
              hasSuccess && SUCCESS_CLS,
              className
            )}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-err`
                : hint ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          {/* Right slot — icon or clear */}
          {icon && iconPosition === "right" && !clearable && (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-[#98A1B2] pointer-events-none",
                sz.iconR,
                onIconClick && "pointer-events-auto cursor-pointer hover:text-[#139485] transition-colors"
              )}
              onClick={onIconClick}
            >
              {icon}
            </span>
          )}

          {clearable && value && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-[#98A1B2]",
                "hover:text-[#222B27] hover:bg-[#F0F0F0] rounded-xl p-0.5 transition-colors",
                sz.iconR
              )}
            >
              <X className={fieldSize === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
            </button>
          )}
        </div>

        {/* ── Footer row — helper / error / success / counter ── */}
        {(error || success || hint || (counter && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            <div>
              {error && (
                <p id={`${inputId}-err`} className={cn("text-[#D47A1F] font-body", sz.helper)}>{error}</p>
              )}
              {hasSuccess && (
                <p className={cn("text-[#139485] font-body", sz.helper)}>{success}</p>
              )}
              {hint && !error && !hasSuccess && (
                <p id={`${inputId}-hint`} className={cn("text-[#98A1B2] font-body", sz.helper)}>{hint}</p>
              )}
            </div>
            {counter && maxLength && (
              <p className="text-[11px] text-[#98A1B2] shrink-0 font-body tabular-nums leading-none mt-0.5">
                {String(value ?? "").length} / {maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
