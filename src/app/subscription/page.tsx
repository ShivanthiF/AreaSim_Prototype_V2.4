"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Gem, X, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const STARTER_FEATURES = [
  "1 active project",
  "Up to 3 floors per project",
  "Basic room counting",
  "1 survey template",
  "Email support",
];

const PRO_FEATURES = [
  "Unlimited projects",
  "Unlimited floors",
  "AI floor plan analysis",
  "All survey templates + custom",
  "Room Program (lease analytics)",
  "Team collaboration (up to 10)",
  "Priority support",
  "Export to PDF / Excel",
];

const FAQ = [
  { q: "Can I upgrade at any time?", a: "Yes — your plan upgrades immediately and you are billed pro-rata for the remainder of the month." },
  { q: "Is there a free trial for Professional?", a: "All new accounts start on the Starter plan. You can trial Professional features for 14 days at no cost." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards as well as invoice billing for annual plans." },
  { q: "Can I cancel my subscription?", a: "You can cancel at any time from your account settings. Your Professional access continues until the end of the billing period." },
  { q: "Do you offer discounts for Norwegian municipalities?", a: "Yes — public sector organisations receive a 25% discount. Contact our sales team for details." },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const items = Array.from({ length: 20 }, (_, i) => i);
  const colors = ["#0A4F6E", "#0F7663", "#F59E0B", "#6366F1", "#EC4899"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: -20, x: `${Math.random() * 100}vw`, rotate: 0 }}
          animate={{ opacity: 0, y: "100vh", rotate: Math.random() * 720 - 360 }}
          transition={{ duration: 2.5 + Math.random() * 1.5, ease: "easeIn", delay: Math.random() * 0.5 }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ background: colors[i % colors.length], top: 0 }}
        />
      ))}
    </div>
  );
}

// ─── Payment modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"confirm" | "payment" | "success">("confirm");
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePay = () => {
    setStep("success");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Gem size={18} className="text-amber-500" />
              <span className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                {step === "success" ? "You're upgraded!" : "Upgrade to Professional"}
              </span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {step === "confirm" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
                  <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Professional Plan</p>
                  <p className="text-2xl font-extrabold text-text mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                    NOK 2,499 <span className="text-sm font-normal text-text-muted">/ month</span>
                  </p>
                </div>
                <p className="text-sm text-text-muted font-body">You&apos;ll be billed NOK 2,499 monthly. Cancel anytime.</p>
                <button
                  onClick={() => setStep("payment")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 hover:opacity-90 transition-opacity"
                >
                  Proceed to payment
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-text-muted font-body block mb-1.5">Cardholder name</label>
                    <input
                      type="text"
                      placeholder="Ingrid Hansen"
                      className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted font-body block mb-1.5">Card number</label>
                    <div className="relative">
                      <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-3 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted font-body block mb-1.5">Expiry</label>
                      <input type="text" placeholder="MM / YY" className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted font-body block mb-1.5">CVV</label>
                      <input type="text" placeholder="•••" className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePay}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
                >
                  Pay Nok 2,499
                </button>
                <p className="text-xs text-text-muted text-center font-body">Secured by Stripe · Mock payment form</p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-4 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-accent/30"
                >
                  <CheckCircle2 size={28} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Welcome to Professional!</h3>
                  <p className="text-sm text-text-muted font-body mt-1">All premium features are now unlocked.</p>
                </div>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition-colors">
                  Start exploring
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-surface-2 transition-colors"
      >
        <span className="text-sm font-semibold text-text font-body">{q}</span>
        {open ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-text-muted font-body leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <AppLayout breadcrumbs={[{ label: "Subscription" }]}>
      <AnimatePresence>
        {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
      </AnimatePresence>

      <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">
        {/* Current plan banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-surface p-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center">
              <span className="text-xl">🆓</span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-body tracking-wider mb-0.5">Current plan</p>
              <p className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Starter</p>
              <p className="text-sm text-text-muted font-body">Free forever · 1 project · 3 floors</p>
            </div>
          </div>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Gem size={14} /> Upgrade now
          </button>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border-2 border-border bg-surface p-6 space-y-5"
          >
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-2 text-text-muted mb-3">Current Plan</span>
              <p className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Starter</p>
              <p className="text-3xl font-extrabold text-text mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                Free <span className="text-sm font-normal text-text-muted">forever</span>
              </p>
            </div>
            <ul className="space-y-2.5">
              {STARTER_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted font-body">
                  <CheckCircle2 size={15} className="text-border shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl border border-border text-sm font-semibold text-text-muted font-body cursor-default">
              Current Plan
            </button>
          </motion.div>

          {/* Professional */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 space-y-5 overflow-hidden"
          >
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                <Gem size={10} /> Recommended
              </span>
            </div>

            <div>
              <p className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Professional</p>
              <p className="text-3xl font-extrabold text-text mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                NOK 2,499 <span className="text-sm font-normal text-text-muted">/ month</span>
              </p>
            </div>
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text font-body">
                  <CheckCircle2 size={15} className="text-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setUpgradeOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:opacity-90 transition-opacity"
            >
              Upgrade now
            </button>
          </motion.div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-base font-extrabold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
            Frequently asked questions
          </h2>
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {FAQ.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
