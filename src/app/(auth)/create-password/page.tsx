"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(p: string) {
  const score = rules.filter((r) => r.test(p)).length;
  if (score <= 1) return { pct: 20, label: "Very weak", color: "bg-red-500" };
  if (score === 2) return { pct: 40, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { pct: 60, label: "Fair", color: "bg-amber-500" };
  if (score === 4) return { pct: 80, label: "Strong", color: "bg-emerald-500" };
  return { pct: 100, label: "Very strong", color: "bg-accent" };
}

const inputCls =
  "w-full rounded-xl border border-[#969696] bg-white pl-10 py-2.5 text-sm text-[#222B27] font-body placeholder:text-[#98A1B2] " +
  "hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] " +
  "focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] " +
  "disabled:bg-[#F5F5F5] disabled:border-[#E2E2E2] disabled:opacity-60 " +
  "transition-all duration-200";

export default function CreatePasswordPage() {
  const router = useRouter();
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    resetOnboarding();
    router.push("/organization-details");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      {/* White card */}
      <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
            Create your password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text font-body">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input type={showPw ? "text" : "password"} placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)} className={inputCls + " pr-10"} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1">
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div className={cn("h-full rounded-full", strength.color)} initial={{ width: 0 }}
                    animate={{ width: `${strength.pct}%` }} transition={{ duration: 0.4 }} />
                </div>
                <p className="text-xs font-body text-text-muted">Strength: <span className={cn("font-medium",
                  strength.pct <= 40 ? "text-red-500" : strength.pct <= 60 ? "text-amber-500" : "text-emerald-500"
                )}>{strength.label}</span></p>
              </motion.div>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-1.5">
            {rules.map((rule) => {
              const ok = rule.test(password);
              return (
                <div key={rule.label} className="flex items-center gap-2">
                  {ok ? <CheckCircle2 size={14} className="text-accent shrink-0" /> : <Circle size={14} className="text-border shrink-0" />}
                  <span className={cn("text-xs font-body transition-colors", ok ? "text-text" : "text-text-muted")}>{rule.label}</span>
                </div>
              );
            })}
          </div>

          {/* Confirm */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text font-body">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input type={showCf ? "text" : "password"} placeholder="Confirm your password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} className={inputCls + " pr-10"} />
              <button type="button" onClick={() => setShowCf(!showCf)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" size="lg" loading={loading} className="w-full">Create account</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
