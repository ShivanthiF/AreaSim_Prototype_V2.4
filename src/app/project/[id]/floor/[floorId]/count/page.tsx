"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  ChevronDown,
  ArrowRight,
  Check,
  Plus,
  Minus,
  X,
  ClipboardList,
  LayoutGrid,
  Clock,
  HelpCircle,
  MessageSquare,
  Bell,
  Lock,
  User,
  Layers,
  Pencil,
  Save,
  Users,
  Target,
  Coffee,
  Box,
  CheckCircle2,
  BarChart3,
  Search,
  Info,
  Heart,
  TrendingUp,
  Footprints,
  Armchair,
  NotebookPen,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { CountingStepper, countingStepHref, type CountingStepId } from "@/components/ui/CountingStepper";
import { useCanvasStore } from "@/store/canvas";
import { mockProject } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];

// ─── Round schedule ───────────────────────────────────────────────────────────
// 5 rounds per day, each 2 hours, starting 08:00
const ROUNDS = [
  { round: 1, label: "Round 1", start: "08:00 AM", end: "10:00 AM", startH: 8, endH: 10 },
  { round: 2, label: "Round 2", start: "10:00 AM", end: "12:00 PM", startH: 10, endH: 12 },
  { round: 3, label: "Round 3", start: "12:00 PM", end: "02:00 PM", startH: 12, endH: 14 },
  { round: 4, label: "Round 4", start: "02:00 PM", end: "04:00 PM", startH: 14, endH: 16 },
  { round: 5, label: "Round 5", start: "04:00 PM", end: "06:00 PM", startH: 16, endH: 18 },
];

function getActiveRound() {
  const h = new Date().getHours();
  return ROUNDS.find((r) => h >= r.startH && h < r.endH) ?? null;
}

function getNextRound() {
  const h = new Date().getHours();
  return ROUNDS.find((r) => r.startH > h) ?? null;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "meeting" | "focus" | "social" | "empty";
type CountingPhase = "setup" | "ready" | "session" | "counting";
type RoomStatus = "pending" | "ongoing" | "counted";

const FLOOR_CATEGORIES: { id: Category; label: string; desc: string; color: string; badge: string; text: string }[] = [
  { id: "meeting", label: "Meeting", desc: "Collaborative rooms with shared tables", color: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-700", text: "text-blue-700" },
  { id: "focus", label: "Focus", desc: "Quiet individual workspaces", color: "border-violet-200 bg-violet-50", badge: "bg-violet-100 text-violet-700", text: "text-violet-700" },
  { id: "social", label: "Social", desc: "Casual lounge areas for informal gatherings", color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700" },
  { id: "empty", label: "Empty", desc: "Vacant or transitional spaces", color: "border-gray-200 bg-gray-50", badge: "bg-gray-100 text-gray-600", text: "text-gray-600" },
];

interface RoomMeta {
  status: RoomStatus;
  lockedBy?: string;  // person currently counting
  countedBy?: string; // person who completed the count
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: RoomStatus }) {
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

// ─── Round notification banner ────────────────────────────────────────────────
function RoundBanner({ isRecording, roundInfo }: { isRecording: boolean; roundInfo?: string }) {
  const active = getActiveRound();
  const next = getNextRound();

  if (isRecording && active) {
    return (
      <div className="flex items-center gap-3 w-full bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
        <p className="text-xs font-semibold text-primary font-body">
          Session active · {active.start} – {active.end}{roundInfo ? ` · ${roundInfo}` : ""}
        </p>
      </div>
    );
  }

  if (active) {
    return (
      <div className="flex items-center gap-3 w-full bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
        <Bell size={14} className="text-amber-600 shrink-0" />
        <p className="text-xs font-semibold text-amber-800 font-body">
          {active.label} is open · {active.start} – {active.end} · Click &quot;Start counting session&quot; to begin{roundInfo ? ` · ${roundInfo}` : ""}
        </p>
      </div>
    );
  }

  if (next) {
    return (
      <div className="flex items-center gap-3 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
        <Clock size={14} className="text-text-muted shrink-0" />
        <p className="text-xs text-text-muted font-body">
          No round active now · {next.label} starts at {next.start}{roundInfo ? ` · ${roundInfo}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
      <Clock size={14} className="text-text-muted shrink-0" />
      <p className="text-xs text-text-muted font-body">
        Counting hours: 8:00 AM – 6:00 PM · 5 rounds of 2 hours each{roundInfo ? ` · ${roundInfo}` : ""}
      </p>
    </div>
  );
}

// ─── Prepare-session intro (Concept 2 from the counting prototype) ──────────────
const WHY_ITEMS = [
  { Icon: Users, label: "Empower people", color: "#139485" },
  { Icon: Layers, label: "Optimise space", color: "#C47A2C" },
  { Icon: Heart, label: "Better experience", color: "#6351AC" },
  { Icon: TrendingUp, label: "Smarter decisions", color: "#3B82F6" },
];

const PRE_COUNTING_CHECKLIST = [
  { id: "plan", label: "Floor plan open on my device" },
  { id: "route", label: "I will walk rooms in a logical order" },
  { id: "round", label: "I understand each round is ~2 hours" },
  { id: "seats", label: "I count occupied seats only" },
  { id: "notes", label: "I will note anything unusual" },
];

const QUICK_STEPS = [
  { Icon: Footprints, label: "Walk room by room", color: "#139485" },
  { Icon: Clock, label: "2-hour rounds", color: "#3B82F6" },
  { Icon: Armchair, label: "Occupied seats only", color: "#C47A2C" },
  { Icon: NotebookPen, label: "Add observations", color: "#6351AC" },
];

const SESSION_UNLOCKS = [
  { label: "Utilisation", color: "#139485" },
  { label: "Peak patterns", color: "#6351AC" },
  { label: "Spatial fit", color: "#C47A2C" },
  { label: "Collaboration", color: "#3B82F6" },
];

/** Concept 2 intro shown on the "Prepare session" step (no concept picker, no rooms table). */
function PrepareSessionIntro() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [masterAck, setMasterAck] = useState(false);
  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const doneCount = PRE_COUNTING_CHECKLIST.filter((i) => checked[i.id]).length;

  return (
    <div className="space-y-4">
      {/* Why you're doing this */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-border bg-surface-2 px-4 py-3">
        <span className="text-[10px] font-extrabold tracking-[0.07em] text-text-muted">
          Why you&apos;re doing this
        </span>
        {WHY_ITEMS.map(({ Icon, label, color }) => (
          <span key={label} className="inline-flex items-center gap-2 text-xs font-semibold text-text font-body">
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}1a`, color }}>
              <Icon size={13} />
            </span>
            {label}
          </span>
        ))}
      </div>

      {/* Pre-counting checklist */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={15} className="text-primary" />
          <span className="text-[11px] font-bold tracking-[0.06em] text-text-muted font-body">
            Pre-counting checklist · {doneCount}/{PRE_COUNTING_CHECKLIST.length}
          </span>
        </div>
        <div className="flex flex-col gap-2.5 mb-3">
          {PRE_COUNTING_CHECKLIST.map((item) => (
            <button key={item.id} type="button" onClick={() => toggle(item.id)} className="flex items-center gap-2.5 text-left">
              <span className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${checked[item.id] ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white"}`}>
                {checked[item.id] && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className={`text-sm font-body ${checked[item.id] ? "text-text-muted" : "text-text"}`}>{item.label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setMasterAck((v) => !v)} className="flex items-center gap-2.5 w-full rounded-xl bg-surface-2 px-3 py-2.5 text-left">
          <span className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${masterAck ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white"}`}>
            {masterAck && <Check size={10} className="text-white" strokeWidth={3} />}
          </span>
          <span className="text-sm font-semibold text-text font-body">I&apos;ve read the guidance and I&apos;m ready to count</span>
        </button>
      </div>

      {/* Visual hero */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <Chip tone="info">Ground Floor counting</Chip>
            <h3 className="text-base text-text mt-2 leading-snug max-w-xl" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
              Count what you see. We turn it into workplace evidence.
            </h3>
            <p className="text-xs text-text-muted font-body mt-1">Ground Floor · Round 4 of 5 today</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SESSION_UNLOCKS.map((u) => (
              <span key={u.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-white text-[11px] font-semibold text-text-muted font-body">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.color }} />
                {u.label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_STEPS.map(({ Icon, label, color }) => (
            <div key={label} className="rounded-xl border p-3 text-center" style={{ background: `${color}14`, borderColor: `${color}33` }}>
              <div className="flex justify-center mb-1.5" style={{ color }}><Icon size={20} /></div>
              <div className="text-[11px] font-bold text-text leading-tight font-body">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FloorCountPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const { floors, addCountEntry } = useCanvasStore();

  const [activeFloorId, setActiveFloorId] = useState(floorId);
  const floor = floors.find((f) => f.id === activeFloorId) || floors[0];
  const rooms = floor?.rooms || [];

  const [countingPhase, setCountingPhase] = useState<CountingPhase>("setup");
  const [showVerifyConfirmModal, setShowVerifyConfirmModal] = useState(false);
  const [editRoomSettings, setEditRoomSettings] = useState(false);
  // Shown when the user tries to verify a room (or continue) before setting a category
  const [showCategoryRequiredModal, setShowCategoryRequiredModal] = useState(false);
  // Per-room category selected during setup
  const [roomCategories, setRoomCategories] = useState<Record<string, string>>({});
  const [verifiedRooms, setVerifiedRooms] = useState<Set<string>>(new Set());
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategoryRoomId, setAddCategoryRoomId] = useState<string | null>(null);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Multi-room selection state
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<string>("");

  // Session table edit state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<{ name: string; sqm: string; seats: string; category: string }>({ name: "", sqm: "", seats: "", category: "" });

  // Editable seat inputs — raw string while typing
  const [roomSeatInputs, setRoomSeatInputs] = useState<Record<string, string>>({});

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState(getFormattedDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return getFormattedDate(d);
  });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [roomSeats, setRoomSeats] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    rooms.forEach((r) => {
      const hash = r.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      initial[r.id] = 4 + (hash % 8);
    });
    return initial;
  });

  // ── Room status (pending / ongoing / counted) ──────────────────────────────
  const [roomMeta, setRoomMeta] = useState<Record<string, RoomMeta>>(() => {
    const init: Record<string, RoomMeta> = {};
    rooms.forEach((r) => { init[r.id] = { status: "pending" }; });
    return init;
  });

  const [showStopModal, setShowStopModal] = useState(false);
  const [_isSessionSaved, setIsSessionSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  // Comment state
  const [roomComment, setRoomComment] = useState("");
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [_roomComments, setRoomComments] = useState<Record<string, string>>({});
  const [showSaveCommentsModal, setShowSaveCommentsModal] = useState(false);
  const [commentPendingAction, setCommentPendingAction] = useState<"done" | "exit" | null>(null);

  const [selectedProject] = useState(mockProject.name);
  const [selectedFloorName, setSelectedFloorName] = useState(floor?.name || "Ground Floor");
  const [showNextFloorModal, setShowNextFloorModal] = useState(false);
  const [nextFloorSelection, setNextFloorSelection] = useState("1st Floor");
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      q: "Why do we do this counting exercise?",
      a: "To build a fact-based understanding of how we use our office facilities today.",
    },
    {
      q: "Can we see data continuously while we count?",
      a: "Yes.",
    },
    {
      q: "Do we need to count all areas including common areas in the building?",
      a: "Yes, everything needs to be counted.",
    },
    {
      q: "Do we need to count all seats, including in the social zones and the canteen?",
      a: "Yes.",
    },
    {
      q: "Can I split the counting in two (i.e. count half of the area at 8:00 and the other half at 09:00)?",
      a: "No. It is important to count the whole counting route at once and at the same time every day. The reason for this is that we need accurate and consistent information about how we use the facilities in order to be able to optimize our future.",
    },
  ];

  const activeRound = getActiveRound();
  const roundLabel = activeRound ? `${activeRound.label} of 5 today` : "No active round";

  // Navigate to session-details phase when arriving from history page
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#session-details") {
      setCountingPhase("ready");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to session phase when arriving from hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#active-session") {
      setCountingPhase("session");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to counting phase when arriving from hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#room-counting") {
      setCountingPhase("counting");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const selectedZone = (floor?.zones || []).find((z) => z.id === selectedRoom?.zoneId);

  // ── Session start — simulate 2 rooms being counted by other users ───────────
  const handleStartSession = () => {
    setCountingPhase("session");
    setIsRecording(true);
    // Simulate concurrent users: 2 rooms are already being counted by mock users
    setRoomMeta((prev) => {
      const next = { ...prev };
      if (rooms[4]) next[rooms[4].id] = { status: "ongoing", lockedBy: "Mikkel T." };
      if (rooms[2]) next[rooms[2].id] = { status: "ongoing", lockedBy: "Sara L." };
      return next;
    });
  };

  const handleStartCounting = (roomId: string) => {
    const meta = roomMeta[roomId];
    // Block if another user is counting this room
    if (meta?.status === "ongoing" && meta.lockedBy !== "You") return;

    setSelectedRoomId(roomId);
    setCountingPhase("counting");

    // Mark room as ongoing by current user
    setRoomMeta((prev) => ({
      ...prev,
      [roomId]: { status: "ongoing", lockedBy: "You" },
    }));

    if (sessionCounts[roomId] === undefined) {
      setSessionCounts((prev) => ({ ...prev, [roomId]: 0 }));
    }
  };

  const adjustCount = (delta: number) => {
    if (!selectedRoomId) return;
    setSessionCounts((prev) => ({
      ...prev,
      [selectedRoomId]: Math.max(0, (prev[selectedRoomId] || 0) + delta),
    }));
  };

  const proceedAfterRecord = (currentRoomId: string) => {
    const currentIndex = rooms.findIndex((r) => r.id === currentRoomId);
    if (currentIndex < rooms.length - 1) {
      const nextRoomId = rooms[currentIndex + 1].id;
      setSelectedRoomId(nextRoomId);
      setRoomMeta((prev) => ({
        ...prev,
        [nextRoomId]: { status: "ongoing", lockedBy: "You" },
      }));
      if (sessionCounts[nextRoomId] === undefined) {
        setSessionCounts((prev) => ({ ...prev, [nextRoomId]: 0 }));
      }
    } else {
      setCountingPhase("session");
      setShowNextFloorModal(true);
    }
  };

  const handleRecordCount = () => {
    if (!selectedRoomId || !floor) return;
    const count = sessionCounts[selectedRoomId] || 0;

    addCountEntry(floor.id, selectedRoomId, {
      count,
      by: "You",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    });

    // Mark current room as counted
    setRoomMeta((prev) => ({
      ...prev,
      [selectedRoomId]: { status: "counted", countedBy: "You" },
    }));

    const currentIndex = rooms.findIndex((r) => r.id === selectedRoomId);

    if (currentIndex < rooms.length - 1) {
      // Not last room — floor-level comment persists, just proceed
      proceedAfterRecord(selectedRoomId);
    } else {
      // Last room (Done) — if unsaved comment, ask user first
      if (roomComment.trim()) {
        setCommentPendingAction("done");
        setShowSaveCommentsModal(true);
      } else {
        proceedAfterRecord(selectedRoomId);
      }
    }
  };

  const isLastRoom = rooms.findIndex((r) => r.id === selectedRoomId) === rooms.length - 1;

  const handleBackToCanvas = () => {
    if (roomComment.trim()) {
      setCommentPendingAction("exit");
      setShowSaveCommentsModal(true);
      return;
    }
    if (isRecording) {
      setPendingNav(`/project/${projectId}/floor/${floorId}`);
      setShowStopModal(true);
    } else {
      router.push(`/project/${projectId}/floor/${floorId}`);
    }
  };

  const handleSaveComments = (save: boolean) => {
    if (save && selectedRoomId && roomComment.trim()) {
      setRoomComments((prev) => ({ ...prev, [selectedRoomId]: roomComment.trim() }));
    }
    setRoomComment("");
    setShowSaveCommentsModal(false);
    const action = commentPendingAction;
    setCommentPendingAction(null);
    if (action === "done") {
      if (selectedRoomId) proceedAfterRecord(selectedRoomId);
    } else if (action === "exit") {
      if (isRecording) {
        setPendingNav(`/project/${projectId}/floor/${floorId}`);
        setShowStopModal(true);
      } else {
        router.push(`/project/${projectId}/floor/${floorId}`);
      }
    }
  };

  const confirmStopSession = () => {
    setIsRecording(false);
    setTimer(0);
    setIsSessionSaved(true);
    setShowStopModal(false);
    if (pendingNav) router.push(pendingNav);
  };

  const updateSeats = (roomId: string, val: number) => {
    setRoomSeats((prev) => ({ ...prev, [roomId]: Math.max(1, val) }));
  };

  // ── Add custom category ───────────────────────────────────────────────────────
  const handleAddCategory = () => {
    const name = newCategoryInput.trim();
    if (!name) return;
    if (!customCategories.includes(name)) {
      setCustomCategories((prev) => [...prev, name]);
    }
    if (addCategoryRoomId) {
      setRoomCategories((prev) => ({ ...prev, [addCategoryRoomId]: name }));
    }
    setShowAddCategoryModal(false);
    setNewCategoryInput("");
    setAddCategoryRoomId(null);
  };

  // ── Multi-room helpers ─────────────────────────────────────────────────────────
  const toggleRoomSelect = (id: string) => {
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const applyBulkCategory = () => {
    if (!bulkCategory) return;
    selectedRoomIds.forEach((id) => {
      setRoomCategories((prev) => ({ ...prev, [id]: bulkCategory }));
      setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(id); return n; });
    });
    setSelectedRoomIds(new Set());
    setBulkCategory("");
  };

  // ── Verify selection helpers ───────────────────────────────────────────────────
  const toggleRoomVerified = (id: string) => {
    // A room can only be verified once it has a category
    if (!verifiedRooms.has(id) && !roomCategories[id]) { setShowCategoryRequiredModal(true); return; }
    setVerifiedRooms((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
    // Once verified, clear this row's selection checkmark (same logic as category)
    setSelectedRoomIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  // Main (header) checkboxes confirm before applying to every room
  const [confirmBulk, setConfirmBulk] = useState<null | "category" | "verify">(null);
  const allSelected = rooms.length > 0 && selectedRoomIds.size === rooms.length;
  const allVerified = rooms.length > 0 && rooms.every((r) => verifiedRooms.has(r.id));

  const handleCategoryMainCheck = () => {
    if (allSelected) setSelectedRoomIds(new Set());
    else setConfirmBulk("category");
  };
  const handleVerifyMainCheck = () => {
    if (allVerified) {
      setVerifiedRooms(new Set());
    } else {
      const allHaveCategory = rooms.length > 0 && rooms.every((r) => roomCategories[r.id]);
      if (!allHaveCategory) {
        setShowCategoryRequiredModal(true);
      } else {
        setConfirmBulk("verify");
      }
    }
  };
  const confirmBulkAction = () => {
    if (confirmBulk === "category") setSelectedRoomIds(new Set(rooms.map((r) => r.id)));
    // Only rooms that already have a category can be verified
    else if (confirmBulk === "verify") setVerifiedRooms(new Set(rooms.filter((r) => roomCategories[r.id]).map((r) => r.id)));
    setConfirmBulk(null);
  };

  // (bulk category is now shown as an inline card above the table, not a modal)

  // ── Seat input helpers ─────────────────────────────────────────────────────────
  const getSeatInputValue = (roomId: string) =>
    roomSeatInputs[roomId] ?? String(roomSeats[roomId] || 1);

  const commitSeatInput = (roomId: string, raw: string) => {
    const n = Math.max(1, parseInt(raw.replace(/\D/g, "")) || 1);
    updateSeats(roomId, n);
    setRoomSeatInputs((prev) => ({ ...prev, [roomId]: String(n) }));
  };

  // ── Setup screen confirm ──────────────────────────────────────────────────────
  const handleSetupConfirm = () => {
    setCountingPhase("ready");
    if (editRoomSettings) {
      // Returning from "Edit room setup" — don't prompt to start the session
      setEditRoomSettings(false);
    }
  };

  const _allRoomsSetup = rooms.every((r) => roomCategories[r.id] && verifiedRooms.has(r.id));

  // Counting-stepper navigation — in-page phase switches stay on this page,
  // other steps route to their canonical destination.
  const handleStepClick = (id: CountingStepId) => {
    if (id === "room-setup") { setEditRoomSettings(false); setCountingPhase("setup"); return; }
    if (id === "session-details") { setCountingPhase("ready"); return; }
    if (id === "active-session") { setCountingPhase("session"); return; }
    if (id === "room-counting") { setCountingPhase("counting"); return; }
    router.push(countingStepHref(projectId, floorId, id));
  };

  if (countingPhase === "setup") {
    return (
      <div className="h-screen flex flex-col font-body overflow-hidden" style={{ background: "#FBF6EE" }}>
        <header className="px-3 py-2 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToCanvas}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            {/* Project name */}
            <span className="text-sm font-semibold text-text font-body truncate max-w-[180px]">
              {mockProject.name}
            </span>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            {/* Floor selector — matches canvas navbar style */}
            <div className="relative min-w-[148px]">
              <select
                value={activeFloorId}
                onChange={(e) => setActiveFloorId(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        {/* ── Workplace Journey Bar ── */}
        <WorkplaceJourneyBar activeStep="1-2" />
        <CountingStepper activeStep="room-setup" onStepClick={handleStepClick} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div className="border-b border-[#F1F5F9] pt-6 sm:pt-8 pb-5 -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 px-6 sm:px-8 flex items-end justify-between gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-body">
                    <span className="text-text-muted">Room counting tool</span>
                    <span className="text-text-muted">/</span>
                    <span className="font-semibold text-text">
                      {editRoomSettings ? "Edit room setup" : "Room setup"}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    {editRoomSettings ? "Edit room setup" : "Room setup"}
                  </h2>
                </div>
                <Button
                  size="sm"
                  className="h-9 px-6 rounded-full shadow-md shadow-primary/20 font-bold shrink-0"
                  icon={<CheckCircle2 size={14} />}
                  onClick={() => {
                    if (allVerified) handleSetupConfirm();
                    else if (rooms.some((r) => !roomCategories[r.id])) setShowCategoryRequiredModal(true);
                    else setShowVerifyConfirmModal(true);
                  }}
                >
                  Continue to next
                </Button>
              </div>

              {/* ── Setup guidance ── */}
              <div className="space-y-3">
                {/* Outcome cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { color: "#139485", Icon: BarChart3, title: "Utilisation %", body: "Count ÷ seats" },
                    { color: "#6351AC", Icon: Search, title: "Analysis", body: "Over/under use" },
                    { color: "#E05D8B", Icon: ClipboardList, title: "Report", body: "Room programme" },
                  ].map(({ color, Icon, title, body }) => (
                    <div
                      key={title}
                      className="rounded-2xl border p-4 text-center"
                      style={{ background: `${color}14`, borderColor: `${color}33` }}
                    >
                      <div className="flex justify-center mb-1.5" style={{ color }}>
                        <Icon size={22} />
                      </div>
                      <p className="text-sm font-bold" style={{ color, fontFamily: "var(--font-manrope)" }}>
                        {title}
                      </p>
                      <p className="text-xs text-text-muted font-body mt-0.5">{body}</p>
                    </div>
                  ))}
                </div>

                {/* Help info bar */}
                <div className="flex items-start gap-2.5 rounded-2xl border border-[#E2E8F0] bg-surface-2 px-4 py-3 text-sm font-body text-text-muted">
                  <Info size={16} className="shrink-0 text-text-muted mt-0.5" />
                  <span>
                    <strong className="font-semibold text-text">Why Are Room Category and Capacity Important?</strong>{" "}
                    The objective of setting the room capacity is to gather information about the available number of seats
                    across the office so that we can monitor the use of meeting room capacity in order to optimise the meeting
                    room setup based on findings.
                  </span>
                </div>

                {/* Category hint */}
                <div className="flex items-start gap-2.5 rounded-2xl border border-[#E2E8F0] bg-surface-2 px-4 py-3 text-sm font-body text-text-muted">
                  <Info size={16} className="shrink-0 text-text-muted mt-0.5" />
                  <span>
                    <strong className="font-semibold text-text">Not sure about room category?</strong> Pick the closest match.
                    You can edit it at any time. Consistency across counters matters more than perfection. Once you set the
                    room category and capacity, verify rooms.
                  </span>
                </div>
              </div>

              {/* ── Inline bulk category card — shown when rooms are selected ── */}
              <AnimatePresence>
                {selectedRoomIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                          Set category
                        </h3>
                        <p className="text-xs text-text-muted">
                          Apply to {selectedRoomIds.size} selected room{selectedRoomIds.size > 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => { setSelectedRoomIds(new Set()); setBulkCategory(""); }}
                        className="text-text-muted hover:text-text transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {/* Category icon cards */}
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                      {[
                        ...FLOOR_CATEGORIES,
                        ...customCategories.map((cc) => ({
                          id: cc,
                          label: cc,
                          desc: "Custom category",
                          color: "border-gray-200 bg-gray-50",
                          badge: "bg-gray-100 text-gray-600",
                          text: "text-gray-600",
                        })),
                      ].map((fc) => {
                        const iconMap: Record<string, React.ReactNode> = {
                          meeting: <Users size={16} />,
                          focus: <Target size={16} />,
                          social: <Coffee size={16} />,
                          empty: <Box size={16} />,
                        };
                        const icon = iconMap[fc.id] ?? <Layers size={16} />;
                        const isSelected = bulkCategory === fc.id;
                        return (
                          <button
                            key={fc.id}
                            onClick={() => setBulkCategory(fc.id)}
                            className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all min-w-[120px] text-left shrink-0 ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-[#E2E8F0] bg-white hover:border-primary/40 hover:bg-[#FAFBFC]"
                              }`}
                          >
                            <div className={`${isSelected ? "text-primary" : "text-text-muted"}`}>{icon}</div>
                            <div>
                              <p className={`text-xs font-bold leading-none mb-0.5 ${isSelected ? "text-primary" : "text-text"}`}>{fc.label}</p>
                              <p className="text-[10px] text-text-muted leading-tight">{fc.desc}</p>
                            </div>
                            {isSelected && <Check size={10} className="text-primary ml-auto mt-auto" strokeWidth={3} />}
                          </button>
                        );
                      })}
                      {/* Add new category */}
                      <button
                        onClick={() => { setAddCategoryRoomId(null); setNewCategoryInput(""); setShowAddCategoryModal(true); }}
                        className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-primary/40 hover:bg-[#FAFBFC] transition-all min-w-[90px] shrink-0"
                      >
                        <Plus size={16} className="text-text-muted" />
                        <p className="text-xs font-bold text-text leading-none">Add new</p>
                      </button>
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setSelectedRoomIds(new Set()); setBulkCategory(""); }}
                        className="text-xs font-semibold text-text-muted hover:text-text transition-colors px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <Button
                        size="sm"
                        disabled={!bulkCategory}
                        onClick={applyBulkCategory}
                      >
                        Apply to {selectedRoomIds.size} room{selectedRoomIds.size > 1 ? "s" : ""}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Per-room setup */}
              <div className="space-y-3">
                {/* Progress bar */}
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[11px] font-semibold text-text-muted tracking-wider font-body whitespace-nowrap">
                    {rooms.filter((r) => roomCategories[r.id] && verifiedRooms.has(r.id)).length} of {rooms.length} rooms verified
                  </span>
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#bfa483] rounded-full transition-all duration-300"
                      style={{ width: `${rooms.length ? (rooms.filter((r) => roomCategories[r.id] && verifiedRooms.has(r.id)).length / rooms.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Room name</TableHead>
                      <TableHead className="w-1/4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={handleCategoryMainCheck}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${allSelected
                              ? "bg-primary border-primary"
                              : selectedRoomIds.size > 0
                                ? "bg-primary/30 border-primary"
                                : "border-[#C0D0DC] bg-white"
                              }`}
                            title="Select all rooms"
                          >
                            {selectedRoomIds.size > 0 && <Check size={11} className="text-white" strokeWidth={3} />}
                          </button>
                          Room category
                        </div>
                      </TableHead>
                      <TableHead className="w-1/4 text-center">Seat capacity</TableHead>
                      <TableHead className="w-1/4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={handleVerifyMainCheck}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${allVerified
                              ? "bg-primary border-primary"
                              : verifiedRooms.size > 0
                                ? "bg-primary/30 border-primary"
                                : "border-[#C0D0DC] bg-white"
                              }`}
                            title="Mark all rooms as verified"
                          >
                            {verifiedRooms.size > 0 && <Check size={11} className="text-white" strokeWidth={3} />}
                          </button>
                          Verify details
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => {
                      const cat = roomCategories[room.id];
                      const seats = roomSeats[room.id] || 1;
                      const isVerified = verifiedRooms.has(room.id);
                      const isChecked = selectedRoomIds.has(room.id);
                      return (
                        <TableRow key={room.id} className={isChecked ? "bg-primary/5 hover:bg-primary/5" : undefined}>
                          {/* Room name */}
                          <TableCell>
                            <p className="text-sm text-text font-body">{room.name}</p>
                            <p className="text-xs text-text-muted font-body">{formatNumber(room.sqm || 25)} m²</p>
                          </TableCell>

                          {/* Room category — select checkbox + dropdown */}
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleRoomSelect(room.id)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isChecked ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white hover:border-primary"
                                  }`}
                                title="Select to set category"
                              >
                                {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                              </button>
                              <div className="relative w-[160px]">
                                <select
                                  value={cat || ""}
                                  onChange={(e) => {
                                    if (e.target.value === "add-new") {
                                      setAddCategoryRoomId(room.id);
                                      setNewCategoryInput("");
                                      setShowAddCategoryModal(true);
                                    } else {
                                      setRoomCategories((prev) => ({ ...prev, [room.id]: e.target.value }));
                                      setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(room.id); return n; });
                                      // Once a category is chosen, clear this row's selection checkmark
                                      setSelectedRoomIds((prev) => { const n = new Set(prev); n.delete(room.id); return n; });
                                    }
                                  }}
                                  className="appearance-none w-full rounded-xl border border-[#E2E8F0] bg-white pl-3 pr-8 py-2 text-xs font-semibold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
                                >
                                  <option value="" disabled>Select category...</option>
                                  {FLOOR_CATEGORIES.map((fc) => (
                                    <option key={fc.id} value={fc.id}>{fc.label}</option>
                                  ))}
                                  {customCategories.map((cc) => (
                                    <option key={cc} value={cc}>{cc}</option>
                                  ))}
                                  <option value="add-new">+ Add new category</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                              </div>
                            </div>
                          </TableCell>

                          {/* Seats — ± buttons + editable number */}
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  const n = Math.max(1, seats - 1);
                                  updateSeats(room.id, n);
                                  setRoomSeatInputs((prev) => ({ ...prev, [room.id]: String(n) }));
                                }}
                                className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all"
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={getSeatInputValue(room.id)}
                                onChange={(e) =>
                                  setRoomSeatInputs((prev) => ({ ...prev, [room.id]: e.target.value.replace(/\D/g, "") }))
                                }
                                onBlur={(e) => commitSeatInput(room.id, e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                                className="w-10 text-center text-sm font-bold text-text tabular-nums rounded-lg border border-[#E2E8F0] py-0.5 focus:outline-none focus:border-primary transition-colors bg-white"
                              />
                              <button
                                onClick={() => {
                                  const n = seats + 1;
                                  updateSeats(room.id, n);
                                  setRoomSeatInputs((prev) => ({ ...prev, [room.id]: String(n) }));
                                }}
                                className="w-7 h-7 rounded-lg border border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </TableCell>

                          {/* Verify / Verified */}
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleRoomVerified(room.id)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isVerified ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white hover:border-primary"}`}
                                title="Mark as verified"
                              >
                                {isVerified && <Check size={11} className="text-white" strokeWidth={3} />}
                              </button>
                              {isVerified ? (
                                <button
                                  onClick={() => setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(room.id); return n; })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary/15 transition-all"
                                >
                                  <Check size={11} strokeWidth={3} /> Verified
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (!cat) { setShowCategoryRequiredModal(true); return; }
                                    setVerifiedRooms((prev) => new Set([...prev, room.id]));
                                    setSelectedRoomIds((prev) => { const n = new Set(prev); n.delete(room.id); return n; });
                                  }}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary/5 transition-all"
                                >
                                  Verify
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

            </div>
          </div>
        </main>

        {/* ── Verify Confirm Modal ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showVerifyConfirmModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-md relative"
              >
                <button
                  onClick={() => setShowVerifyConfirmModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
                >
                  <X size={16} />
                </button>
                <div className="p-8 text-center space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={22} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                      Verify and continue?
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      You need to verify all rooms before you can move to the next step. Are you sure you want to verify and continue?
                    </p>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowVerifyConfirmModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="md"
                      className="flex-1"
                      onClick={() => {
                        setShowVerifyConfirmModal(false);
                        setVerifiedRooms(new Set(rooms.filter((r) => roomCategories[r.id]).map((r) => r.id)));
                        handleSetupConfirm();
                      }}
                    >
                      Verify and continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Category required modal (verify attempted before setting a category) ─── */}
        <AnimatePresence>
          {showCategoryRequiredModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-md relative"
              >
                <button
                  onClick={() => setShowCategoryRequiredModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
                >
                  <X size={16} />
                </button>
                <div className="p-8 text-center space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                    <Info size={22} className="text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                      Set category and capacity first
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      You need to set the room category and capacity before you can verify.
                    </p>
                  </div>
                  <div className="flex justify-center pt-1">
                    <Button size="md" className="px-8" onClick={() => setShowCategoryRequiredModal(false)}>
                      Got it
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Bulk action confirm modal (select all / verify all) ─────────────────── */}
        <AnimatePresence>
          {confirmBulk && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-md relative"
              >
                <button
                  onClick={() => setConfirmBulk(null)}
                  className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
                >
                  <X size={16} />
                </button>
                <div className="p-8 text-center space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    {confirmBulk === "verify"
                      ? <CheckCircle2 size={22} className="text-primary" />
                      : <Layers size={22} className="text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                      {confirmBulk === "verify" ? "Mark all rooms as verified?" : "Select all rooms?"}
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {confirmBulk === "verify"
                        ? "This will mark every room on this floor as verified. Are you sure you want to mark all the rooms as verified?"
                        : "This will select every room so you can set a category for all of them at once. Are you sure you want to select all the rooms?"}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button variant="secondary" size="md" className="flex-1" onClick={() => setConfirmBulk(null)}>
                      Cancel
                    </Button>
                    <Button size="md" className="flex-1" onClick={confirmBulkAction}>
                      {confirmBulk === "verify" ? "Yes, verify all" : "Yes, select all"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Add Category Modal ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showAddCategoryModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                  <h3 className="font-extrabold text-text text-sm" style={{ fontFamily: "var(--font-manrope)" }}>
                    Add new category
                  </h3>
                  <button onClick={() => setShowAddCategoryModal(false)} className="text-text-muted hover:text-text transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <Input
                      label="Category name"
                      fieldSize="sm"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="e.g. Storage, Reception..."
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter" && newCategoryInput.trim()) handleAddCategory(); }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowAddCategoryModal(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" className="flex-1" disabled={!newCategoryInput.trim()} onClick={handleAddCategory}>
                      Add category
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div className="h-screen bg-bg flex flex-col font-body overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="bg-white px-3 py-2 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToCanvas}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[200px]">
              {selectedProject}
            </span>
            <div className="w-px h-6 bg-[#E2E8F0] hidden sm:block" />
            <div className="relative min-w-[148px]">
              <select
                value={selectedFloorName}
                onChange={(e) => setSelectedFloorName(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option>Ground Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil size={13} />}
              className="h-9 px-5 gap-2"
              onClick={() => { setEditRoomSettings(true); setCountingPhase("setup"); }}
            >
              Edit room setup
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="h-9 px-5 gap-2"
              onClick={() => setShowQuestionsModal(true)}
              icon={<HelpCircle size={14} />}
            >
              Got questions?
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={countingPhase === "counting"}
              className="h-9 px-5"
              icon={<ClipboardList size={14} />}
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}
            >
              Counting history
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="h-9 px-5"
              icon={<LayoutGrid size={14} />}
              onClick={() => router.push(`/project/${projectId}/session-overview`)}
            >
              All floors
            </Button>

            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 bg-white border border-primary rounded-full px-4 h-9 shadow-sm"
                >
                  <span
                    className="text-lg font-bold text-primary tabular-nums"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {formatTime(timer)}
                  </span>
                  <button
                    onClick={() => setShowStopModal(true)}
                    className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md shadow-red-200"
                  >
                    <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />
      <CountingStepper
        activeStep={countingPhase === "counting" ? "room-counting" : countingPhase === "session" ? "active-session" : "session-details"}
        onStepClick={handleStepClick}
      />

      <main className="flex-1 overflow-hidden flex relative p-6 gap-6 max-w-[1600px] mx-auto w-full">

        {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className={cn(
            "flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden",
            countingPhase !== "counting" ? "flex-1 min-w-0" : "w-64 shrink-0"
          )}
        >
          {countingPhase === "counting" ? (
            <div className="flex flex-col h-full w-full overflow-hidden">
              {/* Sidebar header — back + progress */}
              <div className="px-4 py-4 border-b border-[#F1F5F9] shrink-0">
                <button
                  onClick={() => setCountingPhase("session")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors mb-3"
                >
                  <ArrowLeft size={14} /> Back to rooms
                </button>
                {(() => {
                  const done = rooms.filter((r) => (roomMeta[r.id]?.status === "counted") || sessionCounts[r.id] !== undefined).length;
                  const pct = rooms.length ? Math.round((done / rooms.length) * 100) : 0;
                  return (
                    <div className="rounded-xl bg-surface-2 border border-border p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-text-muted font-body">Round {done}/{rooms.length}</span>
                        <span className="text-xs font-bold text-primary font-body">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-[#bfa483] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* Room list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="text-[10px] font-bold tracking-[0.06em] text-text-muted font-body px-1 mb-1">Rooms on this floor</p>
                {rooms.map((r) => {
                  const active = r.id === selectedRoomId;
                  const status = roomMeta[r.id]?.status ?? "pending";
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleStartCounting(r.id)}
                      className={cn(
                        "w-full text-left rounded-xl px-3 py-2 border transition-all",
                        active ? "bg-primary/5 border-primary/30" : "border-transparent hover:bg-surface-2"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-sm font-body truncate", active ? "font-bold text-primary" : "text-text")}>{r.name}</span>
                        {status === "counted" ? (
                          <Check size={13} className="text-primary shrink-0" strokeWidth={3} />
                        ) : status === "ongoing" ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        ) : null}
                      </div>
                      <div className="text-[11px] text-text-muted font-body">{formatNumber(r.sqm || 25)} m² · {roomSeats[r.id] || 0} seats</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Panel header — matches the Room setup title section */}
              <div className="border-b border-[#F1F5F9] pt-6 sm:pt-8 pb-5 px-6 sm:px-8 flex items-end justify-between gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-body">
                    <span className="text-text-muted">Room counting tool</span>
                    <span className="text-text-muted">/</span>
                    <span className="font-semibold text-text">{countingPhase === "ready" ? "Prepare session" : "Pick rooms to count"}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    {countingPhase === "ready" ? "Prepare session" : "Pick rooms to count"}
                  </h3>
                </div>
                {countingPhase === "ready" ? (
                  <Button
                    size="sm"
                    className="h-9 px-6 rounded-full shadow-md shadow-primary/20 font-bold shrink-0"
                    icon={<Play size={14} />}
                    onClick={handleStartSession}
                  >
                    Start counting session
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-9 px-6 rounded-full shadow-md shadow-primary/20 font-bold shrink-0"
                    icon={<Play size={14} />}
                    onClick={() => { if (!selectedRoomId && rooms[0]) setSelectedRoomId(rooms[0].id); setCountingPhase("counting"); }}
                  >
                    Start room counting
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Prepare session — Concept 2 intro (only in the ready phase) */}
                {countingPhase === "ready" && <PrepareSessionIntro />}

                {/* Banner + dates + round indicator — one row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[220px]">
                    <RoundBanner isRecording={isRecording} roundInfo={`${roundLabel} · Day 1 of 14`} />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs font-semibold text-[#222B27] whitespace-nowrap">Start date</label>
                    <div style={{ width: "140px" }}>
                      <Input
                        type="date"
                        fieldSize="sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs font-semibold text-[#222B27] whitespace-nowrap">End date</label>
                    <div style={{ width: "140px" }}>
                      <Input
                        type="date"
                        fieldSize="sm"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="flex bg-surface-2 border border-border rounded-2xl overflow-hidden divide-x divide-border shadow-sm font-body">
                  <div className="flex-1 px-5 py-3 flex flex-col gap-1">
                    <span className="text-sm font-bold text-text font-body">Total seats in floor</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (roomSeats[r.id] || 0), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">Seats total</span>
                    </div>
                  </div>
                  <div className="flex-1 px-5 py-3 flex flex-col gap-1">
                    <span className="text-sm font-bold text-text font-body">Seats used today (Avg)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800 }}>
                        {formatNumber(Math.round(
                          rooms.reduce((acc, r) => acc + (sessionCounts[r.id] || 0), 0) /
                          Math.max(rooms.filter((r) => sessionCounts[r.id] !== undefined).length, 1)
                        ))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">Occupants avg</span>
                    </div>
                  </div>
                  <div className="flex-1 px-5 py-3 flex flex-col gap-1">
                    <span className="text-sm font-bold text-text font-body">Total floor area</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (r.sqm || 25), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">m² total</span>
                    </div>
                  </div>
                </div>

                {/* ── Room table ── */}
                <Table>
                  <TableHeader>
                    <TableRow className="text-[11px] font-bold text-text">
                      <TableHead>Room</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Square Meters</TableHead>
                      <TableHead>No of seats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Counted by</TableHead>
                      <TableHead>Counting</TableHead>
                      <TableHead>Edit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => {
                      const meta = roomMeta[room.id] ?? { status: "pending" as RoomStatus };
                      const isLockedByOther =
                        meta.status === "ongoing" && meta.lockedBy !== "You";
                      const count = sessionCounts[room.id];

                      return (
                        <TableRow
                          key={room.id}
                          className={cn(
                            isLockedByOther
                              ? "bg-amber-50/40 opacity-70"
                              : meta.status === "counted"
                                ? "bg-emerald-50/30"
                                : "hover:bg-[#fafafa]"
                          )}
                        >
                          {/* Room name */}
                          <TableCell>
                            {editingRowId === room.id ? (
                              <input
                                value={editRowData.name}
                                onChange={(e) => setEditRowData((p) => ({ ...p, name: e.target.value }))}
                                className="w-full rounded-lg border border-[#D1D1D1] bg-white px-3 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-[#139485] focus:ring-2 focus:ring-[rgba(19,148,133,0.18)] transition-all"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {isLockedByOther && <Lock size={12} className="text-amber-500 shrink-0" />}
                                <span className="text-sm text-text">{room.name}</span>
                              </div>
                            )}
                          </TableCell>

                          {/* Category */}
                          <TableCell className="text-sm text-text">
                            {editingRowId === room.id ? (
                              <select
                                value={editRowData.category}
                                onChange={(e) => setEditRowData((p) => ({ ...p, category: e.target.value }))}
                                className="rounded-lg border border-[#D1D1D1] bg-white px-3 py-1.5 text-xs font-semibold text-text focus:outline-none focus:border-[#139485] focus:ring-2 focus:ring-[rgba(19,148,133,0.18)] transition-all appearance-none"
                              >
                                {FLOOR_CATEGORIES.map((fc) => <option key={fc.id} value={fc.id}>{fc.label}</option>)}
                              </select>
                            ) : (
                              <Chip tone="neutral">
                                {roomCategories[room.id] || "Meeting"}
                              </Chip>
                            )}
                          </TableCell>

                          {/* Sqm */}
                          <TableCell className="text-sm text-text">
                            {editingRowId === room.id ? (
                              <input
                                value={editRowData.sqm}
                                onChange={(e) => setEditRowData((p) => ({ ...p, sqm: e.target.value.replace(/\D/g, "") }))}
                                className="w-24 rounded-lg border border-[#D1D1D1] bg-white px-3 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-[#139485] focus:ring-2 focus:ring-[rgba(19,148,133,0.18)] transition-all"
                              />
                            ) : (
                              <span className="text-text">{formatNumber(room.sqm || 25)} m²</span>
                            )}
                          </TableCell>

                          {/* Seats */}
                          <TableCell className="text-sm">
                            {editingRowId === room.id ? (
                              <input
                                value={editRowData.seats}
                                onChange={(e) => setEditRowData((p) => ({ ...p, seats: e.target.value.replace(/\D/g, "") }))}
                                className="w-16 rounded-lg border border-[#D1D1D1] bg-white px-3 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-[#139485] focus:ring-2 focus:ring-[rgba(19,148,133,0.18)] transition-all"
                              />
                            ) : (
                              <span className="text-text tabular-nums">{roomSeats[room.id] || 0}</span>
                            )}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <StatusBadge status={meta.status} />
                          </TableCell>

                          {/* Counted by */}
                          <TableCell>
                            {meta.status === "counted" && meta.countedBy ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-700 shrink-0">
                                  {meta.countedBy.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <span className="text-sm text-text">{meta.countedBy}</span>
                              </div>
                            ) : meta.status === "ongoing" && meta.lockedBy ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                                  <User size={9} className="text-amber-700" />
                                </div>
                                <span className="text-sm text-text">{meta.lockedBy}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-text">—</span>
                            )}
                          </TableCell>

                          {/* Counting action */}
                          <TableCell>
                            {isLockedByOther ? (
                              <div className="flex items-center gap-1.5 text-sm text-amber-600">
                                <Lock size={11} />
                                Locked by {meta.lockedBy}
                              </div>
                            ) : meta.status === "counted" ? (
                              <div className="flex items-center justify-between px-2">
                                <span className="text-sm text-text">
                                  {count ?? 0}
                                </span>
                                <button
                                  onClick={() => handleStartCounting(room.id)}
                                  className="text-sm text-text-muted hover:text-primary underline underline-offset-4"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : count !== undefined ? (
                              <div className="flex items-center justify-between px-2">
                                <span className="text-sm text-text">
                                  {count}
                                </span>
                                <button
                                  onClick={() => handleStartCounting(room.id)}
                                  className="text-sm text-text-muted hover:text-primary underline underline-offset-4"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={!isRecording}
                                onClick={() => handleStartCounting(room.id)}
                                className="w-auto px-4"
                                icon={<Play size={13} />}
                              >
                                Start counting
                              </Button>
                            )}
                          </TableCell>

                          {/* Edit column */}
                          <TableCell>
                            {editingRowId === room.id ? (
                              <Button
                                size="sm"
                                className="gap-1.5 px-3"
                                icon={<Save size={13} />}
                                onClick={() => {
                                  const seats = parseInt(editRowData.seats) || 1;
                                  setRoomSeats((prev) => ({ ...prev, [room.id]: seats }));
                                  if (editRowData.category) setRoomCategories((prev) => ({ ...prev, [room.id]: editRowData.category }));
                                  setEditingRowId(null);
                                }}
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="gap-1.5 px-3"
                                icon={<Pencil size={13} />}
                                onClick={() => {
                                  setEditingRowId(room.id);
                                  setEditRowData({
                                    name: room.name,
                                    sqm: String(room.sqm || 25),
                                    seats: String(roomSeats[room.id] || 0),
                                    category: roomCategories[room.id] || "meeting",
                                  });
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Collapsed right strip — switch to room counting (shown in session details) ── */}
        {/* ── Right panel (counter) ───────────────────────────────────────────── */}
        <AnimatePresence>
          {countingPhase === "counting" && (
            <motion.div
              layout
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1, flex: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
            >
              {/* Panel header */}
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex flex-col gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-body">
                  <span className="text-text-muted">Room counting tool</span>
                  <span className="text-text-muted">/</span>
                  <span className="font-semibold text-text">Room counting</span>
                </div>
                <h3 className="text-xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>
                  Room counting
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Comments — collapsible */}
                <div className={cn("rounded-2xl border border-[#E2E8F0] overflow-hidden font-body", commentsExpanded ? "bg-white" : "bg-[#FFFCF8]")}>
                  <button
                    onClick={() => setCommentsExpanded((v) => !v)}
                    className="w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text font-body">Comments</p>
                      <p className="text-xs text-text-muted font-body mt-0.5">
                        Use this space to add comments for each room you visit, then submit them all at once.
                      </p>
                      {!commentsExpanded && roomComment.trim() && (
                        <p className="text-xs text-text-muted/80 italic font-body mt-1 truncate">
                          &ldquo;{roomComment}&rdquo;
                        </p>
                      )}
                    </div>
                    <ChevronDown size={18} className={cn("text-text-muted transition-transform shrink-0 mt-0.5", commentsExpanded && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {commentsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#F1F5F9] p-5 space-y-3">
                          <textarea
                            value={roomComment}
                            onChange={(e) => setRoomComment(e.target.value)}
                            placeholder="Describe any observations, issues, or notes"
                            rows={3}
                            className="w-full rounded-xl border border-[#E2E8F0] bg-surface-2 px-4 py-3 text-sm text-[#222B27] font-body placeholder:text-text-muted focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] transition-all resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="md"
                              className="px-7"
                              onClick={() => { setRoomComment(""); setCommentsExpanded(false); }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="md"
                              className="px-7"
                              disabled={!roomComment.trim()}
                              onClick={() => {
                                if (roomComment.trim()) {
                                  setRoomComments((prev) => ({
                                    ...prev,
                                    [selectedRoomId ?? "floor"]: roomComment.trim(),
                                  }));
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-center space-y-3">
                  {/* Room name + zone — one line, separated by a dash */}
                  <h3
                    className="text-lg font-extrabold text-text leading-none"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {selectedRoom?.name}
                    <span className="font-normal text-text-muted"> – {selectedZone ? selectedZone.name : "Unzoned room"} – {floor?.name}</span>
                  </h3>
                  <p
                    className="text-sm font-bold text-primary"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {roundLabel} · Day 1 of 14 · Room {rooms.findIndex((r) => r.id === selectedRoomId) + 1} of {rooms.length}
                  </p>
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-text-muted tracking-widest">
                      Current occupancy count
                    </p>
                    <div className="flex items-center justify-center gap-10">
                      <button
                        onClick={() => adjustCount(-1)}
                        className="w-20 h-20 rounded-2xl border-2 border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all"
                      >
                        <Minus size={28} strokeWidth={3} />
                      </button>
                      <span
                        className="text-8xl font-900 text-text tabular-nums"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 900 }}
                      >
                        {formatNumber(sessionCounts[selectedRoomId!] || 0)}
                      </span>
                      <button
                        onClick={() => adjustCount(1)}
                        className="w-20 h-20 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                      >
                        <Plus size={28} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  {/* Action button — above comments */}
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      className="w-auto px-10 h-12 text-base font-bold shadow-xl shadow-primary/20 gap-2"
                      onClick={handleRecordCount}
                      icon={!isLastRoom ? <ArrowRight size={18} /> : undefined}
                      iconPosition="right"
                    >
                      {isLastRoom ? "Done" : "Save count & continue"}
                    </Button>
                  </div>

                </div>

                {/* Counting history is available via the "Counting history" button in the header */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-emerald-500 animate-pulse" : "bg-[#E2E8F0]")} />
            <span className="text-[10px] font-bold text-text-muted tracking-wider">
              {isRecording ? "Session active" : "System ready"}
            </span>
          </div>
          <div className="text-[10px] text-text-muted font-bold">
            {roundLabel} · Day 1 of 14
          </div>
        </div>
        <div className="text-[10px] text-text-muted font-body">Areasim workspace intelligence</div>
      </footer>

      {/* ── Save comments modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSaveCommentsModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full relative"
            >
              <button
                onClick={() => setShowSaveCommentsModal(false)}
                className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="p-8 text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
                  <MessageSquare size={22} className="text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    Save your comments?
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    You have unsaved comments for this room. Would you like to save them before continuing?
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => handleSaveComments(false)}
                  >
                    No, discard
                  </Button>
                  <Button
                    size="md"
                    className="flex-1"
                    onClick={() => handleSaveComments(true)}
                  >
                    Yes, save
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ── Stop confirmation modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStopModal && (() => {
          const pendingCount = rooms.filter(
            (r) => (roomMeta[r.id]?.status ?? "pending") === "pending"
          ).length;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList size={18} className="text-primary" />
                    </div>
                    <h3 className="font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                      Finish session
                    </h3>
                  </div>
                  <button
                    onClick={() => { setShowStopModal(false); setPendingNav(null); }}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8 text-center space-y-5">
                  <div className="space-y-2">
                    <h4
                      className="text-xl font-800 text-text"
                      style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
                    >
                      Stop this session?
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Are you sure you want to stop this session? Once stopped, the data will be
                      locked and saved to the history.
                    </p>
                  </div>

                  {/* Pending rooms warning */}
                  {pendingCount > 0 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-left">
                      <Bell size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 font-body leading-relaxed">
                        <span className="font-bold">{pendingCount} room{pendingCount > 1 ? "s are" : " is"} still pending.</span>{" "}
                        You should count {pendingCount > 1 ? "these rooms" : "this room"} before ending the session.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onClick={() => { setShowStopModal(false); setPendingNav(null); }}
                    >
                      Not now
                    </Button>
                    <Button
                      size="md"
                      className="flex-1 shadow-lg shadow-primary/20"
                      onClick={confirmStopSession}
                    >
                      Yes, stop session
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── Got questions modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuestionsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-lg w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={18} className="text-primary" />
                  </div>
                  <h3 className="font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Got questions?
                  </h3>
                </div>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted tracking-wider">
                    Common Questions
                  </p>
                  <div className="divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] overflow-hidden">
                    {faqItems.map((item, i) => (
                      <div key={i} className="bg-[#F8FAFC]">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white transition-colors group"
                        >
                          <span className="text-sm font-medium text-text leading-snug">{item.q}</span>
                          <motion.div
                            animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown size={15} className={cn("transition-colors", expandedFaq === i ? "text-primary" : "text-text-muted")} />
                          </motion.div>
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0">
                                <p className="text-sm text-text-muted leading-relaxed border-t border-[#E2E8F0] pt-3">{item.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted tracking-wider">
                    Something else?
                  </p>
                  <textarea
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full h-24 rounded-xl border border-[#969696] bg-white text-[#222B27] font-body placeholder:text-[#98A1B2] px-5 py-3 text-sm transition-all duration-200 hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] focus:shadow-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setShowQuestionsModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      alert("Your questions have been sent to our consultants.");
                      setShowQuestionsModal(false);
                      setExpandedFaq(null);
                      setCustomQuestion("");
                    }}
                  >
                    Send to consultants
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Next floor modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNextFloorModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full relative"
            >
              <button
                onClick={() => setShowNextFloorModal(false)}
                className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="p-8 text-center space-y-5 relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
                  <Check size={22} className="text-emerald-600" strokeWidth={3} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    Continue to the next floor?
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    All rooms on this floor have been counted. Would you like to continue counting on another floor?
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-[#222B27] font-body">Select floor</label>
                  <div className="relative">
                    <select
                      value={nextFloorSelection}
                      onChange={(e) => setNextFloorSelection(e.target.value)}
                      className="appearance-none w-full h-9 rounded-xl border border-[#969696] bg-white text-[#222B27] pl-4 pr-9 text-xs font-medium focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200"
                    >
                      <option>1st Floor</option>
                      <option>2nd Floor</option>
                      <option>3rd Floor</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A1B2] pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      setShowNextFloorModal(false);
                      setIsRecording(false);
                      setCountingPhase("session");
                    }}
                  >
                    Stop counting
                  </Button>
                  <Button
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      const nextFloor = floors.find((f) => f.name === nextFloorSelection) || floors.find((f) => f.id !== floorId) || floors[0];
                      if (nextFloor) {
                        setActiveFloorId(nextFloor.id);
                        setSelectedFloorName(nextFloor.name || nextFloorSelection);
                        const firstRoom = nextFloor.rooms?.[0];
                        if (firstRoom) {
                          setSelectedRoomId(firstRoom.id);
                          setSessionCounts((prev) => ({ ...prev, [firstRoom.id]: 0 }));
                          setRoomMeta((prev) => ({ ...prev, [firstRoom.id]: { status: "ongoing", lockedBy: "You" } }));
                        }
                        setCountingPhase("counting");
                      }
                      setShowNextFloorModal(false);
                    }}
                  >
                    Continue counting
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
