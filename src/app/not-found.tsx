import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span
              className="text-7xl font-extrabold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent select-none"
              style={{ fontFamily: "var(--font-manrope)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              404
            </span>
          </div>
          {/* Decorative dots */}
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent/30" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-primary/30" />
        </div>

        <div className="mb-2 flex justify-center">
          <Logo size="md" showText />
        </div>

        <h1
          className="text-2xl font-bold text-text mt-4 mb-2"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Page not found
        </h1>
        <p className="text-sm text-text-muted font-body leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold font-body hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
