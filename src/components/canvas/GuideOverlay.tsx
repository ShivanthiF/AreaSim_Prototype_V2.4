"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ─── Illustrations ────────────────────────────────────────────────────────────

function RoomListIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="8" width="220" height="92" rx="6" fill="white" stroke="#E5EAF0" strokeWidth="1.2" />
      <rect x="30" y="8" width="220" height="22" rx="6" fill="#FFFBF8" />
      <rect x="30" y="24" width="220" height="6" fill="#FFFBF8" />
      <text x="44" y="22" fontSize="8" fontWeight="700" fill="#0D1B2A">Rooms</text>
      <motion.rect x="30" y="30" width="220" height="24" fill="#EEF4FF"
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <circle cx="44" cy="42" r="4" fill="#C8D8E4" />
      <text x="52" y="45" fontSize="7.5" fontWeight="700" fill="#374151">Conference Room A</text>
      <motion.g animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
        style={{ transformOrigin: "222px 42px" }}>
        <rect x="194" y="36" width="46" height="13" rx="6.5" fill="#8E84CC" />
        <text x="217" y="45" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="700">Verify</text>
      </motion.g>
      {[54, 70, 86].map((y, i) => (
        <g key={i}>
          <rect x="30" y={y} width="220" height="16" fill="white" />
          <circle cx="44" cy={y + 8} r="3.5" fill="#E5EAF0" />
          <rect x="52" y={y + 4} width={60 - i * 8} height="6" rx="3" fill="#F0F4F8" />
        </g>
      ))}
    </svg>
  );
}

function DrawRoomIllustration() {
  const pts: [number, number][] = [[52, 84], [52, 30], [160, 30], [192, 60], [192, 84]];
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[70, 140, 210].map(x => <line key={x} x1={x} y1="8" x2={x} y2="100" stroke="#E5EAF0" strokeWidth="0.8" />)}
      {[36, 72].map(y => <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="#E5EAF0" strokeWidth="0.8" />)}
      <rect x="204" y="16" width="52" height="40" rx="2" fill="rgba(142,132,204,0.05)" stroke="#8E84CC" strokeWidth="1" strokeDasharray="4 3" />
      <motion.polygon points={pts.map(p => p.join(",")).join(" ")}
        fill="rgba(142,132,204,0.12)" stroke="#8E84CC" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }} />
      {pts.map((pt, i) => {
        const next = pts[(i + 1) % pts.length];
        return <motion.line key={i} x1={pt[0]} y1={pt[1]} x2={next[0]} y2={next[1]}
          stroke="#8E84CC" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.25, duration: 0.22, repeat: Infinity, repeatDelay: 2.5 }} />;
      })}
      {pts.map((pt, i) => (
        <motion.circle key={i} cx={pt[0]} cy={pt[1]} r={i === 0 ? 5 : 3.5}
          fill={i === 0 ? "#58B39E" : "#8E84CC"} stroke="white" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.25, duration: 0.18, type: "spring", repeat: Infinity, repeatDelay: 2.5 }} />
      ))}
    </svg>
  );
}

function AnimatedGroupZonesIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.rect x="22" y="18" width="88" height="72" rx="4"
        fill="rgba(142,132,204,0.09)" stroke="#8E84CC" strokeWidth="1.5"
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4, repeat: Infinity, repeatDelay: 2.8 }} />
      <motion.text x="66" y="58" textAnchor="middle" fontSize="8" fill="#8E84CC" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3, repeat: Infinity, repeatDelay: 2.8 }}>Office 1</motion.text>
      <motion.rect x="122" y="18" width="88" height="72" rx="4"
        fill="rgba(209,164,95,0.10)" stroke="#D1A45F" strokeWidth="1.5"
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4, repeat: Infinity, repeatDelay: 2.8 }} />
      <motion.text x="166" y="58" textAnchor="middle" fontSize="8" fill="#8E84CC" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3, repeat: Infinity, repeatDelay: 2.8 }}>Office 2</motion.text>
      <motion.line x1="110" y1="54" x2="122" y2="54" stroke="#58B39E" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.3, repeat: Infinity, repeatDelay: 2.8 }} />
      <motion.rect x="14" y="10" width="204" height="88" rx="8"
        fill="transparent" stroke="#58B39E" strokeWidth="2" strokeDasharray="8 5"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0.3] }}
        transition={{ delay: 1.4, duration: 0.5, repeat: Infinity, repeatDelay: 2.8 }} />
      <motion.rect x="70" y="90" width="92" height="16" rx="8" fill="#D1A45F"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.3, type: "spring", repeat: Infinity, repeatDelay: 2.8 }} />
      <motion.text x="116" y="101" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.2, repeat: Infinity, repeatDelay: 2.8 }}>Zone A — Marketing</motion.text>
      <motion.rect x="222" y="28" width="46" height="52" rx="3"
        fill="rgba(88,179,158,0.10)" stroke="#58B39E" strokeWidth="1.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3, repeat: Infinity, repeatDelay: 2.8 }} />
    </svg>
  );
}

function GroupButtonIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="8" width="220" height="92" rx="6" fill="white" stroke="#E5EAF0" strokeWidth="1.2" />
      <rect x="30" y="8" width="220" height="22" rx="6" fill="#FFFBF8" />
      <rect x="30" y="24" width="220" height="6" fill="#FFFBF8" />
      <text x="44" y="22" fontSize="8" fontWeight="700" fill="#0D1B2A">Rooms</text>
      <motion.rect x="30" y="30" width="220" height="24" fill="#EEF4FF"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <circle cx="44" cy="42" r="4" fill="#C8D8E4" />
      <text x="52" y="45" fontSize="7.5" fontWeight="700" fill="#374151">Conference Room A</text>
      {/* Group button pulsing */}
      <motion.g animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.5 }}
        style={{ transformOrigin: "177px 42px" }}>
        <rect x="150" y="36" width="42" height="13" rx="6.5" fill="#D1A45F" />
        <text x="171" y="45" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="700">Group</text>
      </motion.g>
      <motion.rect x="30" y="54" width="220" height="20"
        animate={{ opacity: [1, 0.85, 1] }} transition={{ delay: 0.6, duration: 1.8, repeat: Infinity }} fill="white" />
      <circle cx="44" cy="64" r="3.5" fill="#E5EAF0" />
      <text x="52" y="67" fontSize="7" fill="#6B7280">Conference Room B</text>
      <motion.rect x="234" y="58" width="10" height="10" rx="2"
        stroke="#D1A45F" strokeWidth="1.5" fill="transparent"
        animate={{ opacity: [0, 1, 0] }} transition={{ delay: 1.2, duration: 1.0, repeat: Infinity, repeatDelay: 1.2 }} />
      {[74, 88].map((y, i) => (
        <g key={i}>
          <rect x="30" y={y} width="220" height="14" fill="white" />
          <circle cx="44" cy={y + 7} r="3" fill="#E5EAF0" />
          <rect x="52" y={y + 3} width={55 - i * 10} height="6" rx="3" fill="#F0F4F8" />
        </g>
      ))}
    </svg>
  );
}

function CountingIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="8" width="220" height="34" rx="5" fill="#FFFBF8" stroke="#E5EAF0" strokeWidth="1.2" />
      <text x="44" y="22" fontSize="8" fontWeight="700" fill="#0D1B2A">Rooms</text>
      <motion.g animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.4 }}
        style={{ transformOrigin: "196px 27px" }}>
        <rect x="148" y="18" width="96" height="18" rx="9" fill="#8E84CC" />
        <text x="196" y="30" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">Start room counting</text>
      </motion.g>
      <rect x="30" y="52" width="220" height="52" rx="5" fill="white" stroke="#E5EAF0" strokeWidth="1.2" />
      <text x="44" y="66" fontSize="7.5" fontWeight="700" fill="#374151">Conference Room A</text>
      {[0, 1, 2].map((i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.35, duration: 0.3, type: "spring", repeat: Infinity, repeatDelay: 2.2 }}
          style={{ transformOrigin: `${70 + i * 22}px 84px` }}>
          <circle cx={70 + i * 22} cy={79} r={7} fill="rgba(209,164,95,0.15)" stroke="#D1A45F" strokeWidth="1.2" />
          <circle cx={70 + i * 22} cy={76} r={2.5} fill="#D1A45F" />
          <path d={`M${63 + i * 22} 85 Q${70 + i * 22} 80 ${77 + i * 22} 85`} stroke="#D1A45F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </motion.g>
      ))}
      <motion.g animate={{ scale: [1, 1.1, 1] }} transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
        style={{ transformOrigin: "210px 84px" }}>
        <circle cx="210" cy="84" r="14" fill="#8E84CC" />
        <text x="210" y="89" textAnchor="middle" fontSize="13" fill="white" fontWeight="800">3</text>
      </motion.g>
    </svg>
  );
}

function _ScoreWidgetIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="coinG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8E19C" />
          <stop offset="100%" stopColor="#FFCB71" />
        </linearGradient>
      </defs>
      {/* Widget container */}
      <rect x="18" y="22" width="244" height="64" rx="8" fill="#FBF6EE" stroke="#E5EAF0" strokeWidth="1.2" />
      <line x1="100" y1="22" x2="100" y2="86" stroke="#E5EAF0" strokeWidth="1.2" />
      <line x1="182" y1="22" x2="182" y2="86" stroke="#E5EAF0" strokeWidth="1.2" />
      {/* Rooms */}
      <motion.circle cx="50" cy="54" r="14" fill="url(#coinG)" stroke="#E3B069" strokeWidth="1.5"
        animate={{ boxShadow: undefined, opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <text x="50" y="58" textAnchor="middle" fontSize="11" fontWeight="800" fill="#CC6F35" fontFamily="monospace">11</text>
      <text x="72" y="45" fontSize="7" fill="#92400E" fontWeight="600">Rooms</text>
      <motion.rect x="66" y="62" width="26" height="6" rx="3" fill="#FDE68A"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} />
      {/* Zones */}
      <motion.circle cx="141" cy="54" r="14" fill="url(#coinG)" stroke="#E3B069" strokeWidth="1.5"
        animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
      <text x="141" y="58" textAnchor="middle" fontSize="11" fontWeight="800" fill="#CC6F35" fontFamily="monospace">3</text>
      <text x="162" y="45" fontSize="7" fill="#92400E" fontWeight="600">Zones</text>
      <motion.rect x="156" y="62" width="18" height="6" rx="3" fill="#FDE68A"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }} />
      {/* Survey */}
      <motion.circle cx="221" cy="54" r="14" fill="url(#coinG)" stroke="#E3B069" strokeWidth="1.5"
        animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.0 }} />
      <text x="221" y="58" textAnchor="middle" fontSize="11" fontWeight="800" fill="#CC6F35" fontFamily="monospace">5</text>
      <text x="242" y="45" fontSize="7" fill="#92400E" fontWeight="600">Survey</text>
      <motion.rect x="236" y="62" width="18" height="6" rx="3" fill="#FDE68A"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1.0 }} />
    </svg>
  );
}

function SurveyIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.5 }}
        style={{ transformOrigin: "140px 20px" }}>
        <rect x="84" y="10" width="112" height="20" rx="10" fill="#8E84CC" />
        <text x="140" y="23" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">Conduct Survey</text>
      </motion.g>
      <rect x="22" y="38" width="236" height="62" rx="5" fill="white" stroke="#E5EAF0" strokeWidth="1.2" />
      <rect x="32" y="46" width="120" height="6" rx="3" fill="#E5EAF0" />
      {[0, 1, 2].map((i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.4, duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}>
          <motion.rect x="32" y={58 + i * 13} width="10" height="10" rx="2"
            fill={i === 1 ? "#58B39E" : "white"} stroke={i === 1 ? "#58B39E" : "#C8D8E4"} strokeWidth="1.2"
            animate={i === 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 2.0 }} />
          {i === 1 && (
            <path d="M35 64 L37 67 L41 62" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <rect x="48" y={62 + i * 13} width={80 - i * 14} height="5" rx="2.5" fill="#F0F4F8" />
        </motion.g>
      ))}
      <motion.rect x="200" y="82" width="48" height="14" rx="7" fill="#D1A45F"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ delay: 1.8, duration: 1.2, repeat: Infinity }} />
      <text x="224" y="91" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="700">Send →</text>
    </svg>
  );
}

// ─── Step data ────────────────────────────────────────────────────────────────

type PositionType =
  | "right-panel-mid"       // card left of panel, right arrow → panel
  | "above-toolbar-pen"     // card above toolbar, down arrow → pen tool
  | "above-toolbar-group"   // card above toolbar, down arrow → group tool
  | "inside-panel-group"    // card inside panel, up arrow → Group button in row
  | "inside-panel-count"    // card inside panel, up arrow → Start room counting button
  | "below-header"          // card below header, up arrow → Conduct Survey
  | "score-widget";         // card below score widget, up arrow → score widget

interface StepDef {
  title: string;
  description: string;
  position: PositionType;
  arrowLeftPx?: number;   // horizontal px from card-left for up/down arrow
  arrowRightPx?: number;  // horizontal px from card-right for up arrow (below-header)
  Illustration: React.FC;
}

const STEPS: StepDef[] = [
  {
    title: "Identify Your Rooms",
    description: "Here you can see the list of rooms we identified from your floor plan. Click the Verify button to match this room with its actual area on the floor plan.",
    position: "right-panel-mid",
    Illustration: RoomListIllustration,
  },
  {
    title: "Verify with Pen Tool",
    description: "Select this Pen tool, then trace the outline of the room directly on the floor plan.",
    position: "above-toolbar-pen",
    arrowLeftPx: 58,
    Illustration: DrawRoomIllustration,
  },
  {
    title: "Group into Zones",
    description: "Use the Group tool to select multiple rooms and bundle them into a named zone.",
    position: "above-toolbar-group",
    arrowLeftPx: 58,
    Illustration: AnimatedGroupZonesIllustration,
  },
  {
    title: "Create zones",
    description: "Click the Create zone button to start grouping rooms into zones. Select the rooms you want to include and give the zone a name.",
    position: "inside-panel-group",
    arrowLeftPx: 60,
    Illustration: GroupButtonIllustration,
  },
  {
    title: "Start room counting",
    description: "You can get the capacity of each room at different times of day using the Start room counting button in the top navbar.",
    position: "below-header",
    arrowRightPx: 60,
    Illustration: CountingIllustration,
  },
  {
    title: "Conduct a Survey",
    description: "Send out a survey to gather your employees' opinions on their workspace experience.",
    position: "below-header",
    arrowRightPx: 130,
    Illustration: SurveyIllustration,
  },
  // {
  //   title: "Track Your Progress",
  //   description: "Here you can see the count of identified rooms, identified zones and number of surveys conducted.",
  //   position: "score-widget",
  //   arrowLeftPx: 60,
  //   Illustration: _ScoreWidgetIllustration,
  // },
];

export const GUIDE_TOTAL = STEPS.length;

export function guideStepAboveToolbar(step: number) {
  const pos = STEPS[step]?.position;
  return pos === "above-toolbar-pen" || pos === "above-toolbar-group";
}


// ─── Component ────────────────────────────────────────────────────────────────

interface GuideOverlayProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function GuideOverlay({ step, onNext, onBack, onClose }: GuideOverlayProps) {
  const total = GUIDE_TOTAL;
  const current = STEPS[step];
  if (!current) return null;

  const { Illustration, position, arrowLeftPx, arrowRightPx } = current;
  const isLastStep = step >= total - 1;

  const isToolbarStep = position === "above-toolbar-pen" || position === "above-toolbar-group";
  const isInsidePanelStep = position === "inside-panel-group" || position === "inside-panel-count";
  const isRightPanelMid = position === "right-panel-mid";
  const isBelowHeader = position === "below-header";
  const isScoreWidget = position === "score-widget";

  // No dark backdrop — tooltip card stands alone with glow shadow

  // ── Card ────────────────────────────────────────────────────────────────
  const card = (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.17 }}
      className="relative w-72 rounded-2xl border border-[#E5DFD5]"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.18), 0 0 28px rgba(255,255,255,0.9)",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 text-[#94A3B8] hover:text-[#0D1B2A] transition-colors z-10"
      >
        <X size={13} />
      </button>

      <div className="p-4 pb-3">
        {/* Step badge */}
        <span className="inline-block text-[10px] font-semibold text-[#8B6F47] bg-[#EDE8E0] px-2 py-0.5 rounded-full font-body mb-2">
          Step {step + 1} of {total}
        </span>
        <h3 className="text-sm font-extrabold text-[#0D1B2A] font-body mb-1">{current.title}</h3>
        <p className="text-xs text-[#5A7184] font-body leading-relaxed mb-3">{current.description}</p>
        <div className="rounded-xl overflow-hidden" style={{ height: 108, background: "rgba(255,255,255,0.5)" }}>
          <Illustration />
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5DFD5]">
        {step > 0 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold font-body text-[#0D1B2A] px-3 py-1.5 rounded-lg hover:bg-[#fafafa] transition-all"
          >
            <ArrowLeft size={13} /> Back
          </button>
        ) : (
          <span />
        )}

        <Button
          size="sm"
          onClick={onNext}
          icon={!isLastStep ? <ArrowRight size={13} /> : undefined}
          iconPosition="right"
        >
          {isLastStep ? "Done" : "Next"}
        </Button>
      </div>

      {/* ── Arrows ──────────────────────────────────────────────────────────── */}

      {/* Down arrow — toolbar steps (points down toward toolbar) */}
      {isToolbarStep && (
        <div style={{
          position: "absolute", bottom: -9,
          left: arrowLeftPx !== undefined ? arrowLeftPx : "50%",
          transform: arrowLeftPx !== undefined ? "none" : "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
          borderTop: "9px solid #E5DFD5",
        }}>
          <div style={{
            position: "absolute", top: -8, left: -8, width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: "8px solid #FFFFFF",
          }} />
        </div>
      )}

      {/* Right arrow — right-panel-mid step (points right toward panel list) */}
      {isRightPanelMid && (
        <div style={{
          position: "absolute", right: -9, top: "50%", transform: "translateY(-50%)",
          width: 0, height: 0,
          borderTop: "9px solid transparent", borderBottom: "9px solid transparent",
          borderLeft: "9px solid #E5DFD5",
        }}>
          <div style={{
            position: "absolute", top: -8, left: -9, width: 0, height: 0,
            borderTop: "8px solid transparent", borderBottom: "8px solid transparent",
            borderLeft: "8px solid #FFFFFF",
          }} />
        </div>
      )}

      {/* Up arrow — inside-panel steps (points up toward target element above) */}
      {isInsidePanelStep && (
        <div style={{
          position: "absolute", top: -9,
          left: arrowLeftPx !== undefined ? arrowLeftPx : "50%",
          transform: arrowLeftPx !== undefined ? "none" : "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
          borderBottom: "9px solid #E5DFD5",
        }}>
          <div style={{
            position: "absolute", top: 1, left: -8, width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderBottom: "8px solid #FFFFFF",
          }} />
        </div>
      )}

      {/* Up arrow — below-header step (points up toward Conduct Survey button) */}
      {isBelowHeader && (
        <div style={{
          position: "absolute", top: -9,
          right: arrowRightPx !== undefined ? arrowRightPx : 52,
          width: 0, height: 0,
          borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
          borderBottom: "9px solid #E5DFD5",
        }}>
          <div style={{
            position: "absolute", top: 1, left: -8, width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderBottom: "8px solid #FFFFFF",
          }} />
        </div>
      )}

      {/* Up arrow — score-widget step (points up toward score widget above) */}
      {isScoreWidget && (
        <div style={{
          position: "absolute", top: -9,
          left: arrowLeftPx !== undefined ? arrowLeftPx : "50%",
          transform: arrowLeftPx !== undefined ? "none" : "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
          borderBottom: "9px solid #E5DFD5",
        }}>
          <div style={{
            position: "absolute", top: 1, left: -8, width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderBottom: "8px solid #FFFFFF",
          }} />
        </div>
      )}
    </motion.div>
  );

  // ── Position wrappers (all fixed — escapes overflow containers) ─────────

  if (isToolbarStep) {
    const leftOffset = position === "above-toolbar-pen"
      ? "max(8px, calc(50% - 242px))"
      : "max(8px, calc(50% - 202px))";
    return (
      <>
        <div className="fixed z-50 pointer-events-auto" style={{ bottom: "76px", left: leftOffset }}>
          <AnimatePresence mode="wait">{card}</AnimatePresence>
        </div>
      </>
    );
  }

  if (isRightPanelMid) {
    return (
      <>
        <div className="fixed z-50 pointer-events-auto"
          style={{ right: "calc(33.333% + 12px)", top: "50%", transform: "translateY(-50%)" }}>
          <AnimatePresence mode="wait">{card}</AnimatePresence>
        </div>
      </>
    );
  }

  // Step 4 — inside panel, up arrow pointing to Create zone button
  if (position === "inside-panel-group") {
    return (
      <>
        <div className="fixed z-50 pointer-events-auto" style={{ left: "calc(66.667% + 8px)", top: "310px" }}>
          <AnimatePresence mode="wait">{card}</AnimatePresence>
        </div>
      </>
    );
  }

  // Steps 5 & 6 — below header, up arrow pointing to navbar buttons
  // Step 5: Start room counting (rightmost), Step 6: Conduct survey (leftmost of the three)
  if (isBelowHeader) {
    // arrowRightPx doubles as card position hint:
    // step 5 = Count Room Capacity (Start room counting button, rightmost)
    // step 6 = Conduct a Survey (Conduct survey button)
    const cardRight = step === 4 ? "140px" : "380px";
    return (
      <>
        <div className="fixed z-50 pointer-events-auto" style={{ top: "62px", right: cardRight }}>
          <AnimatePresence mode="wait">{card}</AnimatePresence>
        </div>
      </>
    );
  }

  // Step 7 — below score widget (top-left), up arrow pointing to widget above
  if (isScoreWidget) {
    return (
      <>
        <div className="fixed z-50 pointer-events-auto" style={{ top: "195px", left: "8px" }}>
          <AnimatePresence mode="wait">{card}</AnimatePresence>
        </div>
      </>
    );
  }

  return null;
}
