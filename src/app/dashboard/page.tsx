"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Building2, BarChart3, ClipboardCheck,
  ArrowRight, Clock, TrendingUp, Plus, X,
  UserPlus, Send,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockUser, mockActivity, mockProjects, mockDashboardStats } from "@/lib/mockData";
import { cn } from "@/lib/utils";

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return value;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, suffix = "", iconBg, delay }: {
  icon: React.ReactNode; label: string; value: number; suffix?: string; iconBg: string; delay: number;
}) {
  const count = useCountUp(value, 1200 + delay * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.12, duration: 0.5 }}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 hover:shadow-card-hover transition-shadow flex-1"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-text tabular-nums leading-none" style={{ fontFamily: "var(--font-manrope)" }}>
          {count}{suffix}
        </p>
        <p className="text-xs text-text-muted font-body mt-2">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Activity helpers ─────────────────────────────────────────────────────────
const ACTIVITY_COLORS: Record<string, string> = {
  room: "bg-[#139485]/10 text-[#139485]",
  survey: "bg-[#C47A2C]/10 text-[#C47A2C]",
  floor: "bg-[#C47A2C]/10 text-[#C47A2C]",
  member: "bg-[#7A6BAF]/10 text-[#7A6BAF]",
  project: "bg-[#4A7AAE]/10 text-[#4A7AAE]",
};
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  room: <Building2 size={14} />,
  survey: <ClipboardCheck size={14} />,
  floor: <BarChart3 size={14} />,
  member: <FolderOpen size={14} />,
  project: <FolderOpen size={14} />,
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-[#139485]/10 text-[#139485]",
    draft: "bg-[#C47A2C]/10 text-[#C47A2C]",
    completed: "bg-[#4A7AAE]/10 text-[#4A7AAE]",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-body", map[status] ?? "bg-border text-text-muted")}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────
function InviteModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState([""]);
  const [sent, setSent] = useState(false);

  const addEmail = () => setEmails((prev) => [...prev, ""]);
  const updateEmail = (i: number, val: string) =>
    setEmails((prev) => prev.map((e, idx) => (idx === i ? val : e)));
  const removeEmail = (i: number) =>
    setEmails((prev) => prev.filter((_, idx) => idx !== i));

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
      >
        {/* Gradient top banner */}
        <div className="relative px-6 pt-6 pb-10 bg-brand-gradient">
          {/* decorative grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <button onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#0D1B2A]/60 hover:text-[#0D1B2A] transition-colors z-10">
            <X size={14} />
          </button>
          {/* Illustration: avatar cluster */}
          <div className="relative z-10 flex items-end gap-1 mb-4">
            {["IH", "MT", "SL"].map((init, i) => (
              <motion.div
                key={init}
                initial={{ scale: 0, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full bg-white/60 border-2 border-white/80 flex items-center justify-center text-[#0D1B2A] text-xs font-bold"
                style={{ marginLeft: i > 0 ? "-6px" : 0 }}
              >
                {init}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.32, type: "spring" }}
              className="w-10 h-10 rounded-full bg-white/30 border-2 border-dashed border-white/60 flex items-center justify-center"
              style={{ marginLeft: "-6px" }}
            >
              <Plus size={14} className="text-[#0D1B2A]/60" />
            </motion.div>
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-extrabold text-[#0D1B2A]" style={{ fontFamily: "var(--font-manrope)" }}>
              Invite your team
            </h2>
            <p className="text-[#4A6650]/80 text-xs font-body mt-0.5">
              Collaborate on projects, count rooms, and run surveys together.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pt-5 pb-6 -mt-4 bg-surface rounded-t-3xl relative z-10">
          <AnimatePresence>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                  <Send size={22} className="text-accent" />
                </div>
                <p className="text-sm font-semibold text-text font-body">Invites sent!</p>
              </motion.div>
            ) : (
              <motion.div className="space-y-3">
                <label className="text-xs font-semibold text-[#222B27] font-body block mb-3">
                  Email addresses
                </label>
                {emails.map((email, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(i, e.target.value)}
                      placeholder={`colleague${i + 1}@company.no`}
                      fieldSize="sm"
                      className="flex-1"
                    />
                    {emails.length > 1 && (
                      <button onClick={() => removeEmail(i)}
                        className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-accent-warm transition-colors shrink-0">
                        <X size={13} />
                      </button>
                    )}
                  </motion.div>
                ))}

                <button
                  onClick={addEmail}
                  className="text-xs text-primary font-semibold font-body underline"
                >
                  Add another
                </button>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
                    Maybe later
                  </Button>
                  <Button size="md" className="flex-1" onClick={handleSend} icon={<UserPlus size={14} />}>
                    Send invites
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const firstName = mockUser.name.split(" ")[0];
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Show invite modal on first visit
  useEffect(() => {
    const timer = setTimeout(() => setShowInviteModal(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: <FolderOpen size={20} className="text-[#7A6BAF]" />, label: "Total projects", value: mockDashboardStats.totalProjects, suffix: "", iconBg: "bg-[#7A6BAF]/10", delay: 0 },
    { icon: <Building2 size={20} className="text-[#4A7AAE]" />, label: "Rooms mapped", value: mockDashboardStats.totalRooms, suffix: "", iconBg: "bg-[#4A7AAE]/10", delay: 1 },
    { icon: <TrendingUp size={20} className="text-[#139485]" />, label: "Avg. utilisation", value: mockDashboardStats.avgUtilisation, suffix: "%", iconBg: "bg-[#139485]/10", delay: 2 },
    { icon: <ClipboardCheck size={20} className="text-[#C47A2C]" />, label: "Survey responses", value: mockDashboardStats.surveysCompleted, suffix: "", iconBg: "bg-[#C47A2C]/10", delay: 3 },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <AnimatePresence>
        {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
      </AnimatePresence>

      <div className="px-2 py-2 max-w-7xl mx-auto space-y-8">
        {/* ── Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden px-8 py-10 bg-brand-gradient"
        >
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "var(--font-manrope)" }}>
                Welcome back, {firstName}
              </h1>
              <p className="text-[#4A6650]/80 text-sm font-body mt-2 max-w-md">
                You have {mockProjects.filter((p) => p.status === "active").length} project(s) in setup — pick up where you left off.
              </p>
              <Button onClick={() => router.push("/project")} className="mt-4">
                View all projects
              </Button>
            </div>

          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div>
          <h2 className="text-base font-extrabold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* ── Projects + Activity ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Recent Projects</h2>
              <button onClick={() => router.push("/project")}
                className="text-xs text-primary font-semibold font-body underline">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {mockProjects.map((project, i) => (
                <motion.div key={project.id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="rounded-2xl border border-border bg-surface p-4 hover:shadow-card-hover hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#139485]/10 to-[#C47A2C]/10 flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-text truncate" style={{ fontFamily: "var(--font-manrope)" }}>{project.name}</p>
                        <p className="text-xs text-text-muted font-body truncate">{project.buildingName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={project.status} />
                      <ArrowRight size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-text-muted font-body">
                    <span>{project.floors} floors</span>
                    <span>{project.rooms} rooms</span>
                    <span>{project.surveyResponses} responses</span>
                    <span className="ml-auto flex items-center gap-1"><Clock size={11} /> {project.lastUpdated}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted font-body">Completion</span>
                      <span className="font-semibold text-text">{project.completionPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${project.completionPct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#bfa483]"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>Recent Activity</h2>
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative">
                <div className="divide-y divide-border">
                  {mockActivity.map((item, i) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors"
                    >
                      <div className={cn("relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0", ACTIVITY_COLORS[item.type])}>
                        {ACTIVITY_ICONS[item.type]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text font-body leading-snug">
                          <span className="font-semibold">{item.user}</span>{" "}{item.action}{" "}
                          <span className="text-primary font-medium">{item.target}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
