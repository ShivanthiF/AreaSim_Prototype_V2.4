"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Clock, Plus, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { mockProjects } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-accent/10 text-accent",
  draft:     "bg-amber-500/10 text-amber-600",
  completed: "bg-primary/10 text-primary",
};

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <AppLayout breadcrumbs={[{ label: "Projects" }]}>
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
              Projects
            </h1>
            <p className="text-sm text-text-muted font-body mt-1">
              {mockProjects.length} projects
            </p>
          </div>
          <Button icon={<Plus size={15} />}>New Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => router.push(`/project/${project.id}`)}
              className="rounded-2xl border border-border bg-surface p-5 hover:shadow-card-hover hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-text truncate" style={{ fontFamily: "var(--font-manrope)" }}>
                      {project.name}
                    </p>
                    <p className="text-xs text-text-muted font-body truncate">{project.buildingName}</p>
                  </div>
                </div>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0", STATUS_STYLES[project.status])}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted font-body mb-3">
                <span>{project.floors} floors</span>
                <span>{project.rooms} rooms</span>
                <span>{project.surveyResponses} responses</span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-muted font-body">Completion</span>
                  <span className="font-semibold text-text">{project.completionPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completionPct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                    className="h-full rounded-full bg-[#bfa483]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-body flex items-center gap-1">
                  <Clock size={11} /> {project.lastUpdated}
                </span>
                <ArrowRight size={14} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
