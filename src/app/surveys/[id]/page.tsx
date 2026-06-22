"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ArrowLeft, ClipboardList } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockSurveyRecords } from "@/lib/mockData";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const survey = mockSurveyRecords.find((s) => s.id === params.id);

  if (!survey) {
    return (
      <AppLayout breadcrumbs={[{ label: "Surveys", href: "/surveys" }, { label: "Not Found" }]}>
        <div className="flex items-center justify-center h-full text-text-muted font-body">Survey not found.</div>
      </AppLayout>
    );
  }

  const pct = survey.sentTo > 0 ? Math.round((survey.responses / survey.sentTo) * 100) : 0;

  return (
    <AppLayout breadcrumbs={[{ label: "Surveys", href: "/surveys" }, { label: survey.name }]}>
      <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/surveys")}
              className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <ClipboardList size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                {survey.name}
              </h1>
              <p className="text-sm text-text-muted font-body mt-0.5">{survey.project} · {survey.floor}</p>
            </div>
          </div>
          <button
            onClick={() => toast({ type: "info", title: "Export coming soon — upgrade to Professional to unlock." })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-text-muted hover:text-text hover:border-primary/40 transition-all font-body"
          >
            <Download size={14} /> Export
          </button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Sent To",    value: survey.sentTo || "—" },
            { label: "Responses", value: survey.responses },
            { label: "Completion", value: `${pct}%` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{stat.value}</p>
              <p className="text-xs text-text-muted font-body tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Questions */}
        {survey.questions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-muted font-body">No responses yet — this survey is still in draft.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-base font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
              Response Breakdown
            </h2>
            {survey.questions.map((q, qi) => {
              const total = q.responses.reduce((s, r) => s + r.count, 0);
              const maxCount = Math.max(...q.responses.map((r) => r.count));
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qi * 0.1 }}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <p className="text-sm font-semibold text-text mb-4 font-body">
                    <span className="text-text-muted font-normal mr-2">Q{qi + 1}.</span>
                    {q.text}
                  </p>
                  <div className="space-y-3">
                    {q.responses.map((resp) => {
                      const barPct = total > 0 ? Math.round((resp.count / total) * 100) : 0;
                      const isMax  = resp.count === maxCount && resp.count > 0;
                      return (
                        <div key={resp.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={cn("font-body", isMax ? "font-semibold text-text" : "text-text-muted")}>
                              {resp.label}
                            </span>
                            <span className="font-semibold text-text">{resp.count} <span className="text-text-muted font-normal">({barPct}%)</span></span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barPct}%` }}
                              transition={{ delay: 0.2 + qi * 0.1, duration: 0.7, ease: "easeOut" }}
                              className={cn("h-full rounded-full", isMax ? "bg-gradient-to-r from-primary to-accent" : "bg-border")}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-text-muted font-body mt-3">{total} total responses</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
