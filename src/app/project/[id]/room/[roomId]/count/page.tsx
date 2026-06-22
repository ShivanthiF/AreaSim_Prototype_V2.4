"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Plus, Minus, Info, ChevronDown, ChevronUp, Lock, LayoutDashboard, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useCanvasStore } from "@/store/canvas";
import { mockCountHistory } from "@/lib/mockData";

const MAX_COUNTS_PER_DAY = 3;
const TOTAL_DAYS = 7;
const MOCK_TODAY_COUNTS = 1;

type Category = "meeting" | "focus" | "social" | "empty";

function getToday() {
  return new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function getNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES: { id: Category; label: string; desc: string; color: string; badge: string; text: string }[] = [
  { id: "meeting", label: "Meeting",  desc: "Collaborative discussion rooms with shared tables",  color: "border-blue-200 bg-blue-50",   badge: "bg-blue-100 text-blue-700",  text: "text-blue-700" },
  { id: "focus",   label: "Focus",    desc: "Quiet individual workspaces for deep concentration",  color: "border-violet-200 bg-violet-50", badge: "bg-violet-100 text-violet-700", text: "text-violet-700" },
  { id: "social",  label: "Social",   desc: "Casual lounge areas for informal gatherings",          color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700" },
  { id: "empty",   label: "Empty",    desc: "Vacant or transitional spaces not in active use",     color: "border-gray-200 bg-gray-50",   badge: "bg-gray-100 text-gray-600",  text: "text-gray-600" },
];

// ─── Dynamic Room Visualization ───────────────────────────────────────────────
function MeetingRoomView({ seats }: { seats: number }) {
  const cap = Math.min(seats, 20);
  const perimeter = 2 * (140 + 60);
  const top    = Math.max(1, Math.round(cap * 140 / perimeter));
  const bottom = Math.max(1, Math.round(cap * 140 / perimeter));
  const left   = Math.max(0, Math.round(cap * 60 / perimeter));
  const right  = Math.max(0, cap - top - bottom - left);

  const cx = 140, cy = 95, tw = 140, th = 60;

  const topChairs    = Array.from({ length: top },    (_, i) => ({ x: cx - tw/2 + (tw/(top+1))*(i+1),    y: cy - th/2 - 20, rx: 10, ry: 8, deg: 0   }));
  const bottomChairs = Array.from({ length: bottom }, (_, i) => ({ x: cx - tw/2 + (tw/(bottom+1))*(i+1), y: cy + th/2 + 12, rx: 10, ry: 8, deg: 0   }));
  const leftChairs   = Array.from({ length: left },   (_, i) => ({ x: cx - tw/2 - 14, y: cy - th/2 + (th/(left+1))*(i+1),   rx: 8,  ry: 10, deg: 90 }));
  const rightChairs  = Array.from({ length: right },  (_, i) => ({ x: cx + tw/2 + 6,  y: cy - th/2 + (th/(right+1))*(i+1),  rx: 8,  ry: 10, deg: 90 }));
  const allChairs = [...topChairs, ...bottomChairs, ...leftChairs, ...rightChairs];

  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wall screen */}
      <motion.rect x="100" y="16" width="80" height="10" rx="3" stroke="#374151" strokeWidth="1.5" fill="#BFDBFE"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: "140px 21px" }} />
      <motion.line x1="133" y1="26" x2="131" y2="38" stroke="#6B7280" strokeWidth="1.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      <motion.line x1="147" y1="26" x2="149" y2="38" stroke="#6B7280" strokeWidth="1.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      {/* Table */}
      <motion.rect x={cx-tw/2} y={cy-th/2} width={tw} height={th} rx="8"
        stroke="#374151" strokeWidth="2" fill="#FEF9ED"
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 200 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }} />
      {/* Chairs */}
      {allChairs.map((c, i) => (
        <motion.rect key={i} x={c.x - c.rx} y={c.y - c.ry} width={c.rx*2} height={c.ry*2} rx="4"
          stroke="#374151" strokeWidth="1.3" fill="white"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 250 }}
          style={{ transformOrigin: `${c.x}px ${c.y}px` }} />
      ))}
      {/* Seat count label */}
      <motion.text x="140" y="96" textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="600" fill="#374151"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {seats} seats
      </motion.text>
      {/* Floor line */}
      <line x1="20" y1="165" x2="260" y2="165" stroke="#E5E7EB" strokeWidth="1.5" />
    </svg>
  );
}

function FocusRoomView({ seats }: { seats: number }) {
  const cap = Math.min(seats, 18);
  const cols = Math.ceil(Math.sqrt(cap * 1.5));
  const rows = Math.ceil(cap / cols);
  const deskW = 44, deskH = 30, gapX = 24, gapY = 30;
  const totalW = cols * deskW + (cols - 1) * gapX;
  const totalH = rows * deskH + (rows - 1) * gapY;
  const startX = (280 - totalW) / 2;
  const startY = (160 - totalH) / 2 + 10;

  const desks = [];
  for (let i = 0; i < cap; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    desks.push({ x: startX + col * (deskW + gapX), y: startY + row * (deskH + gapY) });
  }

  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {desks.map((d, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 + 0.1 }}>
          {/* Desk */}
          <rect x={d.x} y={d.y} width={deskW} height={deskH} rx="4"
            stroke="#374151" strokeWidth="1.3" fill="#F5F3FF" />
          {/* Monitor */}
          <rect x={d.x+8} y={d.y+5} width={deskW-16} height={deskH-14} rx="2"
            stroke="#374151" strokeWidth="1" fill="#BFDBFE" />
          {/* Chair */}
          <rect x={d.x+10} y={d.y+deskH+3} width={deskW-20} height={7} rx="2"
            stroke="#374151" strokeWidth="1" fill="white" />
        </motion.g>
      ))}
      {seats > 18 && (
        <text x="140" y="162" textAnchor="middle" fontSize="10" fill="#9CA3AF">
          +{seats - 18} more
        </text>
      )}
      <line x1="20" y1="165" x2="260" y2="165" stroke="#E5E7EB" strokeWidth="1.5" />
    </svg>
  );
}

function SocialRoomView({ seats }: { seats: number }) {
  const tables = Math.max(1, Math.ceil(seats / 5));
  const tablePositions = [
    { cx: 80, cy: 80 }, { cx: 200, cy: 80 }, { cx: 80, cy: 145 }, { cx: 200, cy: 145 }, { cx: 140, cy: 112 }
  ].slice(0, Math.min(tables, 5));

  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {tablePositions.map((t, ti) => {
        const seatsPerTable = Math.ceil(seats / tables);
        const chairAngles = Array.from({ length: Math.min(seatsPerTable, 6) }, (_, i) => (i * 360 / Math.min(seatsPerTable, 6)));
        return (
          <motion.g key={ti} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: ti * 0.1 + 0.1, type: "spring" }}
            style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}>
            {/* Round table */}
            <circle cx={t.cx} cy={t.cy} r="18" stroke="#374151" strokeWidth="1.8" fill="#F0FDF4" />
            {/* Chairs */}
            {chairAngles.map((deg, ci) => {
              const rad = (deg * Math.PI) / 180;
              const chX = t.cx + Math.cos(rad) * 28;
              const chY = t.cy + Math.sin(rad) * 28;
              return (
                <circle key={ci} cx={chX} cy={chY} r="8"
                  stroke="#374151" strokeWidth="1.2" fill="white" />
              );
            })}
          </motion.g>
        );
      })}
      {/* Sofa */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x="190" y="140" width="65" height="24" rx="6" stroke="#374151" strokeWidth="1.3" fill="#D1FAE5" />
        <rect x="190" y="138" width="10" height="28" rx="4" stroke="#374151" strokeWidth="1" fill="#A7F3D0" />
        <rect x="245" y="138" width="10" height="28" rx="4" stroke="#374151" strokeWidth="1" fill="#A7F3D0" />
      </motion.g>
      <line x1="20" y1="165" x2="260" y2="165" stroke="#E5E7EB" strokeWidth="1.5" />
    </svg>
  );
}

function EmptyRoomView() {
  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Room outline */}
      <motion.rect x="40" y="30" width="200" height="130" rx="6"
        stroke="#9CA3AF" strokeWidth="2" fill="#F9FAFB" strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }} />
      {/* Grid lines */}
      {[80, 120, 160, 200].map((x, i) => (
        <motion.line key={`v${i}`} x1={x} y1="30" x2={x} y2="160"
          stroke="#E5E7EB" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }} />
      ))}
      {[70, 110, 150].map((y, i) => (
        <motion.line key={`h${i}`} x1="40" y1={y} x2="240" y2={y}
          stroke="#E5E7EB" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} />
      ))}
      {/* Empty label */}
      <motion.text x="140" y="100" textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fill="#9CA3AF" fontStyle="italic"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        No furniture
      </motion.text>
      <line x1="20" y1="165" x2="260" y2="165" stroke="#E5E7EB" strokeWidth="1.5" />
    </svg>
  );
}

function DynamicRoomView({ category, seats }: { category: Category; seats: number }) {
  if (category === "meeting") return <MeetingRoomView seats={seats} />;
  if (category === "focus")   return <FocusRoomView seats={seats} />;
  if (category === "social")  return <SocialRoomView seats={seats} />;
  return <EmptyRoomView />;
}

// ─── Category icon SVGs ───────────────────────────────────────────────────────
function CategoryIcon({ cat }: { cat: Category }) {
  if (cat === "meeting") return (
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
      <rect x="6" y="10" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
      {[10, 16, 22].map((x) => <rect key={x} x={x-3} y="5" width="6" height="5" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />)}
      {[10, 16, 22].map((x) => <rect key={x} x={x-3} y="22" width="6" height="5" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />)}
    </svg>
  );
  if (cat === "focus") return (
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
      <rect x="5" y="12" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
      <rect x="9" y="15" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="currentColor" strokeWidth="1.4" />
      <line x1="12" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
  if (cat === "social") return (
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
      <circle cx="11" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
      <circle cx="21" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
      <path d="M4 28 Q4 22 11 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M28 28 Q28 22 21 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="11" y1="22" x2="21" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 3" fill="currentColor" fillOpacity="0.05" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// ─── Setup screen ─────────────────────────────────────────────────────────────
function SetupScreen({
  roomName,
  onStart,
}: {
  roomName: string;
  onStart: (cat: Category, seats: number) => void;
}) {
  const params = useParams();
  const roomId = params.roomId as string;
  const { floors, updateRoom } = useCanvasStore();

  // Find the floor that contains the current room
  const currentFloor = floors.find((f) => f.rooms.some((r) => r.id === roomId));
  const allRooms = currentFloor?.rooms ?? [];

  const [selected, setSelected] = useState<Category | null>(null);
  const [seats, setSeats] = useState(4);
  const [seatInput, setSeatInput] = useState("4");
  const [whyOpen, setWhyOpen] = useState(false);

  // Multi-room selection state
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<Category | null>(null);

  const toggleRoomSelection = (id: string) => {
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applyBulkCategory = () => {
    if (!bulkCategory || !currentFloor) return;
    selectedRoomIds.forEach((id) => {
      updateRoom(currentFloor.id, id, { category: bulkCategory });
    });
    setSelectedRoomIds(new Set());
    setBulkCategory(null);
    setShowBulkModal(false);
  };

  const commitSeatInput = (raw: string) => {
    const n = Math.max(1, Math.min(50, parseInt(raw.replace(/\D/g, "")) || 1));
    setSeats(n);
    setSeatInput(String(n));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-body">
      {/* Why banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-b border-[#E5EAF0]"
      >
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Info size={15} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0D1B2A]">Why does room counting matter?</p>
            <p className="text-xs text-[#8CA3B0] mt-0.5">Understanding occupancy helps optimize your workspace</p>
          </div>
          {whyOpen ? <ChevronUp size={16} className="text-[#8CA3B0] shrink-0" /> : <ChevronDown size={16} className="text-[#8CA3B0] shrink-0" />}
        </button>

        <AnimatePresence>
          {whyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Optimize Layouts", desc: "Identify underused rooms and reconfigure for maximum efficiency", icon: "📐" },
                  { title: "Reduce Costs",      desc: "Real data reveals opportunities to cut real estate overhead by 20–40%", icon: "💰" },
                  { title: "Boost Productivity", desc: "Right-size rooms to reduce friction and improve employee experience", icon: "⚡" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] p-4">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="text-sm font-semibold text-[#0D1B2A] mb-1">{item.title}</p>
                    <p className="text-xs text-[#8CA3B0] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main setup */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* ── Full-width header ── */}
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-[#0D1B2A] mb-1" style={{ fontFamily: "var(--font-manrope)" }}>
              Set up room for counting
            </h1>
            <p className="text-2xl font-black text-primary mb-1" style={{ fontFamily: "var(--font-manrope)" }}>
              {roomName}
            </p>
            <p className="text-sm text-[#8CA3B0]">Select a category that best describes this space</p>
          </div>

          {/* ── Full-width Category grid ── */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest text-[#8CA3B0] mb-3">Room category</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(cat.id)}
                  className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                    selected === cat.id
                      ? `${cat.color} border-opacity-100 shadow-md`
                      : "bg-white border-[#E5EAF0] hover:border-[#C0D0DC]"
                  }`}
                >
                  {selected === cat.id && (
                    <motion.div
                      layoutId="catCheck"
                      className="absolute top-3 right-3"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                    >
                      <CheckCircle2 size={16} className={cat.text} />
                    </motion.div>
                  )}
                  <div className={`mb-2 ${selected === cat.id ? cat.text : "text-[#5C7A8A]"}`}>
                    <CategoryIcon cat={cat.id} />
                  </div>
                  <p className={`text-sm font-bold mb-0.5 ${selected === cat.id ? cat.text : "text-[#0D1B2A]"}`}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-[#8CA3B0] leading-relaxed hidden sm:block">{cat.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Multi-room bulk category ── */}
          {allRooms.length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-[#8CA3B0] mb-3">Set category for multiple rooms</p>
              <div className="bg-white rounded-2xl border border-[#E5EAF0] shadow-sm overflow-hidden">
                {allRooms.map((room, i) => {
                  const isChecked = selectedRoomIds.has(room.id);
                  const isCurrent = room.id === roomId;
                  return (
                    <label
                      key={room.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        i < allRooms.length - 1 ? "border-b border-[#F0F4F8]" : ""
                      } ${isChecked ? "bg-primary/5" : "hover:bg-[#F7F9FC]"}`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        isChecked ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white"
                      }`}>
                        {isChecked && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleRoomSelection(room.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0D1B2A] truncate">{room.name}</p>
                        {room.sqm && <p className="text-xs text-[#8CA3B0]">{room.sqm} m²</p>}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">Current</span>
                      )}
                      {room.category && (
                        <span className="text-[10px] font-semibold text-[#8CA3B0] shrink-0 capitalize">{room.category}</span>
                      )}
                    </label>
                  );
                })}
                {selectedRoomIds.size > 0 && (
                  <div className="px-4 py-3 border-t border-[#E5EAF0] bg-[#F7F9FC] flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[#0D1B2A]">{selectedRoomIds.size} room{selectedRoomIds.size > 1 ? "s" : ""} selected</span>
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all"
                      style={{ background: "linear-gradient(135deg, #0A4F6E, #1A7FA8)", boxShadow: "0 2px 12px rgba(10,79,110,0.25)" }}
                    >
                      Select Category →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Bulk category modal ── */}
          <AnimatePresence>
            {showBulkModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && setShowBulkModal(false)}
              >
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F0F4F8]">
                    <div>
                      <p className="text-base font-extrabold text-[#0D1B2A]" style={{ fontFamily: "var(--font-manrope)" }}>Select Category</p>
                      <p className="text-xs text-[#8CA3B0] mt-0.5">Apply to {selectedRoomIds.size} selected room{selectedRoomIds.size > 1 ? "s" : ""}</p>
                    </div>
                    <button onClick={() => setShowBulkModal(false)} className="w-8 h-8 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#5C7A8A] hover:bg-[#E5EAF0] transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setBulkCategory(cat.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                          bulkCategory === cat.id
                            ? `${cat.color} border-opacity-100`
                            : "border-[#E5EAF0] bg-white hover:border-[#C0D0DC]"
                        }`}
                      >
                        <div className={bulkCategory === cat.id ? cat.text : "text-[#5C7A8A]"}>
                          <CategoryIcon cat={cat.id} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${bulkCategory === cat.id ? cat.text : "text-[#0D1B2A]"}`}>{cat.label}</p>
                          <p className="text-xs text-[#8CA3B0]">{cat.desc}</p>
                        </div>
                        {bulkCategory === cat.id && (
                          <CheckCircle2 size={16} className={`ml-auto shrink-0 ${cat.text}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 pb-5">
                    <button
                      onClick={applyBulkCategory}
                      disabled={!bulkCategory}
                      className="w-full rounded-2xl font-semibold text-sm text-white py-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: bulkCategory ? "linear-gradient(135deg, #0A4F6E, #1A7FA8)" : "#94A3B8",
                        boxShadow: bulkCategory ? "0 4px 20px rgba(10,79,110,0.3)" : "none",
                      }}
                    >
                      Apply to {selectedRoomIds.size} room{selectedRoomIds.size > 1 ? "s" : ""}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Side-by-side: Preview | Capacity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Left — Room Preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest text-[#8CA3B0]">Room preview</p>
              <div className="bg-white rounded-2xl border border-[#E5EAF0] shadow-sm overflow-hidden min-h-[200px] flex flex-col">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected + seats}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORIES.find(c => c.id === selected)?.badge}`}>
                          {CATEGORIES.find(c => c.id === selected)?.label} · {seats} seats
                        </span>
                      </div>
                      <div className="flex-1 h-48 px-4 pb-2">
                        <DynamicRoomView category={selected} seats={seats} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-preview"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#F0F6FB] flex items-center justify-center mb-3">
                        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-[#A0B3BE]">
                          <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 3" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#A0B3BE]">Select a category to see a preview</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right — Seat Capacity + Begin Counting */}
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest text-[#8CA3B0]">Seat capacity</p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-[#E5EAF0] shadow-sm p-5"
              >
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => { const n = Math.max(1, seats - 1); setSeats(n); setSeatInput(String(n)); }}
                    className="w-12 h-12 rounded-xl border-2 border-[#E5EAF0] flex items-center justify-center hover:border-primary hover:text-primary transition-all text-[#5C7A8A]"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="flex-1 text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={seatInput}
                      onChange={(e) => setSeatInput(e.target.value.replace(/\D/g, ""))}
                      onBlur={(e) => commitSeatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && commitSeatInput(seatInput)}
                      className="text-7xl font-black text-[#0D1B2A] tabular-nums w-full text-center bg-transparent focus:outline-none caret-primary"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    />
                    <p className="text-xs text-[#8CA3B0]">seats</p>
                  </div>
                  <button
                    onClick={() => { const n = Math.min(50, seats + 1); setSeats(n); setSeatInput(String(n)); }}
                    className="w-12 h-12 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-center hover:bg-primary/15 transition-all text-primary"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Begin Counting CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => selected && onStart(selected, seats)}
                disabled={!selected}
                className="w-full rounded-2xl font-semibold text-base text-white transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  height: "52px",
                  background: selected ? "linear-gradient(135deg, #0A4F6E, #1A7FA8)" : "#94A3B8",
                  boxShadow: selected ? "0 4px 20px rgba(10,79,110,0.3)" : "none",
                }}
              >
                Begin counting →
              </motion.button>

              {!selected && (
                <p className="text-xs text-center text-[#A0B3BE]">Select a room category above to continue</p>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Count Screen ─────────────────────────────────────────────────────────────
function CountScreen({
  roomName,
  category,
  seats,
  onBack,
}: {
  roomName: string;
  category: Category;
  seats: number;
  onBack: () => void;
}) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const roomId = params.roomId as string;

  const { floors, addCountEntry, setCompletionModal } = useCanvasStore();

  const { floor, room } = (() => {
    for (const f of floors) {
      const r = f.rooms.find((r) => r.id === roomId);
      if (r) return { floor: f, room: r };
    }
    return { floor: floors[0], room: null };
  })();

  const existingHistory = room?.countHistory.length ? room.countHistory : mockCountHistory;
  const [count, setCount] = useState(room?.currentCount ?? 0);
  const [todayCounts, setTodayCounts] = useState(MOCK_TODAY_COUNTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState(existingHistory);
  const [dayProgress] = useState(3);
  const isLocked = todayCounts >= MAX_COUNTS_PER_DAY;
  const catDef = CATEGORIES.find((c) => c.id === category)!;

  const adjust = (delta: number) => {
    if (isLocked) return;
    setCount((c) => Math.max(0, c + delta));
  };

  const handleRecord = async () => {
    if (isLocked || saving) return;
    setSaving(true);
    confetti({ particleCount: 70, spread: 90, origin: { y: 0.55 }, colors: ["#0F7663", "#1A7FA8", "#60A5FA", "#A78BFA"], zIndex: 9999 });
    const entry = { count, by: "You", date: getToday(), time: getNow() };
    if (room && floor) addCountEntry(floor.id, room.id, entry);
    setHistory((h) => [entry, ...h]);
    setTodayCounts((c) => c + 1);
    setSaved(true);
    setSaving(false);
    setTimeout(() => {
      setSaved(false);
      const allFloorRooms = floor?.rooms ?? [];
      const updatedCounted = allFloorRooms.filter((r) => r.id === roomId || r.status === "counted").length;
      if (allFloorRooms.length > 0 && updatedCounted === allFloorRooms.length) {
        setCompletionModal(true);
        router.push(`/project/${projectId}/floor/${floor?.id ?? "floor-1"}`);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#E5EAF0] shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-1.5 text-[#5C7A8A] hover:text-[#0D1B2A] transition-colors text-sm font-medium">
              <ArrowLeft size={16} /> Change setup
            </button>
            <div className="w-px h-4 bg-[#E5EAF0]" />
            <button
              onClick={() => router.push(`/project/${projectId}/floor/${floor?.id ?? "floor-1"}`)}
              className="flex items-center gap-1.5 text-[#5C7A8A] hover:text-primary transition-colors text-sm font-medium"
            >
              <LayoutDashboard size={15} /> Back to canvas
            </button>
          </div>
          <div className="text-center">
            <p className="text-[11px] tracking-widest text-[#8CA3B0]">Counting</p>
            <p className="text-sm font-semibold text-[#0D1B2A] mt-0.5" style={{ fontFamily: "var(--font-manrope)" }}>
              {roomName}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catDef.badge}`}>
            {catDef.label}
          </span>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-4">

        {/* Main card — full width, vertical layout */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#E5EAF0] shadow-sm overflow-hidden bg-white"
        >
          {/* Top section — Current Occupant Count */}
          <div className="p-5 border-b border-[#F0F4F8]">
            <p className="text-xs font-semibold tracking-widest text-[#8CA3B0] text-center mb-4">Current occupant count</p>

            {isLocked ? (
              <div className="rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-5 text-center max-w-sm mx-auto">
                <Lock size={20} className="text-[#A0B3BE] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#5C7A8A] mb-0.5">Max counts reached today</p>
                <p className="text-xs text-[#8CA3B0]">You&apos;ve counted {MAX_COUNTS_PER_DAY}× today. Come back tomorrow.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-5 max-w-xs mx-auto">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => adjust(-1)}
                    disabled={count === 0}
                    className="flex-1 h-14 rounded-2xl border-2 border-[#E5EAF0] bg-[#F7F9FC] flex items-center justify-center text-[#374151] hover:border-[#C0D0DC] hover:bg-white transition-all disabled:opacity-30 disabled:pointer-events-none text-2xl font-bold shadow-sm"
                  >
                    −
                  </motion.button>
                  <div className="flex-1 text-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={count}
                        initial={{ opacity: 0, scale: 0.75, y: -12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 12 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 280 }}
                        className="text-7xl font-black text-[#0D1B2A] tabular-nums block"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 900 }}
                      >
                        {String(count).padStart(2, "0")}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => adjust(1)}
                    className="flex-1 h-14 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all shadow-sm"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>

                <div className="flex justify-center mb-5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRecord}
                    disabled={saving}
                    className="rounded-2xl font-semibold text-base text-white transition-all shadow-lg overflow-hidden relative px-12"
                    style={{
                      height: "52px",
                      background: saved ? "linear-gradient(135deg, #0F7663, #10B981)" : "linear-gradient(135deg, #0A4F6E, #1A7FA8)",
                      boxShadow: saved ? "0 4px 24px rgba(0,201,167,0.35)" : "0 4px 20px rgba(10,79,110,0.3)",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {saved ? (
                        <motion.span key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="flex items-center justify-center gap-2">
                          <CheckCircle2 size={18} /> Count Saved!
                        </motion.span>
                      ) : (
                        <motion.span key="set" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          Record Count
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </>
            )}

            {/* Today's Progress */}
            <div className="border-t border-[#F0F4F8] pt-4 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[#0D1B2A]">Today&apos;s Progress</p>
                <span className="text-xs text-[#8CA3B0]">Day {dayProgress} / {TOTAL_DAYS}</span>
              </div>
              <div className="flex gap-2 mb-3">
                {Array.from({ length: MAX_COUNTS_PER_DAY }).map((_, i) => (
                  <motion.div key={i}
                    className={`flex-1 h-2.5 rounded-full ${i < todayCounts ? "bg-primary" : "bg-[#EEF3F8]"}`}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                    style={{ transformOrigin: "left" }} />
                ))}
              </div>
              <div className="h-2 rounded-full bg-[#EEF3F8] overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1A7FA8, #0F7663)" }}
                  initial={{ width: 0 }} animate={{ width: `${(dayProgress / TOTAL_DAYS) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
              </div>
              <p className="text-[11px] text-[#A0B3BE] mt-2 text-center">Count up to {MAX_COUNTS_PER_DAY}× per day for {TOTAL_DAYS} days</p>
            </div>
          </div>

          {/* Bottom section — Room visualization */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-[#0D1B2A]">{roomName}</p>
                <p className="text-xs text-[#8CA3B0] mt-0.5">Configured for {seats} seats · {catDef.label}</p>
              </div>
              <div className="text-3xl font-black text-[#0D1B2A] tabular-nums" style={{ fontFamily: "var(--font-manrope)" }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={count}
                    initial={{ opacity: 0, scale: 0.8, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 8 }}
                    transition={{ duration: 0.18, type: "spring", stiffness: 300 }}
                    className="block"
                  >
                    {String(count).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="relative h-56">
              <DynamicRoomView category={category} seats={seats} />
              {count > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-md text-white"
                  style={{ background: "linear-gradient(135deg, #0A4F6E, #1A7FA8)" }}
                >
                  {count} / {seats} occupied ({Math.round((count / seats) * 100)}%)
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Count History — full width, below the top card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-3xl border border-[#E5EAF0] shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[#F0F4F8]">
            <p className="text-sm font-semibold text-[#0D1B2A]">Count History</p>
          </div>
          <div className="grid grid-cols-4 px-5 py-2.5 bg-[#F7F9FC]">
            {["Count", "By", "Date", "Time"].map((h) => (
              <span key={h} className="text-[11px] font-semibold text-[#8CA3B0] tracking-wider">{h}</span>
            ))}
          </div>
          {history.slice(0, 8).map((entry, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 + 0.2 }}
              className={`grid grid-cols-4 px-5 py-3 border-b border-[#F0F4F8] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFBFD]"} hover:bg-[#F0F6FB] transition-colors`}
            >
              <span className="text-sm font-extrabold text-primary" style={{ fontFamily: "var(--font-manrope)" }}>{entry.count}</span>
              <span className="text-sm text-[#374151]">{entry.by}</span>
              <span className="text-sm text-[#8CA3B0]">{entry.date}</span>
              <span className="text-sm text-[#8CA3B0]">{entry.time}</span>
            </motion.div>
          ))}
          {history.length === 0 && (
            <div className="px-5 py-8 text-center"><p className="text-sm text-[#A0B3BE]">No counts recorded yet</p></div>
          )}
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────
export default function RoomCountPage() {
  const params = useParams();
  const router = useRouter();
  const { floors } = useCanvasStore();
  const roomId = params.roomId as string;

  const { room } = (() => {
    for (const f of floors) {
      const r = f.rooms.find((r) => r.id === roomId);
      if (r) return { room: r };
    }
    return { room: null };
  })();

  const roomName = room?.name ?? "Room";

  const [setupDone, setSetupDone] = useState(false);
  const [category, setCategory] = useState<Category>("meeting");
  const [seats, setSeats] = useState(4);

  if (!setupDone) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E5EAF0] shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-3.5">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[#5C7A8A] hover:text-[#0D1B2A] transition-colors text-sm font-medium">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex-1 text-center">
              <p className="text-sm font-semibold text-[#0D1B2A]" style={{ fontFamily: "var(--font-manrope)" }}>
                {roomName}
              </p>
            </div>
          </div>
        </header>
        <SetupScreen
          roomName={roomName}
          onStart={(cat, s) => {
            setCategory(cat);
            setSeats(s);
            setSetupDone(true);
          }}
        />
      </div>
    );
  }

  return (
    <CountScreen
      roomName={roomName}
      category={category}
      seats={seats}
      onBack={() => setSetupDone(false)}
    />
  );
}
