"use client";

import { useState } from "react";
import {
  Plus, Trash2, Upload, Check, X,
  ArrowLeft, ArrowRight, GripVertical,
  Building2, ShoppingCart, Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useOnboardingStore, Floor } from "@/store/onboarding";

// ─── Consultant contact data (no photos) ──────────────────────────────────────
const CONSULTANTS = [
  {
    name: "Håvard Røyne",
    title: "CEO & Partner",
    bio: "Extensive management and project leadership experience from Gjensidige NOR, OBOS Basale, Aberdeen Standard Investment, and Statsbygg.",
    phone: "+47 90 09 01 70",
    email: "havard@areasim.ai",
  },
  {
    name: "Mads Dyrseth",
    title: "COO & Partner",
    bio: "One of Norway's foremost analysts on government leases, with expertise in financial analysis, consulting, and commercial property from Statsbygg and SVV.",
    phone: "+47 97 40 78 49",
    email: "mads@areasim.ai",
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// ─── Sortable Floor Card ───────────────────────────────────────────────────────
function SortableFloorCard({
  floor,
  index,
  isVerified,
  canDelete,
  onRemove,
  onUpdate,
  onVerify,
  onFileChange,
}: {
  floor: Floor;
  index: number;
  isVerified: boolean;
  canDelete: boolean;
  onRemove: () => void;
  onUpdate: (data: Partial<Floor>) => void;
  onVerify: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: floor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="group relative p-6 rounded-2xl border border-border bg-[#FDFBF7] hover:border-primary/30 transition-all shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Floor Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing text-text-muted hover:text-primary transition-colors touch-none p-1 -ml-1"
                  title="Drag to reorder"
                >
                  <GripVertical size={16} />
                </button>
                <h3 className="text-sm font-semibold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                  Floor {index + 1}
                </h3>
              </div>
              {canDelete && (
                <button
                  onClick={onRemove}
                  className="text-text-muted hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-1">
              <Input
                label="Floor name"
                placeholder="e.g. Ground Floor"
                value={floor.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
              {floor.file && isVerified && (
                <div className="pt-3 pb-1 space-y-1.5">
                  <div className="flex items-center gap-1.5" style={{ color: "#0A4F6E" }}>
                    <Check size={13} strokeWidth={2.5} style={{ color: "#0A4F6E" }} />
                    <p className="text-[11px] font-semibold" style={{ color: "#0A4F6E" }}>
                      This floor plan is verified
                    </p>
                  </div>
                  <p className="text-[10px] text-text-muted">8 rooms were identified</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex-1">
            <p className="text-sm font-medium text-text mb-2">Floor plan</p>
            {floor.file ? (
              <div className="relative aspect-[4/3] rounded-xl border border-border overflow-hidden group/image bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={floor.file.preview}
                  alt={floor.name}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="!bg-white pointer-events-auto"
                    onClick={onVerify}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="!bg-white pointer-events-auto"
                    onClick={() => document.getElementById(`change-file-${floor.id}`)?.click()}
                  >
                    Change
                  </Button>
                  <input
                    id={`change-file-${floor.id}`}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={onFileChange}
                  />
                </div>
                {isVerified && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-accent/90 text-white px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider">
                    <Check size={10} />
                    Verified
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 aspect-[4/3] rounded-xl border-2 border-dashed border-[#C4BAED] bg-[#F0EEFF] hover:border-[#9B8FD0]/60 hover:bg-[#EAE5FF] transition-all cursor-pointer group/upload">
                <div className="w-10 h-10 rounded-full bg-white border border-[#DDD8F7] shadow-sm flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                  <Upload size={20} style={{ color: "#6D5FAD" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-text">Upload floor plan</p>
                  <p className="text-xs text-text-muted mt-0.5">Jpg, Png or Pdf</p>
                </div>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={onFileChange} />
              </label>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Consultant Contact Cards (reused in two modals) ──────────────────────────
function ConsultantCards() {
  return (
    <div className="space-y-3">
      {CONSULTANTS.map((c) => (
        <div key={c.name} className="p-4 rounded-2xl border border-border bg-surface hover:border-primary/20 transition-all">
          <p className="text-sm font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{c.name}</p>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#0A4F6E" }}>{c.title}</p>
          <p className="text-xs text-text-muted font-body leading-relaxed">{c.bio}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Step3FloorPlans({ onNext, onBack }: Props) {
  const { floors, addFloor, removeFloor, updateFloor, setFloors } = useOnboardingStore();
  const [verifyingFloor, setVerifyingFloor] = useState<Floor | null>(null);
  const [showNoFloorPlanModal, setShowNoFloorPlanModal] = useState(false);
  const [_noFloorShowContacts, _setNoFloorShowContacts] = useState(false);
  const [verifiedFloorIds, setVerifiedFloorIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddFloor = () => {
    const newId = Date.now().toString();
    addFloor({
      id: newId,
      name: `Floor ${floors.length + 1}`,
      level: (floors.length + 1).toString(),
    });
  };

  const handleFileChange = (floorId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const floor = floors.find((f) => f.id === floorId);
    if (!floor) return;
    const updated = { ...floor, file: { name: file.name, type: file.type, size: file.size, preview } };
    updateFloor(floorId, updated);
    setVerifyingFloor(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = floors.findIndex((f) => f.id === active.id);
      const newIndex = floors.findIndex((f) => f.id === over.id);
      setFloors(arrayMove(floors, oldIndex, newIndex));
    }
  };

  const handleVerifyFloorPlan = () => {
    if (!verifyingFloor) return;
    // Always mark as verified — never show the unclear modal
    setVerifiedFloorIds((prev) =>
      prev.includes(verifyingFloor.id) ? prev : [...prev, verifyingFloor.id]
    );
    setVerifyingFloor(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Secondary notice — no dot, just text */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-sm text-primary font-body leading-relaxed">
          You need to include all areas you have access to, including shared spaces (canteen, meeting center, gym, auditorium, etc.)
        </p>
      </div>

      {/* Floor cards */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={floors.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {floors.map((floor, index) => (
              <SortableFloorCard
                key={floor.id}
                floor={floor}
                index={index}
                isVerified={verifiedFloorIds.includes(floor.id)}
                canDelete={floors.length > 1}
                onRemove={() => removeFloor(floor.id)}
                onUpdate={(data) => updateFloor(floor.id, data)}
                onVerify={() => setVerifyingFloor(floor)}
                onFileChange={(e) => handleFileChange(floor.id, e)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Floor Button */}
      <button
        onClick={handleAddFloor}
        className="w-full py-5 rounded-2xl border-2 border-dashed border-border bg-[#FDFBF7] text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/[0.02] transition-all flex items-center justify-center gap-2 group"
      >
        <Plus size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">Add floor</span>
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold font-body text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={floors.some((f) => !f.file)}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue
        </Button>
      </div>

      {/* ── Verification Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {verifyingFloor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-text/60 backdrop-blur-sm"
              onClick={() => setVerifyingFloor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-border flex flex-col gap-2 bg-surface shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    {verifyingFloor.name}
                  </h2>
                  <button
                    onClick={() => setVerifyingFloor(null)}
                    className="p-1.5 text-text-muted hover:text-text transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* Warning */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(226,117,0,0.08)", border: "1px solid rgba(226,117,0,0.2)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M8 1.5L14.5 13H1.5L8 1.5Z" fill="#E27500" fillOpacity="0.15" stroke="#E27500" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 6v3.5" stroke="#E27500" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="#E27500"/></svg>
                  <p className="text-xs font-semibold" style={{ color: "#E27500" }}>
                    Make sure your floor plan is clear, as it will be used in future steps.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8" style={{ background: "#FBF6EE" }}>
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-border p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={verifyingFloor.file?.preview} alt={verifyingFloor.name} className="w-full h-auto" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-end gap-3 shrink-0">
                <Button variant="secondary" size="md" onClick={() => setVerifyingFloor(null)}>Re-upload</Button>
                <Button onClick={handleVerifyFloorPlan}>
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── No Floor Plan Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNoFloorPlanModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full max-w-lg bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="relative px-6 pt-6 pb-5 border-b border-border">
                <button
                  className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text transition-colors"
                  onClick={() => { setShowNoFloorPlanModal(false); }}
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                      Don&apos;t have a floor plan?
                    </h2>
                    <p className="text-xs text-text-muted font-body mt-0.5">
                      Here are the ways you can get one.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* ── Your options ── */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-text-muted tracking-widest font-body px-1">Your options</p>

                  {/* Get from landlord */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-default">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text font-body">Get it from your landlord</p>
                      <p className="text-xs text-text-muted font-body mt-0.5 leading-relaxed">
                        Ask your building manager or landlord — most are required to hold official floor plans.
                      </p>
                    </div>
                  </div>

                  {/* Buy professional */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-accent/30 hover:bg-accent/[0.02] transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                      <ShoppingCart size={18} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text font-body">Buy a professional floor plan</p>
                      <p className="text-xs text-text-muted font-body mt-0.5 leading-relaxed">
                        Our team can procure a professional, scan-ready floor plan for your building.
                      </p>
                      <div className="mt-3">
                        <Button size="sm" variant="primary">Buy floor plan</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Contact us ── */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-text-muted tracking-widest font-body px-1">Contact us</p>
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-surface">
                    <div className="w-10 h-10 rounded-2xl bg-[#0A4F6E]/10 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[#0A4F6E]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text font-body">Get in touch</p>
                      <p className="text-xs text-text-muted font-body mt-0.5 leading-relaxed">
                        If you have any queries, contact us via email
                      </p>
                      <a
                        href="mailto:service@areasim.ai"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-[#0A4F6E] hover:underline"
                      >
                        <Mail size={14} />
                        service@areasim.ai
                      </a>
                    </div>
                  </div>
                </div>

                {/* ── About our experts ── */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-text-muted tracking-widest font-body px-1">
                    About our experts
                  </p>
                  <ConsultantCards />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export the modal trigger for the onboarding page header button
export { };
