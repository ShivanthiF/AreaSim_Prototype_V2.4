"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, CheckCircle2,
  Sparkles, Trash2, ChevronDown, Check,
  Layers, Pencil, FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCanvasStore } from "@/store/canvas";
import { IllustrationDrawRoom } from "@/components/canvas/IllustrationDrawRoom";
import { Logo } from "@/components/ui/Logo";
import { cn, formatNumber } from "@/lib/utils";
import type { Room, Zone } from "@/lib/mockData";
import { ZONE_COLORS } from "@/lib/mockData";

interface DetailPanelProps {
  floorId: string;
  guideHighlightFirstRoom?: boolean;
}


export function DetailPanel({ floorId: _initialFloorId, guideHighlightFirstRoom = false }: DetailPanelProps) {

  const {
    detailPanelOpen, setDetailPanel,
    floors, getRoomsForFloor, getZonesForFloor,
    addFloor, addRoom, setTool, addZone, deleteRoom,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState(_initialFloorId);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [panelTab, setPanelTab] = useState<"rooms" | "zones">("rooms");

  // Group mode
  const [groupMode, setGroupMode] = useState(false);
  const [selectedForGroup, setSelectedForGroup] = useState<string[]>([]);
  const [groupZoneName, setGroupZoneName] = useState("");

  const floor = floors.find((f) => f.id === activeTab) ?? floors[0];
  const rooms = getRoomsForFloor(floor?.id ?? "");
  const zones = getZonesForFloor(floor?.id ?? "");

  const _handleAddFloor = () => {
    const newFloor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${floors.length + 1}`,
      level: `${floors.length}`,
      imageUrl: "/mock/floorplan-oslo.jpg",
      rooms: [],
      zones: [],
      detectedRooms: [],
    };
    addFloor(newFloor);
    setActiveTab(newFloor.id);
  };

  const handleCreateZone = () => {
    if (selectedForGroup.length < 1 || !groupZoneName.trim() || !floor) return;
    const zoneId = `zone-${Date.now()}`;
    const color = ZONE_COLORS[zones.length % ZONE_COLORS.length];
    addZone(floor.id, {
      id: zoneId,
      name: groupZoneName.trim(),
      roomIds: selectedForGroup,
      color,
    });
    setGroupMode(false);
    setSelectedForGroup([]);
    setGroupZoneName("");
    setPanelTab("zones");
  };

  if (!detailPanelOpen) return null;

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-0 top-0 h-full flex flex-col border-l border-[#E5EAF0] overflow-hidden shadow-2xl z-40"
      style={{ width: "33.333%", minWidth: "280px", maxWidth: "460px", background: "#FFFFFF" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5EAF0] shrink-0" style={{ background: "#FFFFFF" }}>
        <div>
          <p className="text-[10px] text-[#8CA3B0] tracking-wider font-body mb-0.5">Floor</p>
          <h2
            className="text-sm font-extrabold text-[#0D1B2A] font-display leading-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {floor?.name ?? "Select Floor"}
          </h2>
        </div>
        <button
          onClick={() => setDetailPanel(false)}
          className="p-1.5 text-[#5C7A8A] hover:text-[#0D1B2A] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Rooms / Zones Tabs */}
      <div className="flex items-center border-b border-[#E5EAF0] shrink-0 px-4 pt-3 gap-4" style={{ background: "#FFFFFF" }}>
        {(["rooms", "zones"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setPanelTab(tab); setGroupMode(false); setSelectedForGroup([]); }}
            className={cn(
              "pb-2.5 text-sm font-semibold capitalize transition-colors border-b-2",
              panelTab === tab
                ? "text-primary border-primary"
                : "text-text-muted border-transparent hover:text-text"
            )}
          >
            {tab}
            <span className="ml-1.5 text-[10px] font-mono rounded-full px-1.5 py-0.5 bg-surface-2 text-text-muted">
              {tab === "rooms" ? rooms.length : zones.length}
            </span>
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* ══ ROOMS TAB ══ */}
        {panelTab === "rooms" && (
          <div className="px-4 pt-4 pb-2">

            {/* Group mode banner */}
            <AnimatePresence>
              {groupMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 overflow-hidden"
                >
                  <div className="rounded-2xl border border-border bg-white shadow-sm p-4 space-y-3">
                    <p className="text-xs font-semibold text-primary">
                      Select rooms to group ({selectedForGroup.length} selected)
                    </p>
                    <Input
                      fieldSize="sm"
                      label="Zone name"
                      value={groupZoneName}
                      onChange={(e) => setGroupZoneName(e.target.value)}
                      placeholder="Zone name…"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setGroupMode(false); setSelectedForGroup([]); setGroupZoneName(""); }}
                        className="text-xs font-semibold text-text-muted hover:text-text transition-colors px-2 py-1"
                      >
                        Cancel
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreateZone}
                        disabled={selectedForGroup.length < 1 || !groupZoneName.trim()}
                      >
                        Create Zone
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(zones.length > 0 || rooms.length > 0) && (
              <>
                {/* Create zone — shown only when not in group mode */}
                {!groupMode && (
                  <div className="mb-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<FolderPlus size={13} />}
                      onClick={() => { setGroupMode(true); setSelectedForGroup([]); setGroupZoneName(""); }}
                    >
                      Create zone
                    </Button>
                    <p className="text-[11px] text-text-muted font-body mt-2 mb-0 leading-relaxed">
                      Select one or more rooms to create zones
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-[#E5EAF0] overflow-hidden">
                  {rooms.map((room, idx) => (
                    <RoomRow
                      key={room.id}
                      room={room}
                      forceHighlight={guideHighlightFirstRoom && idx === 0}
                      groupMode={groupMode}
                      selectedForGroup={selectedForGroup}
                      onToggleGroupSelect={(id) =>
                        setSelectedForGroup((prev) =>
                          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                        )
                      }
                      onVerify={() => {
                        setShowVerifyModal(true);
                        setTool("pen");
                      }}
                      onDelete={() => deleteRoom(floor.id, room.id)}
                      onUpdate={(data) => {
                        useCanvasStore.getState().updateRoom(floor.id, room.id, data);
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newRoom: Room = {
                      id: `room-${Date.now()}`,
                      name: "New Room",
                      points: [],
                      status: "unvisited",
                      countHistory: [],
                      currentCount: 0,
                      sqm: 0,
                    };
                    addRoom(floor.id, newRoom);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-[#FDFBF7] py-3 text-sm text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/[0.02] transition-all font-body group"
                >
                  <Plus size={15} className="group-hover:scale-110 transition-transform" /> Add room
                </button>
              </>
            )}

            {rooms.length === 0 && zones.length === 0 && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F6FB] flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} className="text-[#A0B3BE]" />
                </div>
                <p className="text-sm font-semibold text-[#0D1B2A] mb-1">No rooms yet</p>
                <p className="text-xs text-[#8CA3B0] leading-relaxed">
                  Use the Draw tool in the canvas to draw rooms.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══ ZONES TAB ══ */}
        {panelTab === "zones" && (
          <div className="px-4 pt-4 pb-2">
            {zones.length > 0 ? (
              <div className="space-y-2">
                {zones.map((zone) => (
                  <ZoneRow key={zone.id} zone={zone} rooms={rooms} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F6FB] flex items-center justify-center mx-auto mb-3">
                  <Layers size={20} className="text-[#A0B3BE]" />
                </div>
                <p className="text-sm font-semibold text-[#0D1B2A] mb-1">No zones yet</p>
                <p className="text-xs text-[#8CA3B0] leading-relaxed">
                  Group rooms in the Rooms tab to create zones.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="h-16" />
      </div>

      {/* Verification Guidance Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5EAF0]">
                <Logo size="md" />
                <button onClick={() => setShowVerifyModal(false)} className="text-[#5C7A8A] hover:text-[#0D1B2A]">
                  <X size={18} />
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-[#D0DDE6] h-44 flex items-center justify-center p-6">
                <IllustrationDrawRoom />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0D1B2A] mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
                  Verify with Draw tool
                </h3>
                <p className="text-sm text-[#5C7A8A] font-body leading-relaxed mb-6">
                  To verify this room on the floor plan, pick the{" "}
                  <span className="font-bold text-primary">Draw</span> tool from the toolbar and trace the room boundaries.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowVerifyModal(false)}
                    className="text-xs font-semibold text-text-muted hover:text-text transition-colors px-2 py-1.5"
                  >
                    Cancel
                  </button>
                  <Button size="md" onClick={() => setShowVerifyModal(false)}>
                    Got it, I&apos;ll draw it
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

// ─── Room row ─────────────────────────────────────────────────────────────────
function RoomRow({
  room,
  groupMode,
  selectedForGroup,
  onToggleGroupSelect,
  onVerify,
  onDelete,
  onUpdate,
  forceHighlight = false,
}: {
  room: Room;
  groupMode: boolean;
  selectedForGroup: string[];
  onToggleGroupSelect: (id: string) => void;
  onVerify: () => void;
  onDelete: () => void;
  onUpdate: (data: Partial<Room>) => void;
  forceHighlight?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(room.name);
  const [expanded, _setExpanded] = useState(false);

  const handleRename = () => {
    if (tempName.trim()) onUpdate({ name: tempName.trim() });
    setIsEditing(false);
  };

  const isGroupSelected = selectedForGroup.includes(room.id);

  return (
    <div className={cn("border-b border-[#F0F4F8] last:border-0 transition-colors", forceHighlight ? "bg-[#FBF6EE]" : "bg-transparent hover:bg-[#FBF6EE]")}>
      <div className="flex items-center justify-between px-3 py-2.5 group">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {groupMode ? (
            <button
              onClick={() => onToggleGroupSelect(room.id)}
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                isGroupSelected
                  ? "bg-primary border-primary"
                  : "border-[#C8D8E4] hover:border-primary"
              )}
            >
              {isGroupSelected && <Check size={10} className="text-white" strokeWidth={3} />}
            </button>
          ) : null}

          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="text-xs text-[#374151] font-body bg-[#F0F6FB] border border-primary/20 rounded px-1 outline-none w-full"
            />
          ) : (
            <span className="text-xs text-[#374151] font-bold font-body truncate">{room.name}</span>
          )}
        </div>

        {!groupMode && (
          <div className={cn(
            "flex items-center gap-1 transition-opacity",
            room.verified ? "opacity-100" : (forceHighlight ? "opacity-100" : "opacity-0 group-hover:opacity-100")
          )}>
            {room.verified ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-accent-text text-[10px] font-bold">
                <CheckCircle2 size={11} /> Verified
              </div>
            ) : (
              <>
                <button
                  onClick={onVerify}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-all text-[10px] font-bold"
                >
                  <Pencil size={11} /> Verify
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-all text-[10px] font-bold"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {room.status === "counted" && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {(() => {
              const hash = room.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
              const roomTypes = ["Meeting Room", "Open Office", "Break Room", "Focus Room", "Reception", "Storage"];
              const roomType = roomTypes[hash % roomTypes.length];
              const seats = 2 + (hash % 12);
              const todayCount = 1 + (hash % 4);
              const totalCount = todayCount + (hash % 10) + 2;
              const avgCapacity = Math.round(seats * (0.5 + (hash % 4) * 0.1));

              return (
                <div className="mx-3 mb-2.5 rounded-xl bg-[#F0F6FB] border border-[#DAEAF5] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Type</span>
                    <span className="text-[10px] font-semibold text-[#0D1B2A] bg-[#DBEAFE] text-primary px-2 py-0.5 rounded-full font-body">{roomType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Seats</span>
                    <span className="text-[10px] font-extrabold text-[#374151] font-mono" style={{ fontFamily: "var(--font-manrope)" }}>{seats}</span>
                  </div>
                  <div className="h-px bg-[#DAEAF5]" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white border border-[#E5EAF0] p-2 text-center">
                      <p className="text-[13px] font-extrabold text-[#1A7FA8]" style={{ fontFamily: "var(--font-manrope)" }}>{formatNumber(todayCount)}×</p>
                      <p className="text-[9px] text-[#8CA3B0] font-body">Today</p>
                    </div>
                    <div className="rounded-lg bg-white border border-[#E5EAF0] p-2 text-center">
                      <p className="text-[13px] font-extrabold text-[#0A4F6E]" style={{ fontFamily: "var(--font-manrope)" }}>{formatNumber(totalCount)}×</p>
                      <p className="text-[9px] text-[#8CA3B0] font-body">Overall</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Avg capacity</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 rounded-full bg-[#E5EAF0] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#1A7FA8] to-[#00C9A7]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((avgCapacity / seats) * 100)}%` }}
                          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#374151] font-mono" style={{ fontFamily: "var(--font-manrope)" }}>{formatNumber(avgCapacity)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Zone row with expand/collapse ────────────────────────────────────────────
function ZoneRow({ zone, rooms }: { zone: Zone; rooms: Room[] }) {
  const [expanded, setExpanded] = useState(false);
  const zoneRooms = rooms.filter((r) => zone.roomIds.includes(r.id));

  return (
    <div className="rounded-xl border border-[#E5EAF0] overflow-hidden" style={{ background: "#FFFFFF" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-3 hover:bg-[#F7F9FC] transition-colors group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
          <span className="text-xs font-bold text-[#0D1B2A] font-body truncate">{zone.name}</span>
          <span className="text-[10px] font-mono text-[#8CA3B0] shrink-0">
            {zoneRooms.length} room{zoneRooms.length !== 1 ? "s" : ""}
          </span>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-[#8CA3B0] group-hover:text-[#0D1B2A] transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#F0F4F8]">
              {zoneRooms.length > 0 ? (
                zoneRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-2 px-4 py-2 border-b border-[#F0F4F8] last:border-0 bg-[#F8FAFC]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                    <span className="text-xs text-[#374151] font-body truncate">{room.name}</span>
                    {room.status === "counted" && (
                      <CheckCircle2 size={11} className="text-accent ml-auto shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <p className="px-4 py-3 text-xs text-[#8CA3B0] font-body">No rooms in this zone yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
