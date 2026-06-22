"use client";

import { motion } from "framer-motion";

export function IllustrationDrawRoom() {
  const points = [
    { x: 80, y: 130 }, { x: 80, y: 50 }, { x: 200, y: 50 }, { x: 240, y: 90 }, { x: 240, y: 130 },
  ];
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[80, 120, 160, 200, 240].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="165" stroke="#E5E7EB" strokeWidth="0.8" />
      ))}
      {[50, 90, 130, 165].map((y) => (
        <line key={y} x1="40" y1={y} x2="280" y2={y} stroke="#E5E7EB" strokeWidth="0.8" />
      ))}
      <motion.polygon
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        fill="rgba(10,79,110,0.12)" stroke="#0A4F6E" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }} />
      {points.map((pt, i) => {
        const next = points[(i + 1) % points.length];
        return (
          <motion.line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
            stroke="#0A4F6E" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.28, duration: 0.25, repeat: Infinity, repeatDelay: 2.5 }} />
        );
      })}
      {points.map((pt, i) => (
        <motion.circle key={i} cx={pt.x} cy={pt.y} r={i === 0 ? 6 : 4}
          fill={i === 0 ? "#00C9A7" : "#0A4F6E"} stroke="white" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.28, duration: 0.18, type: "spring", repeat: Infinity, repeatDelay: 2.5 }} />
      ))}
      <motion.g
        animate={{ x: [0, ...points.map(p => p.x - points[0].x)], y: [0, ...points.map(p => p.y - points[0].y)] }}
        initial={{ x: points[0].x - 10, y: points[0].y - 10 }}
        transition={{ duration: points.length * 0.28 + 0.3, times: [0, 0.15, 0.3, 0.5, 0.7, 0.9], ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}>
        <motion.path
          d="M 0 0 L 0 14 L 4 10 L 8 17 L 10 16 L 6 9 L 11 9 Z"
          fill="white" stroke="#374151" strokeWidth="1"
          style={{ transform: `translate(${points[0].x - 2}px, ${points[0].y - 2}px)` }} />
      </motion.g>
    </svg>
  );
}
