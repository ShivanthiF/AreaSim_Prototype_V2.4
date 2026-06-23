"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Check, User, CheckCircle2 } from "lucide-react";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { CountingStepper, countingStepHref } from "@/components/ui/CountingStepper";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { mockProject } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

const MotionTableRow = motion.create(TableRow);

// Session-wide context (the same session spans every floor)
const SESSION_LABEL = "Round 2 of 5 today · Day 1 of 14";
const COUNTERS = ["You", "Mikkel T.", "Sara L.", "John K."];

type RoomStatus = "counted" | "ongoing" | "pending";

function hash(s: string) {
  return s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

/** Deterministic mock session state for a room (so the screen is stable). */
function roomSession(id: string): { status: RoomStatus; count: number; by: string } {
  const h = hash(id);
  const m = h % 5;
  const status: RoomStatus = m < 3 ? "counted" : m === 3 ? "ongoing" : "pending";
  return {
    status,
    count: status === "counted" ? (h % 12) + 1 : 0,
    by: COUNTERS[h % COUNTERS.length],
  };
}

function StatusChip({ status }: { status: RoomStatus }) {
  if (status === "counted") {
    return <Chip tone="success" icon={<Check size={9} strokeWidth={3} />}>Counted</Chip>;
  }
  if (status === "ongoing") {
    return (
      <Chip tone="warning" icon={<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />}>
        Ongoing
      </Chip>
    );
  }
  return <Chip tone="neutral">Pending</Chip>;
}

export default function SessionOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Build a unified room list per floor (fall back to AI-detected rooms when
  // no rooms have been drawn yet) and attach mock session state.
  const floors = useMemo(
    () =>
      mockProject.floors.map((floor) => {
        const baseRooms =
          floor.rooms.length > 0
            ? floor.rooms.map((r) => ({ id: r.id, name: r.name, sqm: r.sqm, category: r.category }))
            : (floor.detectedRooms ?? []).map((d) => ({ id: d.id, name: d.name, sqm: d.sqm, category: undefined as string | undefined }));
        const rooms = baseRooms.map((r) => ({ ...r, ...roomSession(r.id) }));
        const counted = rooms.filter((r) => r.status === "counted").length;
        return { id: floor.id, name: floor.name, rooms, counted, total: rooms.length };
      }),
    []
  );

  const totalRooms = floors.reduce((s, f) => s + f.total, 0);
  const totalCounted = floors.reduce((s, f) => s + f.counted, 0);
  const overallPct = totalRooms > 0 ? Math.round((totalCounted / totalRooms) * 100) : 0;
  const allDone = totalCounted === totalRooms && totalRooms > 0;

  const firstFloorId = mockProject.floors[0]?.id;

  return (
    <div className="h-screen bg-bg flex flex-col font-body overflow-hidden">
      {/* ── Header ── */}
      <header className="bg-white px-3 py-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/project/${projectId}/floor/${firstFloorId}`)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[220px]">
              {mockProject.name}
            </span>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push(`/project/${projectId}/floor/${firstFloorId}/count#session-details`)}
          >
            Back to counting
          </Button>
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />
      <CountingStepper
        activeStep="active-session"
        onStepClick={(id) => router.push(countingStepHref(projectId, firstFloorId ?? "", id))}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto w-full space-y-6">

          {/* ── Session summary ── */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-body">
                <span className="text-text-muted">Room counting tool</span>
                <span className="text-text-muted">/</span>
                <span className="font-semibold text-text">Session overview</span>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h1 className="text-xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>
                  Session overview
                </h1>
                <p className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-manrope)" }}>
                  {SESSION_LABEL}
                </p>
              </div>
              <p className="text-sm text-text-muted font-body">
                Track every room across all floors in this counting session. A session is complete only when all rooms on all floors have been counted.
              </p>
            </div>

            {/* Overall progress */}
            <div className="rounded-2xl bg-surface-2 border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-text font-body">
                  {allDone ? "All rooms counted this session" : "Rooms counted this session"}
                </span>
                <span className="text-sm font-bold text-text font-body tabular-nums">
                  {totalCounted} / {totalRooms} · {overallPct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white border border-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 0.7 }}
                  className="h-full rounded-full bg-[#bfa483]"
                />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-text-muted font-body">
                <span>{floors.length} floors</span>
                <span>{totalRooms} rooms total</span>
                <span>{totalCounted} counted</span>
                <span>{totalRooms - totalCounted} remaining</span>
              </div>
            </div>
          </div>

          {/* ── Per-floor breakdown ── */}
          {floors.map((floor, fi) => {
            const pct = floor.total > 0 ? Math.round((floor.counted / floor.total) * 100) : 0;
            const floorDone = floor.counted === floor.total && floor.total > 0;
            return (
              <motion.section
                key={floor.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fi * 0.06 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4"
              >
                {/* Floor header */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7A6BAF]/10 flex items-center justify-center shrink-0">
                    <Layers size={20} className="text-[#7A6BAF]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>
                      {floor.name}
                    </h2>
                    {floorDone && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-3 min-w-[200px] flex-1 max-w-[360px]">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + fi * 0.06, duration: 0.6 }}
                        className="h-full rounded-full bg-[#bfa483]"
                      />
                    </div>
                    <span className="text-xs font-semibold text-text tabular-nums w-16 text-right">
                      {floor.counted}/{floor.total}
                    </span>
                  </div>
                </div>

                {/* Rooms table */}
                {floor.total === 0 ? (
                  <div className="rounded-xl border border-border bg-surface-2 py-8 text-center text-sm text-text-muted font-body">
                    No rooms mapped on this floor yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Square meters</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Counted by</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floor.rooms.map((room, ri) => (
                        <MotionTableRow
                          key={room.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ri * 0.03 }}
                        >
                          <TableCell className="text-text">{room.name}</TableCell>
                          <TableCell>{formatNumber(room.sqm || 25)} m²</TableCell>
                          <TableCell><StatusChip status={room.status} /></TableCell>
                          <TableCell>
                            {room.status === "pending" ? (
                              "—"
                            ) : (
                              <span className="inline-flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#7A6BAF]/10 flex items-center justify-center shrink-0">
                                  <User size={10} className="text-[#7A6BAF]" />
                                </span>
                                {room.by}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {room.status === "counted" ? room.count : "—"}
                          </TableCell>
                        </MotionTableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </motion.section>
            );
          })}

          {/* ── Completion note ── */}
          <div
            className={cn(
              "rounded-2xl border p-5 text-sm font-body",
              allDone
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-[#FBF6EE] border-[#F6DFA0] text-[#8A5E1A]"
            )}
          >
            {allDone
              ? "Every room on every floor has been counted for this session — you're ready to submit."
              : `${totalRooms - totalCounted} room${totalRooms - totalCounted === 1 ? "" : "s"} across ${floors.filter((f) => f.counted < f.total).length} floor${floors.filter((f) => f.counted < f.total).length === 1 ? "" : "s"} still need counting before this session is complete.`}
          </div>
        </div>
      </main>
    </div>
  );
}
