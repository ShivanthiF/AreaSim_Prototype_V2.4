"use client";

import {
  useEffect, useRef, useState, useCallback, useMemo
} from "react";
import { Stage, Layer, Image as KImage, Line, Text, Group, Rect, Transformer } from "react-konva";
import Konva from "konva";
import { AnimatePresence, motion } from "framer-motion";
import {
  ZoomIn, ZoomOut, Undo2, Redo2,
  MousePointer2, PenLine, Group as GroupIcon, Eraser,
  HelpCircle, Upload, X,
} from "lucide-react";
import { useCanvasStore } from "@/store/canvas";
import { Room, ZONE_COLORS } from "@/lib/mockData";
import { RoomModal } from "./RoomModal";
import { guideStepAboveToolbar } from "./GuideOverlay";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import useImage from "use-image";
import { cn } from "@/lib/utils";

const FILL_COLORS = {
  unvisited: "rgba(10,79,110,0.18)",
  counting: "rgba(245,158,11,0.18)",
  counted: "rgba(0,201,167,0.20)",
};
const STROKE_COLORS = {
  unvisited: "rgba(10,79,110,0.6)",
  counting: "rgba(245,158,11,0.7)",
  counted: "rgba(0,201,167,0.8)",
};

type Tool = "select" | "pen" | "group" | "eraser";

const TOOLS: { id: Tool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pen", icon: PenLine, label: "Pen", shortcut: "P" },
  { id: "group", icon: GroupIcon, label: "Group", shortcut: "G" },
  { id: "eraser", icon: Eraser, label: "Erase", shortcut: "E" },
];

interface FloorCanvasProps {
  floorId: string;
  imageUrl: string;
  showGuide?: boolean;
  guideStep?: number;
  onOpenGuide?: () => void;
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function FloorCanvas({ floorId, imageUrl, showGuide = false, guideStep = 0, onOpenGuide }: FloorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImageRef = useRef<Konva.Image>(null);
  const bgTransformerRef = useRef<Konva.Transformer>(null);
  const { width, height } = useContainerSize(containerRef as React.RefObject<HTMLDivElement>);

  const {
    activeTool, getRoomsForFloor, getZonesForFloor,
    addRoom, deleteRoom, addZone,
    selectedRoomIds, toggleRoomSelection, clearSelection,
    setTool, updateRoomPoints,
  } = useCanvasStore();

  const rooms = getRoomsForFloor(floorId);
  const zones = getZonesForFloor(floorId);

  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const activeImageUrl = customImageUrl ?? imageUrl;
  const [bgImage] = useImage(activeImageUrl);

  // Image resize state (world coordinates; null = auto-fit)
  const [customImgBounds, setCustomImgBounds] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [bgImgSelected, setBgImgSelected] = useState(false);

  // Reset custom bounds when the source image changes
  const prevActiveImageUrl = useRef(activeImageUrl);
  useEffect(() => {
    if (activeImageUrl !== prevActiveImageUrl.current) {
      setCustomImgBounds(null);
      setBgImgSelected(false);
      prevActiveImageUrl.current = activeImageUrl;
    }
  }, [activeImageUrl]);

  // Attach / detach Transformer
  useEffect(() => {
    const tr = bgTransformerRef.current;
    const img = bgImageRef.current;
    if (!tr) return;
    if (bgImgSelected && img) {
      tr.nodes([img]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [bgImgSelected]);

  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pendingRoom, setPendingRoom] = useState<Room | null>(null);
  const [_pendingRoomPos, setPendingRoomPos] = useState({ x: 0, y: 0 });
  const [historyIdx, setHistoryIdx] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [showGroupBar, setShowGroupBar] = useState(false);
  const [uploadHint, setUploadHint] = useState(false);

  useEffect(() => {
    setShowGroupBar(activeTool === "group" && selectedRoomIds.length >= 2);
  }, [activeTool, selectedRoomIds]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _pushHistory = useCallback(() => setHistoryIdx((i) => i + 1), []);

  const undo = () => {
    if (historyIdx <= 0) return;
    setHistoryIdx((i) => i - 1);
  };

  // Auto-fit image bounds (screen pixels)
  const autoFitBounds = useMemo(() => {
    if (!bgImage || !width || !height) return { x: 0, y: 0, w: width || 800, h: height || 600 };
    // Cover: scale so the image fills the full canvas (may overflow one axis)
    const ratio = Math.max(width / bgImage.width, height / bgImage.height);
    const w = bgImage.width * ratio;
    const h = bgImage.height * ratio;
    return { x: (width - w) / 2, y: (height - h) / 2, w, h };
  }, [bgImage, width, height]);

  // Effective bounds (world coordinates)
  const eff = customImgBounds ?? autoFitBounds;

  const getPointerPos = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    return {
      x: (pos.x - offset.x) / scale,
      y: (pos.y - offset.y) / scale,
    };
  };

  const handleCanvasMouseDown = () => {
    setBgImgSelected(false);
    if (activeTool !== "pen") return;
    const pos = getPointerPos();
    setDrawStart(pos);
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = () => {
    const pos = getPointerPos();
    setMousePos(pos);
  };

  const handleCanvasMouseUp = () => {
    if (activeTool !== "pen" || !drawStart) return;
    const end = mousePos;
    if (Math.abs(end.x - drawStart.x) < 20 || Math.abs(end.y - drawStart.y) < 20) {
      setDrawStart(null);
      setIsDrawing(false);
      return;
    }
    finishRect(drawStart, end);
  };

  const handleCanvasClick = () => { /* handled by mousedown/up */ };
  const handleCanvasDblClick = () => { /* unused */ };

  const finishRect = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    const rectPoints = [x1, y1, x2, y1, x2, y2, x1, y2];
    const id = `room-${Date.now()}`;
    const newRoom: Room = {
      id,
      name: `Room ${rooms.length + 1}`,
      points: rectPoints,
      status: "unvisited",
      countHistory: [],
      currentCount: 0,
      sqm: 0,
      verified: false,
    };
    addRoom(floorId, newRoom);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    setPendingRoom(newRoom);
    setPendingRoomPos({ x: cx * scale + offset.x, y: cy * scale + offset.y });
    setDrawStart(null);
    setIsDrawing(false);
    setTool("select");
  };

  const handleRoomClick = (room: Room) => {
    if (activeTool === "eraser") { deleteRoom(floorId, room.id); return; }
    if (activeTool === "group" || activeTool === "select") {
      toggleRoomSelection(room.id);
      if (activeTool === "select" && !selectedRoomIds.includes(room.id)) {
        setPendingRoom(room);
        const xs = room.points.filter((_, i) => i % 2 === 0);
        const ys = room.points.filter((_, i) => i % 2 !== 0);
        const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
        const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
        setPendingRoomPos({ x: cx * scale + offset.x, y: cy * scale + offset.y });
      }
    }
  };

  const handleGroupZone = () => {
    if (selectedRoomIds.length < 2 || !groupName.trim()) return;
    const zoneId = `zone-${Date.now()}`;
    const color = ZONE_COLORS[zones.length % ZONE_COLORS.length];
    addZone(floorId, { id: zoneId, name: groupName.trim(), roomIds: selectedRoomIds, color });
    clearSelection();
    setGroupName("");
  };

  const zoom = (delta: number) => setScale((s) => Math.min(4, Math.max(0.3, s + delta)));
  const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setCustomImageUrl(url);
      setUploadHint(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getCursor = () => {
    if (activeTool === "pen") return "crosshair";
    if (activeTool === "eraser") return "cell";
    return "default";
  };

  const toolbarGlowing = showGuide && guideStepAboveToolbar(guideStep);

  return (
    <div className="relative flex flex-col h-full bg-surface-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={handleUpload}
      />

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ cursor: getCursor() }}>
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          x={offset.x}
          y={offset.y}
          onClick={handleCanvasClick}
          onDblClick={handleCanvasDblClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
        >
          <Layer>
            {/* Floor plan image — draggable + resizable */}
            {bgImage && (
              <KImage
                ref={bgImageRef}
                image={bgImage}
                x={eff.x}
                y={eff.y}
                width={eff.w}
                height={eff.h}
                draggable={activeTool === "select"}
                onClick={(e) => { e.cancelBubble = true; if (activeTool === "select") setBgImgSelected(true); }}
                onDragEnd={(e) => {
                  setCustomImgBounds({ x: e.target.x(), y: e.target.y(), w: eff.w, h: eff.h });
                }}
                onTransformEnd={() => {
                  const node = bgImageRef.current;
                  if (!node) return;
                  const newW = node.width() * node.scaleX();
                  const newH = node.height() * node.scaleY();
                  setCustomImgBounds({ x: node.x(), y: node.y(), w: newW, h: newH });
                  node.scaleX(1);
                  node.scaleY(1);
                  node.width(newW);
                  node.height(newH);
                }}
              />
            )}

            {/* Existing rooms */}
            {rooms.map((room) => {
              if (room.points.length === 0) return null;
              const pts = room.points;
              const isSelected = selectedRoomIds.includes(room.id);
              const xs = pts.filter((_, i) => i % 2 === 0);
              const ys = pts.filter((_, i) => i % 2 !== 0);
              const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
              const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
              return (
                <Group
                  key={room.id}
                  draggable={activeTool === "select"}
                  onClick={() => handleRoomClick(room)}
                  onDragEnd={(e) => {
                    const dx = e.target.x();
                    const dy = e.target.y();
                    updateRoomPoints(floorId, room.id, dx, dy);
                    e.target.position({ x: 0, y: 0 });
                  }}
                >
                  <Line
                    points={pts}
                    closed
                    fill={isSelected ? "rgba(0,201,167,0.25)" : FILL_COLORS[room.status]}
                    stroke={isSelected ? "#00C9A7" : STROKE_COLORS[room.status]}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    listening
                  />
                  <Text
                    x={cx - 50} y={cy - 8}
                    width={100}
                    text={room.name}
                    align="center"
                    fontSize={11}
                    fill={isSelected ? "#0F7663" : "#0A4F6E"}
                    fontFamily="var(--font-manrope)"
                    fontStyle="600"
                    listening={false}
                  />
                  {room.status === "counted" && (
                    <Text
                      x={cx - 20} y={cy + 8}
                      width={40}
                      text={`${room.currentCount}`}
                      align="center"
                      fontSize={13}
                      fill="#0F7663"
                      fontFamily="var(--font-jetbrains-mono)"
                      fontStyle="bold"
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}

            {/* Zone dashed boundaries */}
            {zones.map((zone) => {
              const zoneRooms = rooms.filter((r) => zone.roomIds.includes(r.id));
              if (!zoneRooms.length) return null;
              const allPts = zoneRooms.flatMap((r) => r.points);
              const allX = allPts.filter((_, i) => i % 2 === 0);
              const allY = allPts.filter((_, i) => i % 2 !== 0);
              const minX = Math.min(...allX) - 12;
              const minY = Math.min(...allY) - 12;
              const maxX = Math.max(...allX) + 12;
              const maxY = Math.max(...allY) + 12;
              return (
                <Group key={zone.id}>
                  <Rect
                    x={minX} y={minY}
                    width={maxX - minX} height={maxY - minY}
                    fill="transparent"
                    stroke={zone.color}
                    strokeWidth={2}
                    dash={[8, 5]}
                    cornerRadius={8}
                    listening={false}
                  />
                  <Text
                    x={minX + 8} y={minY + 6}
                    text={zone.name}
                    fontSize={11}
                    fill={zone.color}
                    fontFamily="var(--font-manrope)"
                    fontStyle="600"
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Live rectangle preview while drawing */}
            {isDrawing && drawStart && (
              <Rect
                x={Math.min(drawStart.x, mousePos.x)}
                y={Math.min(drawStart.y, mousePos.y)}
                width={Math.abs(mousePos.x - drawStart.x)}
                height={Math.abs(mousePos.y - drawStart.y)}
                fill="rgba(10,79,110,0.12)"
                stroke="#0A4F6E"
                strokeWidth={1.5}
                dash={[5, 4]}
                cornerRadius={3}
                listening={false}
              />
            )}

            {/* Image resize transformer */}
            <Transformer
              ref={bgTransformerRef}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 60 || newBox.height < 60 ? oldBox : newBox
              }
            />
          </Layer>
        </Stage>

        {/* Room modal — centered overlay */}
        <AnimatePresence>
          {pendingRoom && (
            <RoomModal
              room={pendingRoom}
              floorId={floorId}
              onClose={() => setPendingRoom(null)}
            />
          )}
        </AnimatePresence>

        {/* Pen tool hint */}
        {activeTool === "pen" && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          >
            <div className="rounded-full bg-primary/90 text-white text-xs font-body px-4 py-1.5 shadow-lg">
              Click and drag to draw a room
            </div>
          </motion.div>
        )}

        {/* Group zone modal */}
        <AnimatePresence>
          {showGroupBar && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0A1929]/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full max-w-sm rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                  <h3 className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Create zone
                  </h3>
                  <button
                    onClick={clearSelection}
                    className="p-1 text-text-muted hover:text-text transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-text-muted font-body">
                    {selectedRoomIds.length} room{selectedRoomIds.length !== 1 ? "s" : ""} selected. Give this zone a name to group them together.
                  </p>
                  <Input
                    label="Zone Name"
                    fieldSize="sm"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Marketing wing"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 pb-5 pt-1">
                  <button
                    onClick={clearSelection}
                    className="text-xs font-semibold text-text-muted hover:text-text transition-colors px-2 py-1.5"
                  >
                    Cancel
                  </button>
                  <Button
                    size="md"
                    onClick={handleGroupZone}
                    disabled={!groupName.trim()}
                  >
                    Group as Zone
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Upload hint tooltip */}
        <AnimatePresence>
          {uploadHint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <div className="rounded-xl bg-[#0D1B2A]/90 text-white text-xs font-body px-4 py-2 shadow-xl text-center">
                Click the <strong>Upload</strong> button to use your own floor plan image
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating Toolbar ─────────────────────────────── */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-2xl border border-border shadow-2xl shadow-black/15 px-2 py-1.5"
          style={{ background: "#FFFFFF" }}
          animate={toolbarGlowing
            ? { boxShadow: ["0 4px 24px rgba(251,146,60,0)", "0 4px 24px rgba(251,146,60,0.45)", "0 4px 24px rgba(251,146,60,0)"] }
            : { boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }
          }
          transition={{ duration: 1.8, repeat: toolbarGlowing ? Infinity : 0 }}
        >
          {/* Tools */}
          {TOOLS.map(({ id, icon: Icon, label, shortcut }) => {
            const active = activeTool === id;
            const isHighlighted = showGuide && (
              (guideStep === 1 && id === "pen") ||
              (guideStep === 2 && id === "group")
            );
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setTool(id)}
                title={`${label} (${shortcut})`}
                className={cn(
                  "group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                <Icon size={17} />
                {/* Pulse ring for guide highlight */}
                {isHighlighted && (
                  <motion.span
                    className="absolute inset-0 rounded-xl border-2 border-[#FB923C] pointer-events-none"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2 py-1 text-xs font-body text-text shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {label}
                  <span className="ml-1.5 text-text-muted font-mono">{shortcut}</span>
                </div>
              </motion.button>
            );
          })}

          <div className="w-px h-6 bg-border mx-1" />

          <button onClick={() => zoom(-0.15)} title="Zoom out"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <ZoomOut size={15} />
          </button>

          <button onClick={resetZoom} title="Reset zoom"
            className="h-9 px-2 rounded-xl flex items-center justify-center text-xs font-mono text-text-muted hover:text-text hover:bg-surface-2 transition-all min-w-[44px]"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            {Math.round(scale * 100)}%
          </button>

          <button onClick={() => zoom(0.15)} title="Zoom in"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <ZoomIn size={15} />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <button onClick={undo} title="Undo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <Undo2 size={15} />
          </button>

          <button title="Redo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <Redo2 size={15} />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setUploadHint(true)}
            onMouseLeave={() => setUploadHint(false)}
            title="Upload floor plan"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all"
          >
            <Upload size={15} />
          </motion.button>

          <button
            onClick={() => onOpenGuide?.()}
            title="Open guide"
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              showGuide ? "text-[#FB923C] bg-[#FFF7ED]" : "text-text-muted hover:text-text hover:bg-surface-2"
            )}
          >
            <HelpCircle size={15} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
