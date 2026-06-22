"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Layers, ClipboardList, Users,
  CheckCircle2, UserPlus, BarChart2,
  MapPin, Gem,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { mockProject, mockTeamMembers } from "@/lib/mockData";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "floors",   label: "Floors",   icon: Layers },
  { id: "team",     label: "Team",     icon: Users },
] as const;

type Tab = typeof TABS[number]["id"];

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string | number; color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4 flex-1">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>{value}</p>
        <p className="text-xs text-text-muted font-body mt-1">{label}</p>
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const totalRooms  = mockProject.floors.reduce((s, f) => s + f.rooms.length, 0);
  const totalZones  = mockProject.floors.reduce((s, f) => s + f.zones.length, 0);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Layers size={20} className="text-[#7A6BAF]" />}       label="Floors"            value={mockProject.floors.length} color="bg-[#7A6BAF]/10" />
        <StatCard icon={<Building2 size={20} className="text-[#4A7AAE]" />}    label="Rooms"             value={totalRooms}                color="bg-[#4A7AAE]/10" />
        <StatCard icon={<MapPin size={20} className="text-[#139485]" />}       label="Zones"             value={totalZones}                color="bg-[#139485]/10" />
        <StatCard icon={<ClipboardList size={20} className="text-[#C47A2C]" />} label="Survey Responses" value={57}                        color="bg-[#C47A2C]/10" />
      </div>

      {/* Building summary */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-extrabold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
          Building summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Building name",    value: mockProject.buildingName },
            { label: "Project name",     value: mockProject.name },
            { label: "Total floors",     value: `${mockProject.floors.length} floors` },
            { label: "Project status",   value: "Active" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-text-muted font-body">{item.label}</span>
              <span className="text-xs font-semibold text-text font-body">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lease parameters */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
            Lease parameters
          </h3>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600">
            <Gem size={10} /> Premium
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Lease start",    value: "Jan 1, 2023" },
            { label: "Lease end",      value: "Dec 31, 2026" },
            { label: "Monthly rent",   value: "Nok 148,500" },
            { label: "Area (sqm)",     value: "3,200 m²" },
            { label: "Cost per sqm",   value: "Nok 46.4" },
            { label: "Lease type",     value: "Full service" },
          ].map((item) => (
            <div key={item.label} className="bg-[#F2E7DB] rounded-xl p-3">
              <p className="text-[11px] text-text-muted font-body mb-1">{item.label}</p>
              <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Floors tab ───────────────────────────────────────────────────────────────
function FloorsTab() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
          {mockProject.floors.length} floor{mockProject.floors.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" icon={<Layers size={14} />}>Add floor</Button>
      </div>

      {mockProject.floors.map((floor, i) => {
        const totalRooms = floor.rooms.length + (floor.detectedRooms?.length ?? 0);
        const counted    = floor.rooms.filter((r) => r.status === "counted").length;
        const pct        = totalRooms > 0 ? Math.round((counted / totalRooms) * 100) : 0;

        return (
          <motion.div
            key={floor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-surface p-4 hover:border-primary/20 hover:shadow-card transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Floor icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                <Layers size={22} className="text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{floor.name}</p>
                  {pct === 100 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted font-body mb-2">
                  <span>{floor.rooms.length} rooms drawn</span>
                  <span>{floor.detectedRooms?.length ?? 0} Ai-detected</span>
                  <span>{floor.zones.length} zones</span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                      className="h-full rounded-full bg-[#bfa483]"
                    />
                  </div>
                  <span className="text-xs font-semibold text-text w-8 text-right">{pct}%</span>
                </div>
              </div>

              {/* Open canvas button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/project/${projectId}/floor/${floor.id}`)}
              >
                Open canvas
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Team tab ─────────────────────────────────────────────────────────────────
const PASTEL_COLORS = [
  "bg-[#7A6BAF]/10 text-[#7A6BAF]",
  "bg-[#4A7AAE]/10 text-[#4A7AAE]",
  "bg-[#139485]/10 text-[#139485]",
  "bg-[#C47A2C]/10 text-[#C47A2C]",
];

function TeamTab() {
  const ROLE_COLORS: Record<string, string> = {
    Admin:    "bg-primary/10 text-primary",
    Analyst:  "bg-accent/10 text-accent",
    Observer: "bg-amber-500/10 text-amber-600",
  };

  if (mockTeamMembers.length === 0) {
    return (
      <EmptyState
        title="No team members yet"
        subtitle="Invite colleagues to collaborate on this project. They can view floors, count rooms, and conduct surveys."
        ctaLabel="Invite member"
        onCta={() => {}}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
          {mockTeamMembers.length} member{mockTeamMembers.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" icon={<UserPlus size={14} />}>Add member</Button>
      </div>

      {mockTeamMembers.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 hover:border-primary/20 hover:shadow-card transition-all"
        >
          {/* Avatar */}
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0", PASTEL_COLORS[i % 4])}>
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text font-body">{member.name}</p>
            <p className="text-xs text-text-muted font-body">{member.email}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", ROLE_COLORS[member.role] ?? "bg-border text-text-muted")}>
              {member.role}
            </span>
            <span className="text-xs text-text-muted font-body hidden sm:inline">Joined {member.joinedAt}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <AppLayout breadcrumbs={[{ label: "Projects", href: "/project" }, { label: mockProject.name }]}>
      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#139485]/10 flex items-center justify-center shrink-0">
              <Building2 size={26} className="text-[#139485]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                {mockProject.name}
              </h1>
              <p className="text-sm text-text-muted font-body flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {mockProject.buildingName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" /> Active
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold font-body border-b-2 -mb-px transition-all",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "floors"   && <FloorsTab />}
            {activeTab === "team"     && <TeamTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
