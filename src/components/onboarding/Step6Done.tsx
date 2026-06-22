"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const checklist = [
  "Verify identified rooms on floor plan",
  "Mark zones",
  "Get employee count of each room",
  "Conduct survey",
];

export function Step6Done() {
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<number>(0);

  useEffect(() => {
    checklist.forEach((_, i) => {
      setTimeout(() => setVisibleItems(i + 1), 400 + i * 300);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      {/* White card — centered with space around it */}
      <div className="w-full max-w-md bg-white shadow-2xl border border-[#F0F4F8] rounded-[32px] px-6 py-8 flex flex-col items-center gap-6">

      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-accent/10 bg-brand-gradient"
      >
        <CheckCircle2 size={36} color="#139485" />
      </motion.div>

      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-800 text-text"
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
        >
          Great! You&apos;re all set!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-text-muted font-body max-w-sm leading-relaxed"
        >
          In order to give you advice on your space utilisation, it&apos;s important
          for us to understand your space and people. For that, we mainly want you to do few things:
        </motion.p>
      </div>

      {/* Animated checklist */}
      <div className="w-full max-w-sm space-y-2">
        {checklist.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -16 }}
            animate={
              visibleItems > i
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -16 }
            }
            transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-3 py-0.5"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={visibleItems > i ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="w-6 h-6 rounded-full bg-[#B7ACE1]/15 flex items-center justify-center shrink-0"
            >
              <span className="text-sm" style={{ color: "#B7ACE1" }}>✦</span>
            </motion.span>
            <span className="text-sm font-medium text-text font-body">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA — pushed to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="w-full flex justify-center pb-2"
      >
        <Button
          size="lg"
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          onClick={() => router.push("/project/proj-1/floor/floor-1#show-guide")}
        >
          Continue
        </Button>
      </motion.div>

      </div>{/* end white card */}
    </motion.div>
  );
}
