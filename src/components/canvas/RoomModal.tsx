"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCanvasStore } from "@/store/canvas";
import { Room } from "@/lib/mockData";

interface RoomModalProps {
  room: Room;
  floorId: string;
  onClose: () => void;
  onViewDetails?: () => void;
}

/** Centered modal that appears after drawing a room rectangle. */
export function RoomModal({ room, floorId, onClose }: RoomModalProps) {
  const { updateRoom, deleteRoom } = useCanvasStore();
  const [type, setType] = useState<"room" | "zone">("room");
  const [formData, setFormData] = useState({
    name: room.name,
    sqm: room.sqm || 0,
    category: room.category || "Meeting Room",
    seats: room.seats || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerify = () => {
    updateRoom(floorId, room.id, {
      ...formData,
      verified: true,
      status: "unvisited",
    });
    onClose();
  };

  // keep deleteRoom available for external use but not shown in UI
  void deleteRoom;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0A1929]/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-sm rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
            {type === "room" ? "New room" : "New zone"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Room / Zone toggle */}
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#E0F2F2" }}>
            {(["room", "zone"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${type === t
                  ? "bg-white shadow-sm text-primary border border-border"
                  : "text-text-muted hover:text-text"
                  }`}
              >
                {t === "room" ? "This is a room" : "This is a zone"}
              </button>
            ))}
          </div>

          {/* Name */}
          <Input
            label={type === "room" ? "Room Name" : "Zone Name"}
            fieldSize="sm"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          {/* Sqm + Seats */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Square Meters"
              fieldSize="sm"
              type="number"
              value={String(formData.sqm)}
              onChange={(e) => handleChange("sqm", parseInt(e.target.value) || 0)}
            />
            <Input
              label="No. of Seats"
              fieldSize="sm"
              type="number"
              value={String(formData.seats)}
              onChange={(e) => handleChange("seats", parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#222B27] font-body">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full h-9 rounded-xl border border-[#969696] bg-white px-4 text-xs text-[#222B27] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] hover:border-[#999999] transition-all appearance-none"
            >
              <option>Meeting Room</option>
              <option>Open Office</option>
              <option>Break Room</option>
              <option>Reception</option>
              <option>Focus Pod</option>
            </select>
          </div>
        </div>

        {/* Footer: Cancel + Verify both right-aligned */}
        <div className="flex items-center justify-end gap-3 px-5 pb-5 pt-1">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-text-muted hover:text-text transition-colors px-2 py-1.5"
          >
            Cancel
          </button>
          <Button
            size="md"
            onClick={handleVerify}
          >
            Verify
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
