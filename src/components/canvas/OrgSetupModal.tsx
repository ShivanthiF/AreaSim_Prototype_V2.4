"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

// Org-setup data (ported from the counting prototype)
const ORG_MODELS = [
  "Team-based organization",
  "Product-oriented organization",
  "Project-based organization",
  "Agile organization",
  "Matrix organization",
  "Hybrid organization",
  "Other",
];

const TRANSITION_OPTIONS = [
  "No planned transition",
  "Moving toward Agile",
  "Moving toward Hybrid",
  "Moving toward Product-oriented",
  "Evaluating options",
  "In active transformation",
];

export interface OrgModel {
  model: string;
  transition: string;
}

interface OrgSetupModalProps {
  open: boolean;
  /** Dismiss without proceeding (X / backdrop / Esc). */
  onClose: () => void;
  /** Proceed to counting — fired by both "Skip for now" and "Continue to counting". */
  onComplete: (org: OrgModel) => void;
}

/** "Tell us about your organisation" — shown before the counting flow begins. */
export function OrgSetupModal({ open, onClose, onComplete }: OrgSetupModalProps) {
  const [model, setModel] = useState("");
  const [transition, setTransition] = useState("");

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* ── Header ── */}
      <div className="mb-5 pr-8">
        <Chip tone="info">Before you start counting</Chip>
        <h2
          className="mt-3 text-xl text-text leading-tight"
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
        >
          Tell us about your organisation
        </h2>
        <p className="mt-1.5 text-sm text-text-muted font-body leading-relaxed">
          Helps us tailor observation guidance and connect your workplace data to how your teams work.
        </p>
      </div>

      {/* ── Fields ── */}
      <div className="flex flex-col gap-4">
        <div>
          <Select
            label="Current organisational model"
            placeholder="Select organisational model…"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={ORG_MODELS.map((m) => ({ value: m, label: m }))}
          />
          {model && (
            <div
              className="mt-2 rounded-lg px-3 py-2 text-xs leading-relaxed font-body"
              style={{
                background: "#F0EEFF",
                border: "1px solid rgba(152,135,219,0.3)",
                color: "#6351AC",
              }}
            >
              Observation prompts will be tailored for a <strong>{model}</strong>.
            </div>
          )}
        </div>

        <Select
          label="Planning to transition to a different model?"
          placeholder="Select future direction…"
          value={transition}
          onChange={(e) => setTransition(e.target.value)}
          options={TRANSITION_OPTIONS.map((t) => ({ value: t, label: t }))}
        />
      </div>

      {/* ── Actions — equal width, pill shaped ── */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={() => onComplete({ model: "", transition: "" })}
        >
          Skip for now
        </Button>
        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={!model}
          icon={<ChevronRight size={16} />}
          iconPosition="right"
          onClick={() => onComplete({ model, transition })}
        >
          Continue to counting
        </Button>
      </div>
    </Modal>
  );
}
