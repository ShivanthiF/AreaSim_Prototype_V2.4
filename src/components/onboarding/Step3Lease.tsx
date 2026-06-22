"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";

interface FormValues {
  totalArea: string;
  annualRent: string;
  commonAreaCost: string;
  leaseExpirationDate: string;
  targetHeadcount: number;
  consultantsCount: number;
  showConsultants: boolean;
  consultantFTE: 0.5 | 1;
}

// ─── SVG icons ─────────────────────────────────────────────────────────────────
function AreaIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="#2C7A53" strokeWidth="1.3" /><path d="M1.5 5.5h11M5.5 1.5v11" stroke="#2C7A53" strokeWidth=".9" strokeDasharray="2 1.5" /></svg>; }
function RentIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="4.5" width="12" height="8" rx="1.5" stroke="#3A6FB5" strokeWidth="1.3" /><path d="M4.5 4.5V3.5a2.5 2.5 0 0 1 5 0v1" stroke="#3A6FB5" strokeWidth="1.3" /><circle cx="7" cy="8.5" r="1.2" fill="#3A6FB5" /></svg>; }
function CommonIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L1.5 5v7.5h4V9h3v3.5h4V5L7 1.5z" stroke="#B06E0A" strokeWidth="1.3" strokeLinejoin="round" /></svg>; }
function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="#3A6FB5" strokeWidth="1.3" /><path d="M1.5 6h11" stroke="#3A6FB5" strokeWidth="1" /><path d="M4.5 1v3M9.5 1v3" stroke="#3A6FB5" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
function PeopleIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="#2C7A53" strokeWidth="1.3" /><path d="M2 12.5c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#2C7A53" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
function ConsultantIcon() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="4.5" cy="4.5" r="2" stroke="#6D5FAD" strokeWidth="1.3" /><path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#6D5FAD" strokeWidth="1.3" strokeLinecap="round" /><circle cx="10.5" cy="4.5" r="2" stroke="#6D5FAD" strokeWidth="1.3" /><path d="M10.5 8.5c1.4.4 2.5 1.7 2.5 3" stroke="#6D5FAD" strokeWidth="1.3" strokeLinecap="round" /></svg>; }

// ─── Icon + label + full-width input ───────────────────────────────────────────
function IconInput({
  icon, iconBg, label, hint, prefix, suffix, value, onChange, placeholder,
}: {
  icon: React.ReactNode; iconBg: string; label: string;
  hint?: string; prefix?: string; suffix?: string;
  value: string; onChange: (raw: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          {icon}
        </div>
        <label className="text-sm font-medium text-text font-body">{label}</label>
      </div>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-[11px] font-semibold text-text-muted font-mono select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onFocus={(e) => {
            // show raw number on focus
            e.target.value = value.replace(/[^\d]/g, "");
          }}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          onBlur={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          className="w-full rounded-xl border border-[#969696] bg-white px-4 py-2.5 text-sm text-[#222B27] font-body placeholder:text-[#98A1B2] hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] transition-all duration-200"
          style={{ paddingLeft: prefix ? "40px" : undefined, paddingRight: suffix ? "44px" : undefined }}
        />
        {suffix && (
          <span className="absolute right-3 text-[11px] font-semibold text-text-muted font-mono select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-text-muted font-body">{hint}</p>}
    </div>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onToggle, activeColor = "var(--color-primary)" }: {
  checked: boolean; onToggle: () => void; activeColor?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onToggle}
      className="relative w-10 h-[22px] rounded-full transition-colors duration-200 focus:outline-none shrink-0"
      style={{ background: checked ? activeColor : "var(--color-border)" }}>
      <span className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }} />
    </button>
  );
}

interface Props { onNext: () => void; }

export function Step3Lease({ onNext }: Props) {
  const { leaseParams, setLeaseParams } = useOnboardingStore();

  const defaults: FormValues = {
    totalArea: leaseParams.totalArea || "",
    annualRent: leaseParams.annualRent || "",
    commonAreaCost: leaseParams.commonAreaCost || "",
    leaseExpirationDate: leaseParams.leaseExpirationDate || "",
    targetHeadcount: leaseParams.targetHeadcount || 0,
    consultantsCount: leaseParams.consultantsCount ?? 0,
    showConsultants: leaseParams.showConsultants ?? false,
    consultantFTE: leaseParams.consultantFTE ?? 0.5,
  };

  const { watch, setValue, handleSubmit } = useForm<FormValues>({ defaultValues: defaults });

  useEffect(() => {
    setLeaseParams({ ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = watch((values) => {
      setLeaseParams({
        totalArea: String(values.totalArea ?? ""),
        annualRent: String(values.annualRent ?? ""),
        commonAreaCost: String(values.commonAreaCost ?? ""),
        leaseExpirationDate: String(values.leaseExpirationDate ?? ""),
        targetHeadcount: Number(values.targetHeadcount) || 1,
        consultantsCount: Number(values.consultantsCount) || 0,
        showConsultants: Boolean(values.showConsultants),
        consultantFTE: values.consultantFTE ?? 0.5,
      });
    });
    return () => sub.unsubscribe();
  }, [watch, setLeaseParams]);

  const totalArea = watch("totalArea");
  const annualRent = watch("annualRent");
  const commonAreaCost = watch("commonAreaCost");
  const leaseExpirationDate = watch("leaseExpirationDate");
  const employees = watch("targetHeadcount");
  const consultants = watch("consultantsCount");
  const showConsultants = watch("showConsultants");
  const consultantFTE = watch("consultantFTE");

  const fmt = (n: string | number) => Number(n) > 0 ? Number(n).toLocaleString("nb-NO") : "";

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.form id="lease-form" variants={stagger} initial="hidden" animate="visible"
      onSubmit={handleSubmit(onNext)} className="space-y-5">

      <motion.div variants={item}>
        <IconInput icon={<PeopleIcon />} iconBg="#EAF5EE"
          label="Permanent employees" hint="Full-time staff headcount"
          placeholder="12" suffix="ppl"
          value={employees > 0 ? String(employees) : ""}
          onChange={(v) => setValue("targetHeadcount", Math.min(5000, parseInt(v) || 0))}
        />
      </motion.div>

      {/* ── Consultants ── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between ,y-1">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: "#F0EEFF" }}>
              <ConsultantIcon />
            </div>
            <span className="text-sm font-medium text-text font-body">Consultants</span>
          </div>
          <Toggle checked={!!showConsultants} onToggle={() => setValue("showConsultants", !showConsultants)} />
        </div>

        <AnimatePresence initial={false}>
          {showConsultants && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden">
              <div className="mt-2 p-4 rounded-xl border" style={{ background: "#F0EEFF", borderColor: "#DDD8F7" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#6D5FAD" }}>External consultants</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(109,95,173,0.14)", color: "#6D5FAD" }}>
                    counts as {consultantFTE}
                  </span>
                </div>
                <p className="text-[11px] mb-3" style={{ color: "rgba(109,95,173,0.65)" }}>
                  Project-based staff — shared desks, rotational presence
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-text-muted font-body">How many?</span>
                  <div className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5" style={{ background: "rgba(255,255,255,0.7)", borderColor: "#DDD8F7" }}>
                    <input type="text" inputMode="numeric" value={consultants} onFocus={(e) => e.target.select()}
                      onChange={(e) => setValue("consultantsCount", Math.min(200, Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0)))}
                      className="w-10 text-right text-sm font-bold bg-transparent focus:outline-none" style={{ color: "#6D5FAD" }} />
                    <span className="text-[11px] font-semibold text-text-muted font-mono">ppl</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#6D5FAD" }}>Count as 1 employee each</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(109,95,173,0.55)" }}>
                      {consultantFTE === 1 ? "Each consultant occupies a dedicated seat" : "Default: 0.5 — shared desk, rotational presence"}
                    </p>
                  </div>
                  <Toggle checked={consultantFTE === 1} onToggle={() => setValue("consultantFTE", consultantFTE === 1 ? 0.5 : 1)} activeColor="#6D5FAD" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={item}>
        <IconInput icon={<AreaIcon />} iconBg="#EAF5EE"
          label="Total area" hint="m² — total leasable floor area"
          placeholder="760" suffix="m²"
          value={fmt(totalArea)}
          onChange={(v) => setValue("totalArea", v)}
        />
      </motion.div>

      <motion.div variants={item}>
        <IconInput icon={<RentIcon />} iconBg="#EBF2FF"
          label="Annual rent" hint="NOK per year"
          placeholder="2 250 000" prefix="NOK"
          value={fmt(annualRent)}
          onChange={(v) => setValue("annualRent", v)}
        />
      </motion.div>

      <motion.div variants={item}>
        <IconInput icon={<CommonIcon />} iconBg="#FDF0E4"
          label="Common area cost" hint="NOK per year"
          placeholder="300 000" prefix="NOK"
          value={fmt(commonAreaCost)}
          onChange={(v) => setValue("commonAreaCost", v)}
        />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: "#EBF2FF" }}>
              <CalendarIcon />
            </div>
            <label className="text-sm font-medium text-text font-body">Lease expiration date</label>
          </div>
          <input
            type="date"
            value={leaseExpirationDate}
            onChange={(e) => setValue("leaseExpirationDate", e.target.value)}
            className="w-full rounded-xl border border-[#969696] bg-white px-4 py-2.5 text-sm font-body hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] transition-all duration-200"
            style={{ color: leaseExpirationDate ? "var(--color-text)" : "var(--color-text-muted)" }}
          />
        </div>
      </motion.div>


    </motion.form>
  );
}
