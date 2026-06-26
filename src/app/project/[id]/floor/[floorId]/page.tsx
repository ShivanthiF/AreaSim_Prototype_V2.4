"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Gem, Play, HelpCircle, MessageSquare, X, ChevronDown, Bell, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
    setCompletionModal,
  } = useCanvasStore();

  const [_floorDropdownOpen, _setFloorDropdownOpen] = useState(false);

  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");

  const faqItems = [
    { q: "Why do we do this counting exercise?", a: "To build a fact-based understanding of how we use our office facilities today." },
    { q: "Can we see data continuously while we count?", a: "Yes." },
    { q: "Do we need to count all areas including common areas in the building?", a: "Yes, everything needs to be counted." },
    { q: "Do we need to count all seats, including in the social zones and the canteen?", a: "Yes." },
    { q: "Can I split the counting in two (i.e. count half of the area at 8:00 and the other half at 09:00)?", a: "No. It is important to count the whole counting route at once and at the same time every day. The reason for this is that we need accurate and consistent information about how we use the facilities in order to be able to optimize our future." },
  ];

  // Organisation-setup step (2nd counting sub-step). Opening the modal marks
  // "Open floor plan" done and moves the stepper to "Organisation setup".
  const [showOrgModal, setShowOrgModal] = useState(false);
  // When the org-setup modal is part of the onboarding flow, finishing it should
  // continue to the "Map rooms and zones" step (canvas guide) rather than counting.
  const [orgThenGuide, setOrgThenGuide] = useState(false);
  const goToCounting = () =>
    router.push(`/project/${projectId}/floor/${floorId}/count#show-instructions`);
  // Called when the org-setup modal closes (X / Skip / Continue).
  const finishOrgSetup = (goCount: boolean) => {
    setShowOrgModal(false);
    if (orgThenGuide) {
      setOrgThenGuide(false);
      setGuideStep(0);
      setShowGuide(true);
    } else if (goCount) {
      goToCounting();
    }
  };
  const handleOrgComplete = () => finishOrgSetup(true);

  // Open the org-setup modal when navigated here via the stepper (#org-setup hash),
  // or via onboarding (#org-setup-then-guide → org setup first, then the canvas guide).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#org-setup-then-guide") {
      setShowOrgModal(true);
      setOrgThenGuide(true);
      window.history.replaceState(null, "", window.location.pathname);
    } else if (window.location.hash === "#org-setup") {
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
    if (guideStep >= GUIDE_TOTAL - 1) { setShowGuide(false); setGuideStep(0); setDetailPanel(true); }
    else setGuideStep(s => s + 1);
  };
  const handleGuideBack = () => setGuideStep(s => Math.max(0, s - 1));
  const handleGuideClose = () => { setShowGuide(false); setGuideStep(0); setDetailPanel(true); };
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

          <Button
            variant="secondary"
            size="sm"
            className="h-8 px-4 shrink-0"
            icon={<HelpCircle size={14} />}
            onClick={() => setShowQuestionsModal(true)}
          >
            Got questions?
          </Button>

          <LanguageSelector />

          <button
            onClick={() => setShowNotifModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <Bell size={16} />
          </button>

          {/* User avatar */}
          <UserAvatar onClick={() => router.push("/settings")} />
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />
      <CountingStepper
        activeStep={showOrgModal ? "org-setup" : "floor-plan"}
        onStepClick={handleStepClick}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<SlidersHorizontal size={14} />}
              onClick={() => setDetailPanel(!detailPanelOpen)}
              className="h-8 px-4"
            >
              <span className="hidden sm:inline">Room list</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Play size={13} />}
              onClick={goToCounting}
              className="h-8 px-4"
            >
              <span className="hidden sm:inline">Room setup</span>
            </Button>
          </>
        }
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
        onClose={() => finishOrgSetup(false)}
        onComplete={handleOrgComplete}
      />

      {/* ── Got questions modal ── */}
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
                <button onClick={() => setShowQuestionsModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted tracking-wider">Common Questions</p>
                  <div className="divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] overflow-hidden">
                    {faqItems.map((item, i) => (
                      <div key={i} className="bg-[#F8FAFC]">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white transition-colors"
                        >
                          <span className="text-sm font-medium text-text leading-snug">{item.q}</span>
                          <motion.div animate={{ rotate: expandedFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
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
                  <p className="text-[11px] font-bold text-text-muted tracking-wider">Something else?</p>
                  <textarea
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full h-24 rounded-xl border border-[#969696] bg-white text-[#222B27] font-body placeholder:text-[#98A1B2] px-5 py-3 text-sm transition-all duration-200 hover:border-[#999999] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#139485] focus:ring-4 focus:ring-[rgba(19,148,133,0.18)] resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowQuestionsModal(false)}>
                    Cancel
                  </Button>
                  <Button size="md" className="flex-1" onClick={() => { alert("Your questions have been sent to our consultants."); setShowQuestionsModal(false); setExpandedFaq(null); setCustomQuestion(""); }}>
                    Send to consultants
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Notification modal ── */}
      <AnimatePresence>
        {showNotifModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell size={18} className="text-primary" />
                  </div>
                  <h3 className="font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Next counting round
                  </h3>
                </div>
                <button onClick={() => setShowNotifModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-4">
                  <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-text font-body">15 mins more for your next counting round.</p>
                    <p className="text-sm text-text-muted font-body mt-1">Next round is 8:00 AM – 6:00 PM · 5 rounds of 2 hours each.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="btn-primary w-full h-10 rounded-xl text-sm font-semibold font-body"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
