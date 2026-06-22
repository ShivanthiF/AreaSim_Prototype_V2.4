"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Package, ClipboardList } from "lucide-react";
import { useCanvasStore } from "@/store/canvas";
import { formatNumber } from "@/lib/utils";

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);
  return <span>{formatNumber(displayed)}</span>;
}

// Ring burst particles shown when first room is drawn
function BurstRing({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ border: `2px solid ${color}` }}
    />
  );
}

const STAT_CONFIG = [
  {
    icon: <Building size={12} />,
    label: "Rooms",
    glow: "rgba(217,119,6,0.35)",
    iconColor: "#B45309",
    labelColor: "#92400E",
  },
  {
    icon: <Package size={12} />,
    label: "Zones",
    glow: "rgba(217,119,6,0.35)",
    iconColor: "#B45309",
    labelColor: "#92400E",
  },
  {
    icon: <ClipboardList size={12} />,
    label: "Survey",
    glow: "rgba(217,119,6,0.35)",
    iconColor: "#B45309",
    labelColor: "#92400E",
  },
];

export function ScoreWidget() {
  const { surveyResponses, getActiveFloor } = useCanvasStore();
  const floor = getActiveFloor();
  const roomCount = floor?.rooms.length ?? 0;
  const zoneCount = floor?.zones.length ?? 0;

  const values = [roomCount, zoneCount, surveyResponses];

  // Track when rooms go from 0 → 1 to trigger burst animation
  const prevRoomCount = useRef(roomCount);
  const [roomBurst, setRoomBurst] = useState(false);
  useEffect(() => {
    if (prevRoomCount.current === 0 && roomCount > 0) {
      setRoomBurst(true);
      setTimeout(() => setRoomBurst(false), 700);
    }
    prevRoomCount.current = roomCount;
  }, [roomCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-stretch rounded-xl border border-[#E5EAF0] shadow-lg overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >

      {STAT_CONFIG.map(({ icon, label, glow, iconColor, labelColor }, i) => {
        const isRooms = i === 0;
        const value = values[i];
        return (
          <div
            key={label}
            className={`relative z-10 flex items-center gap-2.5 px-4 py-2.5 ${i < STAT_CONFIG.length - 1 ? "border-r border-[#E5EAF0]" : ""}`}
          >
            {/* Coin circle */}
            <div className="relative">
              <motion.div
                className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(145deg, #f8e19cff 45%, #ffcb71ff 100%)",
                  border: "1.5px solid #e3b069ff",
                  boxShadow: "0 2px 5px rgba(180,83,9,0.30), inset 0 1px 0 rgba(255,255,255,0.55)",
                }}
                animate={{
                  boxShadow: [
                    `0 2px 5px rgba(180,83,9,0.30), inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0px ${glow.replace("0.35", "0")}`,
                    `0 2px 5px rgba(180,83,9,0.30), inset 0 1px 0 rgba(255,255,255,0.55), 0 0 10px ${glow}`,
                    `0 2px 5px rgba(180,83,9,0.30), inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0px ${glow.replace("0.35", "0")}`,
                  ],
                  ...(isRooms && roomBurst ? { scale: [1, 1.35, 0.95, 1.1, 1] } : {}),
                }}
                transition={{
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
                  scale: { duration: 0.5, times: [0, 0.3, 0.6, 0.8, 1] },
                }}
              >
                <span className="text-[11px] font-extrabold tabular-nums leading-none"
                  style={{ color: "#cc6f35ff", fontFamily: "var(--font-jetbrains-mono)" }}>
                  <AnimatedNumber value={value} />
                </span>
              </motion.div>
              {/* Burst rings when first room drawn */}
              <AnimatePresence>
                {isRooms && roomBurst && (
                  <>
                    <BurstRing key="burst1" color="#D97706" />
                    <motion.div
                      key="burst2"
                      className="absolute inset-0 rounded-full pointer-events-none"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                      style={{ border: "2px solid #D97706" }}
                    />
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Icon + label stacked */}
            <div className="flex flex-col items-center gap-0.5">
              <span style={{ color: iconColor, opacity: 0.85 }}>{icon}</span>
              <span className="text-[9px] font-body leading-none whitespace-nowrap font-medium"
                style={{ color: labelColor, opacity: 0.7 }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
