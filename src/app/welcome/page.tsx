"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="shrink-0 px-8 py-4 border-b border-border bg-surface flex items-center">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full items-center">
          {/* Left side: 1/3 space */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="col-span-1 flex flex-col items-start text-left gap-8"
          >
            {/* Title + description */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Welcome to your workspace journey.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-base text-text-muted font-body leading-relaxed max-w-sm"
              >
                From insights to impact. We help you create workspaces that people love and business thrive in.
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => router.push("/onboarding")}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="px-8 shadow-[0_4px_16px_rgba(10,79,110,0.28)]"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side: 2/3 space */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="col-span-1 lg:col-span-2 w-full overflow-hidden rounded-2xl border border-border bg-[#F3F9F8] shadow-xl shadow-[#F3F9F8]/10 ring-1 ring-black/[0.04]"
          >
            <div className="relative aspect-video w-full">
              <Image
                src="/Your_workspace_journey.png"
                alt="Your workspace journey"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
