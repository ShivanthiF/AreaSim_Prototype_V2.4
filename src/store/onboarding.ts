import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Floor {
  id: string;
  name: string;
  level: string;
  file?: {
    name: string;
    preview?: string;
    type: string;
    size: number;
  };
}

export interface LeaseParams {
  totalArea: string;
  annualRent: string;
  commonAreaCost: string;
  leaseExpirationDate?: string;
  targetHeadcount: number;
  consultantsCount?: number;
  showConsultants?: boolean;
  consultantFTE?: 0.5 | 1;
}

export interface ProjectDetails {
  projectName: string;
  officeAddress: string;
  city: string;
  postalCode: string;
  category: string;
  industry: string;
}

interface OnboardingState {
  currentStep: number;
  project: ProjectDetails;
  floors: Floor[];
  leaseParams: LeaseParams;
  verificationFile?: {
    name: string;
    preview?: string;
  };

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProject: (data: Partial<ProjectDetails>) => void;
  setFloors: (floors: Floor[]) => void;
  addFloor: (floor: Floor) => void;
  removeFloor: (id: string) => void;
  updateFloor: (id: string, data: Partial<Floor>) => void;
  setLeaseParams: (data: Partial<LeaseParams>) => void;
  setVerificationFile: (file: OnboardingState["verificationFile"]) => void;
  reset: () => void;
}

const defaultProject: ProjectDetails = {
  projectName: "",
  officeAddress: "",
  city: "",
  postalCode: "",
  category: "",
  industry: "",
};

const defaultLeaseParams: LeaseParams = {
  totalArea: "",
  annualRent: "",
  commonAreaCost: "",
  leaseExpirationDate: "",
  targetHeadcount: 0,
  consultantsCount: 0,
  showConsultants: false,
  consultantFTE: 0.5,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      project: defaultProject,
      floors: [{ id: "1", name: "Ground Floor", level: "Ground" }],
      leaseParams: defaultLeaseParams,
      verificationFile: undefined,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      setProject: (data) =>
        set((s) => ({ project: { ...s.project, ...data } })),

      setFloors: (floors) => set({ floors }),
      addFloor: (floor) => set((s) => ({ floors: [...s.floors, floor] })),
      removeFloor: (id) =>
        set((s) => ({ floors: s.floors.filter((f) => f.id !== id) })),
      updateFloor: (id, data) =>
        set((s) => ({
          floors: s.floors.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),

      setLeaseParams: (data) =>
        set((s) => ({ leaseParams: { ...s.leaseParams, ...data } })),

      setVerificationFile: (file) => set({ verificationFile: file }),

      reset: () =>
        set({
          currentStep: 0,
          project: defaultProject,
          floors: [{ id: "1", name: "Ground Floor", level: "Ground" }],
          leaseParams: defaultLeaseParams,
          verificationFile: undefined,
        }),
    }),
    { name: "areasim-onboarding" }
  )
);
