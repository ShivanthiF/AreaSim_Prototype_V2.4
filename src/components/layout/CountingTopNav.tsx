"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Bell, X, Settings, CreditCard, LogOut, Globe, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { mockProject, mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface CountingTopNavProps {
  floorValue?: string;
  floorOptions?: { value: string; label: string }[];
  onFloorChange?: (value: string) => void;
  hideFloorSelector?: boolean;
  onGotQuestions?: () => void;
}

const ROUND_SCHEDULE = [
  { num: 1, endH: 10, nextStart: "10:00 AM" },
  { num: 2, endH: 12, nextStart: "12:00 PM" },
  { num: 3, endH: 14, nextStart: "02:00 PM" },
  { num: 4, endH: 16, nextStart: "04:00 PM" },
];
const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th"];

function getNotifRoundInfo() {
  const h = new Date().getHours();
  const done = ROUND_SCHEDULE.filter((r) => h >= r.endH).pop() ?? ROUND_SCHEDULE[0];
  return { label: ORDINALS[done.num - 1], nextTime: done.nextStart };
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "no", name: "Norsk" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
];

/** Top navbar shared across all counting-stepper steps — mirrors the canvas page navbar. */
export function CountingTopNav({ floorValue, floorOptions, onFloorChange, hideFloorSelector = false, onGotQuestions }: CountingTopNavProps) {
  const router = useRouter();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const { label: roundLabel, nextTime: nextRoundTime } = getNotifRoundInfo();

  return (
    <>
      <header className="relative z-[200] flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-2 bg-surface shrink-0">
        {/* Logo — navigates to dashboard */}
        <button onClick={() => router.push("/dashboard")} className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo size="md" showText={false} />
        </button>

        <div className="w-px h-5 bg-border" />

        {/* Project name — always visible */}
        <span className="text-xs sm:text-sm font-semibold text-text font-body truncate max-w-[80px] min-[400px]:max-w-[150px] sm:max-w-[200px]">
          {mockProject.name}
        </span>

        {!hideFloorSelector && (
          <>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />

            {/* Floor selector */}
            <div className="relative min-w-[148px]">
              <select
                value={floorValue}
                onChange={(e) => onFloorChange?.(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {floorOptions?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {onGotQuestions && (
            <>
              {/* Desktop version: secondary button with text */}
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex h-8 px-4 shrink-0"
                icon={<HelpCircle size={14} />}
                onClick={onGotQuestions}
              >
                Got questions?
              </Button>
              {/* Mobile version: simple borderless icon button */}
              <button
                onClick={onGotQuestions}
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors shrink-0"
              >
                <HelpCircle size={16} />
              </button>
            </>
          )}
          {/* Desktop Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <button
            onClick={() => setShowNotifModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <Bell size={16} />
          </button>
          
          {/* Profile dropdown container */}
          <div className="relative flex items-center">
            <UserAvatar onClick={() => setProfileOpen(!profileOpen)} />
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden py-1"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text truncate">{mockUser.name}</p>
                      <p className="text-xs text-text-muted truncate">{mockUser.email}</p>
                    </div>
                    {/* Menu items */}
                    {[
                      { icon: Settings,    label: "Settings",     href: "/settings" },
                      { icon: CreditCard,  label: "Subscription", href: "/subscription" },
                      { icon: HelpCircle,  label: "Help",         href: "/help" },
                    ].map(({ icon: Icon, label, href }) => (
                      <button key={href}
                        onClick={() => { router.push(href); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors font-body text-left">
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}

                    {/* Language selector for mobile */}
                    <div className="sm:hidden border-t border-border mt-1 pt-1.5 pb-1">
                      <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <Globe size={11} /> Language
                      </p>
                      {LANGUAGES.map((lang) => {
                        const isSelected = activeLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setActiveLang(lang.code);
                              setProfileOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 text-xs font-body transition-colors text-left",
                              isSelected ? "text-primary bg-primary/[0.04] font-semibold" : "text-text-muted hover:bg-surface-2"
                            )}
                          >
                            <span>{lang.name}</span>
                            {isSelected && <Check size={12} className="text-primary" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-border mt-1">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-body text-left">
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Notification modal */}
      <AnimatePresence>
        {showNotifModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell size={18} className="text-primary" />
                  </div>
                  <h3 className="font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Next counting round
                  </h3>
                </div>
                <button onClick={() => setShowNotifModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-text-muted font-body leading-relaxed">
                  You&apos;ve completed your {roundLabel} round for today. Your next round starts in 15 minutes at {nextRoundTime}. Please be ready to continue counting.
                </p>
                <Button className="w-full" size="lg" onClick={() => setShowNotifModal(false)}>
                  Got it
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
