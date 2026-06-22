import { motion } from "framer-motion";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
  illustration?: React.ReactNode;
}

function DefaultIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="52" fill="url(#grad1)" opacity="0.15" />
      <rect x="30" y="42" width="60" height="38" rx="8" stroke="url(#grad2)" strokeWidth="2" fill="none" />
      <rect x="38" y="52" width="20" height="16" rx="4" stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
      <rect x="64" y="52" width="18" height="7" rx="3" stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
      <rect x="64" y="63" width="11" height="5" rx="2.5" stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="30" r="6" stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
      <line x1="60" y1="36" x2="60" y2="42" stroke="url(#grad2)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="grad1" x1="8" y1="8" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A4F6E" />
          <stop offset="1" stopColor="#0F7663" />
        </linearGradient>
        <linearGradient id="grad2" x1="8" y1="8" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A4F6E" />
          <stop offset="1" stopColor="#0F7663" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EmptyState({ title, subtitle, ctaLabel, onCta, illustration }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      <div className="mb-6">
        {illustration ?? <DefaultIllustration />}
      </div>
      <h3 className="text-lg font-extrabold text-text mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
        {title}
      </h3>
      <p className="text-sm text-text-muted font-body max-w-xs leading-relaxed mb-6">
        {subtitle}
      </p>
      {ctaLabel && onCta && (
        <Button size="md" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </motion.div>
  );
}
