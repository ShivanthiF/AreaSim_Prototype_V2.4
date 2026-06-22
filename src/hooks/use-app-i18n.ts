/**
 * Minimal i18n hook — returns hardcoded English strings for the onboarding
 * illustration. Replace with a real i18n solution when needed.
 */

const TRANSLATIONS: Record<string, string> = {
  "onboarding.projectDetails.hero.illustration.youAreHere": "You are here",
  "onboarding.projectDetails.hero.illustration.line1": "Start your",
  "onboarding.projectDetails.hero.illustration.emphasis": "workspace journey.",
  "onboarding.projectDetails.hero.illustration.subtitle":
    "Map where you are today — so we can show you where you could be tomorrow.",
  "onboarding.projectDetails.hero.badgeProject": "Create project",
  "onboarding.projectDetails.hero.badgeLease": "Lease parameters",
  "onboarding.projectDetails.hero.badgeFloor": "Floor plan",
  "onboarding.methodology.diagram.countCollect.line1": "Count +",
  "onboarding.methodology.diagram.countCollect.line2": "Collect",
  "onboarding.methodology.diagram.analysisAdvice.line1": "Analysis +",
  "onboarding.methodology.diagram.analysisAdvice.line2": "Advice",
  "onboarding.methodology.diagram.workplaceConcept.line1": "Workplace",
  "onboarding.methodology.diagram.workplaceConcept.line2": "Concept",
  "onboarding.methodology.diagram.roomProgram.line1": "Room Program",
  "onboarding.methodology.diagram.roomProgram.line2": "Development",
  "onboarding.methodology.diagram.designPhase.line1": "Design Phase",
  "onboarding.methodology.diagram.designPhase.line2": "",
  "onboarding.methodology.diagram.optimization.line1": "Optimization",
  "onboarding.methodology.diagram.optimization.line2": "",
};

export function useAppI18n() {
  return {
    t: (key: string): string => TRANSLATIONS[key] ?? key,
  };
}
