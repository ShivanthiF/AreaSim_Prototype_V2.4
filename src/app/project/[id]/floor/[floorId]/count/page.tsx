"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  ChevronLeft,
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { useCanvasStore } from "@/store/canvas";
import { mockProject, mockCountHistory } from "@/lib/mockData";
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
type CountingPhase = "setup" | "ready" | "session";
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
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showVerifyConfirmModal, setShowVerifyConfirmModal] = useState(false);
  const [startModalDismissed, setStartModalDismissed] = useState(true);
  const [editRoomSettings, setEditRoomSettings] = useState(false);
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
  const startPromptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState(getFormattedDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return getFormattedDate(d);
  });

  const [activeSection, setActiveSection] = useState<"left" | "right">("left");
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
      setStartModalDismissed(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show instructions modal only when arriving via #show-instructions hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#show-instructions") {
      setShowInstructionsModal(true);
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

  // Clear the delayed start-session prompt timeout on unmount
  useEffect(() => () => { if (startPromptTimeoutRef.current) clearTimeout(startPromptTimeoutRef.current); }, []);

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
    setActiveSection("right");

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
      setActiveSection("left");
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

  const toggleSelectAll = () => {
    if (selectedRoomIds.size === rooms.length) {
      setSelectedRoomIds(new Set());
    } else {
      setSelectedRoomIds(new Set(rooms.map((r) => r.id)));
    }
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
      setStartModalDismissed(true);
    } else {
      // First-time setup via "Verify and continue" — prompt to start the session
      // after a short delay so the user first sees the session details.
      if (startPromptTimeoutRef.current) clearTimeout(startPromptTimeoutRef.current);
      startPromptTimeoutRef.current = setTimeout(() => setStartModalDismissed(false), 3000);
    }
  };

  const _allRoomsSetup = rooms.every((r) => roomCategories[r.id] && verifiedRooms.has(r.id));

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
            <div className="ml-auto">
              <Button
                size="sm"
                className="h-9 px-6 rounded-full shadow-md shadow-primary/20 font-bold"
                icon={<CheckCircle2 size={14} />}
                onClick={() => setShowVerifyConfirmModal(true)}
              >
                Verify and continue
              </Button>
            </div>
          </div>
        </header>

        {/* ── Workplace Journey Bar ── */}
        <WorkplaceJourneyBar activeStep="1-2" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div className="border-b border-[#F1F5F9] pt-6 sm:pt-8 pb-5 -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 px-6 sm:px-8 flex flex-col gap-3">
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

              {/* Description helper text */}
              <p className="text-sm text-text-muted">
                {editRoomSettings
                  ? "Update the room categories, areas, and capacities as needed."
                  : "Set the category and verify the number of seats for each room. This is a one-time setup."}
              </p>

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
                        <p className="text-[10px] font-bold text-text-muted">Add new</p>
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

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-11">
                        <button
                          onClick={toggleSelectAll}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedRoomIds.size === rooms.length && rooms.length > 0
                            ? "bg-primary border-primary"
                            : selectedRoomIds.size > 0
                              ? "bg-primary/30 border-primary"
                              : "border-[#C0D0DC] bg-white"
                            }`}
                          title="Select all rooms"
                        >
                          {selectedRoomIds.size > 0 && <Check size={11} className="text-white" strokeWidth={3} />}
                        </button>
                      </TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Seats</TableHead>
                      <TableHead className="text-center">Status</TableHead>
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
                          {/* Checkbox */}
                          <TableCell>
                            <button
                              onClick={() => toggleRoomSelect(room.id)}
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isChecked ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white hover:border-primary"
                                }`}
                            >
                              {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                            </button>
                          </TableCell>

                          {/* Room info */}
                          <TableCell>
                            <p className="text-sm text-text font-body">{room.name}</p>
                            <p className="text-xs text-text-muted font-body">{formatNumber(room.sqm || 25)} m²</p>
                          </TableCell>

                          {/* Category dropdown */}
                          <TableCell>
                            <div className="relative">
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
                            <div className="flex justify-center">
                              {isVerified ? (
                                <button
                                  onClick={() => setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(room.id); return n; })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold hover:bg-emerald-100 transition-all"
                                >
                                  <Check size={11} strokeWidth={3} /> Verified
                                </button>
                              ) : (
                                <button
                                  disabled={!cat}
                                  onClick={() => setVerifiedRooms((prev) => new Set([...prev, room.id]))}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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

        {/* ── Instructions Modal ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showInstructionsModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-[1180px]"
              >
                {/* Modal header */}
                <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-[#F1F5F9]">
                  <div>
                    <h2 className="text-xl font-extrabold text-text leading-tight" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                      How to use the room counting tool
                    </h2>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      Follow these steps to get accurate, consistent room data.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInstructionsModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-text-muted hover:text-text transition-colors shrink-0 ml-4"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Cards row */}
                <div className="px-6 py-6">
                  <div className="flex items-stretch gap-0">
                    {[
                      {
                        num: "01",
                        color: "#139485",
                        badgeBg: "rgba(19,148,133,0.12)",
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                            <path d="M15 38 C15 30 21 26 21 17 C21 13 18 10 15 10" stroke="#139485" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <circle cx="15" cy="10" r="3.5" stroke="#139485" strokeWidth="2.5" fill="none" />
                            <circle cx="31" cy="38" r="3.5" fill="#139485" />
                            <path d="M21 17 C21 26 27 30 27 38" stroke="#139485" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                          </svg>
                        ),
                        title: "Plan your route",
                        description: "Walk the floor room-by-room in a logical order.",
                        tip: "Keep the floor plan open while counting.",
                      },
                      {
                        num: "02",
                        color: "#3A6FB5",
                        badgeBg: "rgba(58,111,181,0.12)",
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                            <circle cx="23" cy="23" r="14" stroke="#3A6FB5" strokeWidth="2.5" />
                            <path d="M23 14 L23 23 L29 29" stroke="#3A6FB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                        title: "Count at the right time",
                        description: "Each round lasts 2 hours. There are 5 rounds per day (08:00–18:00).",
                        tip: "Only active sessions can be counted.",
                      },
                      {
                        num: "03",
                        color: "#E8820A",
                        badgeBg: "rgba(232,130,10,0.12)",
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                            <rect x="11" y="10" width="24" height="15" rx="4" stroke="#E8820A" strokeWidth="2.5" fill="none" />
                            <path d="M11 25 L11 37" stroke="#E8820A" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M35 25 L35 37" stroke="#E8820A" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M8 29 L38 29" stroke="#E8820A" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        ),
                        title: "Enter occupied seats",
                        description: "Count only occupied seats for each room and save your count.",
                        tip: "Save and continue to the next room.",
                      },
                      {
                        num: "04",
                        color: "#7C3AED",
                        badgeBg: "rgba(124,58,237,0.12)",
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                            <path d="M9 13 C9 11.3 10.3 10 12 10 L34 10 C35.7 10 37 11.3 37 13 L37 27 C37 28.7 35.7 30 34 30 L26 30 L19 37 L19 30 L12 30 C10.3 30 9 28.7 9 27 Z" stroke="#7C3AED" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                            <circle cx="18" cy="20" r="2.2" fill="#7C3AED" />
                            <circle cx="23" cy="20" r="2.2" fill="#7C3AED" />
                            <circle cx="28" cy="20" r="2.2" fill="#7C3AED" />
                          </svg>
                        ),
                        title: "Add notes if needed",
                        description: "Use notes to flag anything unusual, like blocked areas or special setups.",
                        tip: "Notes help ensure accurate analysis.",
                      },
                      {
                        num: "05",
                        color: "#0F9B6E",
                        badgeBg: "rgba(15,155,110,0.12)",
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                            <circle cx="23" cy="23" r="14" stroke="#0F9B6E" strokeWidth="2.5" />
                            <path d="M15 23 L20 28 L31 17" stroke="#0F9B6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                        title: "Finish the session",
                        description: "Verify all rooms before submitting. View the full history in the dashboard.",
                        tip: "You can always review or lock your session.",
                      },
                    ].map((step, i, arr) => (
                      <div key={step.title} className="flex items-stretch flex-1 min-w-0">
                        {/* Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex-1 min-w-0 bg-[#F9F6EF] rounded-2xl border border-[#E5EAF0] shadow-sm flex flex-col items-center text-center overflow-hidden h-full"
                        >
                          {/* Colored top stripe */}
                          <div className="w-full h-[3px] shrink-0" style={{ background: step.color }} />

                          {/* Number badge */}
                          <div className="mt-5 mb-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: step.badgeBg }}
                            >
                              <span className="text-sm font-extrabold" style={{ color: step.color, fontFamily: "var(--font-manrope)" }}>
                                {step.num}
                              </span>
                            </div>
                          </div>

                          {/* Icon */}
                          <div className="mb-3 flex items-center justify-center">{step.icon}</div>

                          {/* Title + description */}
                          <div className="px-4 mb-4 flex-1">
                            <h3 className="text-sm font-extrabold text-text mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
                              {step.title}
                            </h3>
                            <p className="text-[11.5px] text-text-muted leading-relaxed">{step.description}</p>
                          </div>

                          {/* Tip info box — pinned to bottom */}
                          <div className="mx-3 mb-5 rounded-xl bg-[#F5F7FA] border border-[#E5EAF0] px-3 py-2.5 flex items-start gap-2 text-left w-[calc(100%-24px)]">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-px">
                              <circle cx="7" cy="7" r="6" stroke="#B0BAC6" strokeWidth="1.2" />
                              <path d="M7 6.5v3.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
                              <circle cx="7" cy="4.5" r="0.75" fill="#94A3B8" />
                            </svg>
                            <p className="text-[10.5px] text-text-muted leading-relaxed">{step.tip}</p>
                          </div>
                        </motion.div>

                        {/* Arrow circle between cards */}
                        {i < arr.length - 1 && (
                          <div className="self-center flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E5EAF0] shadow-sm shrink-0 mx-2">
                            <ArrowRight size={13} style={{ color: "#9CA3AF" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-7 py-5 border-t border-[#F1F5F9] flex justify-center">
                  <Button
                    size="lg"
                    className="px-10 rounded-full shadow-md shadow-primary/20 font-bold"
                    onClick={() => setShowInstructionsModal(false)}
                  >
                    Got it! Start room counting
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
                      This will verify all the rooms in this sectioned floor. Are you sure you want to verify and continue?
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
              disabled={activeSection === "right"}
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
              ) : (
                <Button
                  size="sm"
                  onClick={handleStartSession}
                  className="gap-2 h-9 px-5"
                  icon={<Play size={14} />}
                >
                  Start counting session
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />

      <main className="flex-1 overflow-hidden flex relative p-6 gap-6 max-w-[1600px] mx-auto w-full">

        {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className={cn(
            "flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden",
            activeSection === "left" ? "flex-1 min-w-0" : "w-14 shrink-0 items-center"
          )}
        >
          {activeSection === "right" ? (
            <div className="flex flex-col items-center h-full pt-6 bg-white w-full">
              <button
                onClick={() => setActiveSection("left")}
                className="p-2.5 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-primary transition-all"
                title="Go to session details"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-start justify-between gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-body">
                    <span className="text-text-muted">Room counting tool</span>
                    <span className="text-text-muted">/</span>
                    <span className="font-semibold text-text">Session details</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>
                    Session details
                  </h3>
                </div>
                {isRecording && (
                  <Button
                    size="md"
                    icon={<Play size={14} />}
                    onClick={() => { if (!selectedRoomId && rooms[0]) setSelectedRoomId(rooms[0].id); setActiveSection("right"); }}
                  >
                    Start room counting
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

                {/* ── Room table ─────────────────────────────────────────────── */}
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
        {activeSection === "left" && (
          <div className="flex flex-col items-center h-full pt-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm w-14 shrink-0">
            <button
              onClick={() => { if (!selectedRoomId && rooms[0]) setSelectedRoomId(rooms[0].id); setActiveSection("right"); }}
              className="p-2.5 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-primary transition-all"
              title="Go to room counting"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}

        {/* ── Right panel (counter) ───────────────────────────────────────────── */}
        <AnimatePresence>
          {activeSection === "right" && (
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

                {/* Room history */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4
                      className="text-sm font-bold text-text"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      Counting history
                    </h4>
                    <button
                      className="text-xs font-semibold text-primary"
                      onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}
                    >
                      View all
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Round</TableHead>
                          <TableHead>No. of seats</TableHead>
                          <TableHead>Count</TableHead>
                          <TableHead className="text-right">By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(selectedRoom?.countHistory.length
                          ? selectedRoom.countHistory
                          : mockCountHistory
                        )
                          .slice(0, 5)
                          .map((entry, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-text whitespace-nowrap">{entry.date}</TableCell>
                              <TableCell className="whitespace-nowrap">{entry.time}</TableCell>
                              <TableCell className="whitespace-nowrap">Round {i + 1}</TableCell>
                              <TableCell className="tabular-nums">{roomSeats[selectedRoomId!] || 0}</TableCell>
                              <TableCell className="text-text tabular-nums">{formatNumber(entry.count)}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">{entry.by}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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

      {/* ── Start session modal (shown when phase="ready") ─────────────────────── */}
      <AnimatePresence>
        {countingPhase === "ready" && !startModalDismissed && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full relative"
            >
              <button
                onClick={() => setStartModalDismissed(true)}
                className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="p-8 text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Play size={20} fill="currentColor" className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    Start counting session?
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Rooms are set up for <span className="font-bold text-text">{floor?.name || "this floor"}</span>. Start the session to begin recording occupancy counts.
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStartModalDismissed(true)}>
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    className="flex-1"
                    onClick={() => { setStartModalDismissed(true); handleStartSession(); }}
                  >
                    Start
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
                      setActiveSection("left");
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
                        setActiveSection("right");
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
