"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Eye, Plus, ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { mockSurveyRecords } from "@/lib/mockData";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const MotionTableRow = motion.create(TableRow);

type FilterTab = "all" | "sent" | "draft" | "archived";

const STATUS_STYLES: Record<string, string> = {
  sent:     "bg-accent/10 text-accent",
  draft:    "bg-amber-500/10 text-amber-600",
  archived: "bg-border text-text-muted",
};

export default function SurveysPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const filtered = mockSurveyRecords.filter((s) => {
    const matchStatus  = filter === "all" || s.status === filter;
    const matchProject = projectFilter === "all" || s.project === projectFilter;
    return matchStatus && matchProject;
  });

  const projects = Array.from(new Set(mockSurveyRecords.map((s) => s.project)));

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all",      label: "All" },
    { id: "sent",     label: "Sent" },
    { id: "draft",    label: "Draft" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Surveys" }]}>
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
              Surveys
            </h1>
            <p className="text-sm text-text-muted font-body mt-1">
              {mockSurveyRecords.length} surveys across {projects.length} projects
            </p>
          </div>
          <Button icon={<Plus size={16} />}>Create new survey</Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#E0F2F2" }}>
            {FILTER_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  filter === id
                    ? "bg-white shadow-sm text-primary border border-border"
                    : "text-text-muted hover:text-text"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Project dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-text-muted hidden" />
            <div className="relative min-w-[140px]">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#969696] bg-white text-[#222B27] transition-all duration-200 pr-10 cursor-pointer hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] h-9 text-xs px-4"
              >
                <option value="all">All projects</option>
                {projects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A1B2] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No surveys found"
            subtitle="No surveys match your current filter. Try adjusting the filters above."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey Name</TableHead>
                <TableHead className="hidden md:table-cell">Project / Floor</TableHead>
                <TableHead className="hidden lg:table-cell w-20">Sent To</TableHead>
                <TableHead className="hidden lg:table-cell w-24">Responses</TableHead>
                <TableHead className="hidden sm:table-cell w-40">Completion</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((survey, i) => {
                const pct = survey.sentTo > 0 ? Math.round((survey.responses / survey.sentTo) * 100) : 0;
                return (
                  <MotionTableRow
                    key={survey.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Survey Name */}
                    <TableCell className="min-w-0">
                      <p className="text-sm text-text font-body truncate">{survey.name}</p>
                      <p className="text-xs text-text-muted font-body">{survey.createdAt}</p>
                    </TableCell>

                    {/* Project / Floor */}
                    <TableCell className="hidden md:table-cell min-w-0">
                      <p className="text-xs font-medium text-text font-body truncate">{survey.project}</p>
                      <p className="text-xs text-text-muted font-body truncate">{survey.floor}</p>
                    </TableCell>

                    {/* Sent To */}
                    <TableCell className="hidden lg:table-cell tabular-nums">{survey.sentTo > 0 ? survey.sentTo : "—"}</TableCell>

                    {/* Responses */}
                    <TableCell className="hidden lg:table-cell text-text tabular-nums">{survey.responses}</TableCell>

                    {/* Completion bar */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all bg-[#bfa483]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-text w-8 text-right">{pct}%</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-body whitespace-nowrap", STATUS_STYLES[survey.status])}>
                        {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <button
                        onClick={() => router.push(`/surveys/${survey.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors font-body whitespace-nowrap"
                      >
                        <Eye size={13} /> View
                      </button>
                    </TableCell>
                  </MotionTableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  );
}
