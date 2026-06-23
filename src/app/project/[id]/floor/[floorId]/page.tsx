"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Gem, Play, ClipboardCheck, Building2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { CountingStepper, countingStepHref } from "@/components/ui/CountingStepper";
import { OrgSetupModal } from "@/components/canvas/OrgSetupModal";
import { DetailPanel } from "@/components/canvas/DetailPanel";
// import { ScoreWidget } from "@/components/canvas/ScoreWidget"; // commented out — may be needed in future
import { SurveyModal } from "@/components/canvas/SurveyModal";
import { CompletionModal } from "@/components/canvas/CompletionModal";
import { GuideOverlay, GUIDE_TOTAL } from "@/components/canvas/GuideOverlay";
import { useCanvasStore } from "@/store/canvas";
import { mockProject } from "@/lib/mockData";
import { UserAvatar } from "@/components/ui/UserAvatar";

const FloorCanvas = dynamic(
  () => import("@/components/canvas/FloorCanvas").then((m) => m.FloorCanvas),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-text-muted font-body text-sm">Loading canvas…</div> }
);

export default function FloorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const {
    floors, setActiveFloor,
    setDetailPanel, detailPanelOpen,
    setCompletionModal, setSurveyModal,
  } = useCanvasStore();

  const [_floorDropdownOpen, _setFloorDropdownOpen] = useState(false);

  // Organisation-setup step (2nd counting sub-step). Opening the modal marks
  // "Open floor plan" done and moves the stepper to "Organisation setup".
  const [showOrgModal, setShowOrgModal] = useState(false);
  const goToCounting = () =>
    router.push(`/project/${projectId}/floor/${floorId}/count#show-instructions`);
  const handleOrgComplete = () => { setShowOrgModal(false); goToCounting(); };

  // Open the org-setup modal when navigated here via the stepper (#org-setup hash)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#org-setup") {
      setShowOrgModal(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Counting-stepper navigation — lets the user move back/forth between steps
  const handleStepClick = (id: Parameters<typeof countingStepHref>[2]) => {
    if (id === "org-setup") { setShowOrgModal(true); return; }
    if (id === "floor-plan") { setShowOrgModal(false); return; }
    router.push(countingStepHref(projectId, floorId, id));
  };

  // Guide state — only shown when arriving from Step6Done ("Great! You're all set" page via #show-guide hash)
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // Show guide only when arriving from Step6Done via #show-guide hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#show-guide") {
      setShowGuide(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open/close detail panel based on guide step
  const panelSteps = new Set([0, 3]);
  const noPanelSteps = new Set([4, 5]);
  useEffect(() => {
    if (!showGuide) return;
    if (panelSteps.has(guideStep)) setDetailPanel(true);
    if (noPanelSteps.has(guideStep)) setDetailPanel(false);
  }, [showGuide, guideStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuideNext = () => {
    if (guideStep >= GUIDE_TOTAL - 1) { setShowGuide(false); setGuideStep(0); }
    else setGuideStep(s => s + 1);
  };
  const handleGuideBack = () => setGuideStep(s => Math.max(0, s - 1));
  const handleGuideClose = () => { setShowGuide(false); setGuideStep(0); };
  const handleOpenGuide = () => { setGuideStep(0); setShowGuide(true); };

  const activeFloor = floors.find((f) => f.id === floorId) ?? floors[0];
  const activeFloorRooms = activeFloor?.rooms ?? [];
  const allCounted = activeFloorRooms.length > 0 && activeFloorRooms.every((r) => r.status === "counted");

  // Highlight first room when on panel steps 0 or 3 (Identify rooms, Create zones)
  const guideHighlightFirstRoom = showGuide && (guideStep === 0 || guideStep === 3);

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden relative">
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-3 py-2 bg-surface shrink-0">
        {/* Logo — navigates to dashboard */}
        <button onClick={() => router.push("/dashboard")} className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo size="md" showText={false} />
        </button>

        <div className="w-px h-5 bg-border" />

        {/* Project name */}
        <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[200px]">
          {mockProject.name}
        </span>

        <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />

        {/* Floor selector — native select styled like counting page */}
        <div className="relative min-w-[148px]">
          <select
            value={activeFloor?.id ?? ""}
            onChange={(e) => {
              setActiveFloor(e.target.value);
              router.push(`/project/${projectId}/floor/${e.target.value}`);
            }}
            className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>{floor.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Conduct survey — secondary */}
          <Button
            variant="secondary"
            size="sm"
            icon={<ClipboardCheck size={14} />}
            onClick={() => setSurveyModal(true)}
            className="h-9 py-2 px-4"
          >
            <span className="hidden sm:inline">Conduct survey</span>
          </Button>

          {/* Rooms list — secondary */}
          <Button
            variant="secondary"
            size="sm"
            icon={<SlidersHorizontal size={14} />}
            onClick={() => setDetailPanel(!detailPanelOpen)}
            className="h-9 py-2 px-4"
          >
            <span className="hidden sm:inline">Rooms list</span>
          </Button>

          {/* Start room counting — primary */}
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={13} />}
            onClick={() => setShowOrgModal(true)}
            className="h-9 py-2 px-4"
          >
            <span className="hidden sm:inline">Start room counting</span>
          </Button>



          {allCounted && (
            <Button
              variant="primary"
              size="sm"
              icon={<Gem size={14} />}
              onClick={() => setCompletionModal(true)}
              className="h-9 py-2 px-4"
              style={{ background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)", boxShadow: "0 4px 14px rgba(180,83,9,0.35)" }}
            >
              <span className="hidden sm:inline">Room Program</span>
            </Button>
          )}

          <LanguageSelector />

          {/* User avatar */}
          <UserAvatar onClick={() => router.push("/settings")} />
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />
      <CountingStepper
        activeStep={showOrgModal ? "org-setup" : "floor-plan"}
        onStepClick={handleStepClick}
      />

      {/* ── Main Area ── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Canvas always full width */}
        <div className="w-full h-full flex flex-col relative">
          <FloorCanvas
            floorId={floorId}
            imageUrl={activeFloor?.imageUrl ?? "/mock/floorplan-oslo.svg"}
            showGuide={showGuide}
            guideStep={guideStep}
            onOpenGuide={handleOpenGuide}
          />
          {/* Score widget — top-left of canvas (commented out, may be needed in future) */}
          {/* <div className="absolute top-3 left-3 z-30">
            <ScoreWidget />
          </div> */}
        </div>

        {/* Configure organization setup — floating CTA on the canvas */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <Button
            variant="secondary"
            size="sm"
            icon={<Building2 size={14} />}
            onClick={() => setShowOrgModal(true)}
            className="h-9 py-2 px-4 shadow-md"
          >
            Configure organization setup
          </Button>
        </div>

        {/* Detail panel — absolute overlay, right-aligned, 1/3 screen width */}
        <DetailPanel floorId={floorId} guideHighlightFirstRoom={guideHighlightFirstRoom} />
      </div>

      {/* Guide overlay — fixed positioning, renders above everything */}
      <AnimatePresence>
        {showGuide && (
          <GuideOverlay
            step={guideStep}
            onNext={handleGuideNext}
            onBack={handleGuideBack}
            onClose={handleGuideClose}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <SurveyModal />
      <CompletionModal />
      <OrgSetupModal
        open={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        onComplete={handleOrgComplete}
      />
    </div>
  );
}
