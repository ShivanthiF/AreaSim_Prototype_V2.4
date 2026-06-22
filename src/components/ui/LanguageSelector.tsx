"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "no", name: "Norsk" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
];

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-all font-body"
      >
        <Globe size={15} className="shrink-0" />
        <span className="hidden sm:inline">{selected.name}</span>
        <span className="sm:hidden">{selected.code.charAt(0).toUpperCase() + selected.code.slice(1).toLowerCase()}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border bg-surface shadow-xl z-50 overflow-hidden py-1"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelected(lang);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-body transition-colors",
                    selected.code === lang.code
                      ? "text-primary bg-primary/[0.04] font-semibold"
                      : "text-text hover:bg-surface-2"
                  )}
                >
                  {lang.name}
                  {selected.code === lang.code && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
