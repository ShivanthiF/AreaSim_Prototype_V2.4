"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "text"
  | "link"
  | "destructive"
  | "success"
  | "icon"
  | "fab";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  selected?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      selected = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variants: Record<ButtonVariant, string> = {
      primary: cn(
        "bg-primary text-white font-semibold shadow-sm hover:brightness-105 active:brightness-95",
        "btn-primary rounded-full" // Keeping existing btn-primary for gradient/shadow logic
      ),
      secondary: cn(
        "text-text font-medium",
        "btn-secondary rounded-full" // all bg/border/shadow handled by .btn-secondary CSS
      ),
      tertiary: "bg-primary/5 text-primary hover:bg-primary/10 rounded-full",
      ghost: "bg-transparent text-text-muted hover:bg-surface-2 hover:text-text rounded-full",
      text: "bg-transparent text-text-muted hover:text-primary p-0 h-auto rounded-full",
      link: "bg-transparent text-primary hover:underline p-0 h-auto rounded-none font-normal",
      destructive: "bg-error text-white hover:brightness-110 rounded-full shadow-sm",
      success: "bg-success text-white hover:brightness-110 rounded-full shadow-sm",
      icon: "p-0 aspect-square rounded-full border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-2",
      fab: "bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 aspect-square p-4",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-xs px-3 h-8 gap-1.5",
      md: "text-sm px-5 h-10 gap-2",
      lg: "text-base px-7 h-12 gap-2.5",
    };

    // Override sizes for specific variants like icon, text, link, fab
    const variantSizeOverrides: Partial<Record<ButtonVariant, Record<ButtonSize, string>>> = {
      icon: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
      fab: {
        sm: "h-12 w-12",
        md: "h-14 w-14",
        lg: "h-16 w-16",
      },
      text: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      link: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    };

    const currentSize = variantSizeOverrides[variant]?.[size] || sizes[size];

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          currentSize,
          selected && "ring-2 ring-primary ring-offset-2",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn("animate-spin", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
        ) : (
          icon && iconPosition === "left" && icon
        )}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);
Button.displayName = "Button";
