"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, HelpCircle, Send, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockSurveys } from "@/lib/mockData";
import { useCanvasStore } from "@/store/canvas";

export function SurveyModal() {
  const { surveyModalOpen, setSurveyModal } = useCanvasStore();
  const [sent, setSent] = useState<string | null>(null);

  const handleSend = (surveyId: string) => {
    setSent(surveyId);
    setTimeout(() => {
      setSurveyModal(false);
      setSent(null);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {surveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSurveyModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-700 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                  Conduct Survey
                </h2>
                <p className="text-sm text-text-muted font-body">Select a template to send to your floor</p>
              </div>
              <button onClick={() => setSurveyModal(false)} className="text-text-muted hover:text-text transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {mockSurveys.map((survey) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-surface-2 p-4 hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{survey.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text font-body mb-1">{survey.title}</h3>
                      <p className="text-xs text-text-muted font-body leading-relaxed mb-3">
                        {survey.description}
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-xs text-text-muted font-body">
                          <HelpCircle size={12} /> {survey.questions} questions
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-muted font-body">
                          <Clock size={12} /> ~{survey.minutes} min
                        </span>
                      </div>

                      {sent === survey.id ? (
                        <div className="flex items-center gap-2 text-accent text-sm font-body font-medium">
                          <CheckCircle2 size={16} /> Sent to floor! (43 recipients)
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" icon={<Eye size={13} />}>Preview</Button>
                          <Button size="sm" icon={<Send size={13} />} onClick={() => handleSend(survey.id)}>
                            Send to Floor
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
