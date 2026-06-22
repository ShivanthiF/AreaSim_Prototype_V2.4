import { cn } from "@/lib/utils";

type BadgeVariant = "high" | "medium" | "low" | "accent" | "default" | "active" | "pending" | "urgent" | "new" | "archived";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/** Risk-level and status badges. */
export function Badge({ variant = "default", children, className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    accent: "bg-accent/10 text-accent border-accent/30",
    default: "bg-surface-2 text-text-muted border-border",
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-nordic-beige/10 text-nordic-beige-dark border-nordic-beige/20",
    urgent: "bg-error/10 text-error border-error/20",
    new: "bg-primary/10 text-primary border-primary/20",
    archived: "bg-surface-2 text-text-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium font-body",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
