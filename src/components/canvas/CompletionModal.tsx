"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useCanvasStore } from "@/store/canvas";
import { Button } from "@/components/ui/Button";

export function CompletionModal() {
  const { completionModalOpen, setCompletionModal } = useCanvasStore();
  const fired = useRef(false);

  useEffect(() => {
    if (completionModalOpen && !fired.current) {
      fired.current = true;
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#00C9A7", "#0A4F6E", "#1A7FA8", "#FF6B6B", "#ffffff"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    if (!completionModalOpen) fired.current = false;
  }, [completionModalOpen]);

  return (
    <AnimatePresence>
      {completionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCompletionModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-2xl text-center"
          >
            <button
              onClick={() => setCompletionModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
            >
              <X size={18} />
            </button>

            {/* Celebration icon */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-[#00C9A7] flex items-center justify-center shadow-lg shadow-accent/25 mx-auto mb-5"
            >
              <Sparkles size={30} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-800 text-text mb-2"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
            >
              Amazing Work! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-text-muted font-body leading-relaxed mb-6"
            >
              You&apos;ve completed the workspace analysis for this floor. You&apos;re ready for the next step in your space optimisation journey.
            </motion.p>

            {/* Upsell card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 to-accent/5 p-5 mb-5 text-left"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Lock size={17} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-700 text-text font-display" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    Room Program
                  </h3>
                  <p className="text-xs text-text-muted font-body mt-0.5">
                    Expert AI-powered advice based on your gathered workspace data.
                  </p>
                </div>
              </div>

              <ul className="space-y-1 mb-4">
                {["Detailed utilisation report", "Space optimisation blueprint", "Cost savings forecast"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-text font-body">
                    <CheckCircle2 size={12} className="text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-body">From</p>
                  <p className="text-lg font-700 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    NOK 2,499<span className="text-sm font-400 text-text-muted">/month</span>
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shadow-md shadow-primary/20"
                  onClick={() => alert("Payment flow coming soon!")}
                >
                  Pay Now &amp; Unlock
                </Button>
              </div>
            </motion.div>

            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => setCompletionModal(false)}
            >
              Continue Reviewing
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
