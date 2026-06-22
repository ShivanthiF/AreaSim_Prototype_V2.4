export interface CountEntry {
  count: number;
  by: string;
  date: string;
  time: string;
}

export interface Room {
  id: string;
  name: string;
  points: number[]; // flat [x1,y1,x2,y2,...] for Konva
  zoneId?: string;
  status: "unvisited" | "counting" | "counted";
  countHistory: CountEntry[];
  currentCount: number;
  sqm: number;
  category?: string;
  seats?: number;
  verified?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  roomIds: string[];
  color: string;
  category?: string; // e.g. "Training Zone", "Quick Training Zone"
}

export interface Floor {
  id: string;
  name: string;
  level: string;
  imageUrl: string;
  rooms: Room[];
  zones: Zone[];
  detectedRooms?: DetectedRoom[]; // AI-detected from uploaded floor plan
}

export interface DetectedRoom {
  id: string;
  name: string;
  verified: boolean;
  sqm: number;
}

export interface Project {
  id: string;
  name: string;
  buildingName: string;
  floors: Floor[];
}

export const mockCountHistory: CountEntry[] = [
  { count: 24, by: "John K.", date: "Mon Apr 14", time: "09:22 AM" },
  { count: 21, by: "Sarah L.", date: "Mon Apr 14", time: "02:15 PM" },
  { count: 18, by: "Mikkel T.", date: "Tue Apr 15", time: "10:05 AM" },
  { count: 26, by: "John K.", date: "Tue Apr 15", time: "03:40 PM" },
  { count: 22, by: "Ingrid H.", date: "Wed Apr 16", time: "11:30 AM" },
];

export const mockSurveys = [
  {
    id: "1",
    title: "Space Satisfaction Survey",
    description: "Understand how employees feel about their current workspace comfort and functionality.",
    questions: 8, minutes: 3, icon: "😊",
  },
  {
    id: "2",
    title: "Ergonomics Assessment",
    description: "Evaluate desk setups, chair comfort, monitor heights, and physical workspace ergonomics.",
    questions: 12, minutes: 5, icon: "🪑",
  },
  {
    id: "3",
    title: "Collaboration Needs",
    description: "Find out how teams collaborate, which spaces they prefer, and what's missing.",
    questions: 6, minutes: 2, icon: "🤝",
  },
];

const GROUND_DETECTED: DetectedRoom[] = [
  { id: "d-1", name: "Conference Room A", verified: false, sqm: 45 },
  { id: "d-2", name: "Conference Room B", verified: false, sqm: 32 },
  { id: "d-3", name: "Open Office", verified: false, sqm: 120 },
  { id: "d-4", name: "Break Room", verified: false, sqm: 28 },
  { id: "d-5", name: "Reception", verified: false, sqm: 18 },
  { id: "d-6", name: "Storage Room", verified: false, sqm: 12 },
  { id: "d-7", name: "Focus Zone", verified: false, sqm: 8 },
  { id: "d-8", name: "Server Room", verified: false, sqm: 15 },
];

const FLOOR1_DETECTED: DetectedRoom[] = [
  { id: "d1-1", name: "Staff Training Room", verified: false, sqm: 65 },
  { id: "d1-2", name: "Medical Workshop Room", verified: false, sqm: 55 },
  { id: "d1-3", name: "Simulation Lab", verified: false, sqm: 80 },
  { id: "d1-4", name: "Orientation Room", verified: false, sqm: 40 },
  { id: "d1-5", name: "Breakout Area", verified: false, sqm: 35 },
  { id: "d1-6", name: "Instructor Office", verified: false, sqm: 20 },
];

const FLOOR2_DETECTED: DetectedRoom[] = [
  { id: "d2-1", name: "Executive Boardroom", verified: false, sqm: 50 },
  { id: "d2-2", name: "HR Office", verified: false, sqm: 25 },
  { id: "d2-3", name: "Finance Suite", verified: false, sqm: 45 },
  { id: "d2-4", name: "Quiet Library", verified: false, sqm: 60 },
];

export const mockProject: Project = {
  id: "proj-1",
  name: "Oslo HQ Optimisation",
  buildingName: "Aker Brygge Tower",
  floors: [
    {
      id: "floor-1",
      name: "Ground Floor",
      level: "Ground",
      imageUrl: "/mock/floorplan-oslo.svg",
      rooms: [
        { id: "r1", name: "Conference Room A", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 45, verified: false },
        { id: "r2", name: "Conference Room B", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 32, verified: false },
        { id: "r3", name: "Open Office Area", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 120, verified: false },
        { id: "r4", name: "Break Room", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 28, verified: false },
        { id: "r5", name: "Reception Lobby", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 18, verified: false },
        { id: "r6", name: "Focus Zone 1", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 12, verified: false },
        { id: "r7", name: "Focus Zone 2", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 12, verified: false },
        { id: "r8", name: "Collaboration Hub", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 40, verified: false },
        { id: "r9", name: "Storage Room", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 15, verified: false },
        { id: "r10", name: "Server Room", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 10, verified: false },
        { id: "r11", name: "Quiet Room", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 14, verified: false },
      ],
      zones: [
        { id: "z1", name: "Meeting Zone", roomIds: ["r1", "r2"], color: "#6366F1", category: "Focus" },
        { id: "z2", name: "Work Zone", roomIds: ["r3"], color: "#F59E0B", category: "Open" },
      ],
      detectedRooms: GROUND_DETECTED,
    },
    {
      id: "floor-2",
      name: "1st Floor",
      level: "1st",
      imageUrl: "/mock/floorplan-oslo.svg",
      rooms: [
        { id: "r1-1", name: "Staff Training Room", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 65, verified: false },
        { id: "r1-2", name: "Simulation Lab", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 80, verified: false },
        { id: "r1-3", name: "Workshop A", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 45, verified: false },
        { id: "r1-4", name: "Workshop B", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 45, verified: false },
        { id: "r1-5", name: "Instructor Office", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 22, verified: false },
        { id: "r1-6", name: "Equipment Storage", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 30, verified: false },
        { id: "r1-7", name: "Pantry", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 15, verified: false },
        { id: "r1-8", name: "Focus Pod 1", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 8, verified: false },
        { id: "r1-9", name: "Focus Pod 2", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 8, verified: false },
        { id: "r1-10", name: "Focus Pod 3", points: [], status: "unvisited", countHistory: [], currentCount: 0, sqm: 8, verified: false },
      ],
      zones: [],
      detectedRooms: FLOOR1_DETECTED,
    },
    {
      id: "floor-3",
      name: "2nd Floor",
      level: "2nd",
      imageUrl: "/mock/floorplan-oslo.svg",
      rooms: [],
      zones: [],
      detectedRooms: FLOOR2_DETECTED,
    },
  ],
};

export const ZONE_COLORS = [
  "#F59E0B", "#6366F1", "#10B981", "#EC4899", "#3B82F6", "#8B5CF6",
];

// ─── Phase 3 Mock Data ───────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Observer";
  avatar: string;
  status: "active" | "pending";
  joinedAt: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "room" | "survey" | "floor" | "member" | "project";
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: "rating" | "yesno" | "multiple";
  responses: { label: string; count: number }[];
}

export interface SurveyRecord {
  id: string;
  name: string;
  project: string;
  floor: string;
  sentTo: number;
  responses: number;
  status: "sent" | "draft" | "archived";
  createdAt: string;
  questions: SurveyQuestion[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  buildingName: string;
  floors: number;
  rooms: number;
  zones: number;
  surveyResponses: number;
  completionPct: number;
  status: "active" | "draft" | "completed";
  lastUpdated: string;
}

export const mockUser: User = {
  id: "user-1",
  name: "Ingrid Hansen",
  email: "ingrid@oslo-health.no",
  role: "Workspace Manager",
};

export const mockTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Ingrid Hansen", email: "ingrid@oslo-health.no", role: "Admin", avatar: "IH", status: "active", joinedAt: "Jan 2024" },
  { id: "tm-2", name: "Mikkel Thorsen", email: "mikkel@oslo-health.no", role: "Analyst", avatar: "MT", status: "active", joinedAt: "Mar 2024" },
  { id: "tm-3", name: "Sara Lindqvist", email: "sara@oslo-health.no", role: "Observer", avatar: "SL", status: "active", joinedAt: "Apr 2024" },
  { id: "tm-4", name: "John Kristiansen", email: "john@oslo-health.no", role: "Analyst", avatar: "JK", status: "active", joinedAt: "May 2024" },
  { id: "tm-5", name: "Astrid Nygaard", email: "astrid@oslo-health.no", role: "Observer", avatar: "AN", status: "pending", joinedAt: "Jun 2024" },
];

export const mockActivity: ActivityItem[] = [
  { id: "a-1", user: "John K.", action: "counted", target: "Conference Room A", time: "2 hours ago", type: "room" },
  { id: "a-2", user: "Sara L.", action: "completed", target: "Space Satisfaction Survey", time: "4 hours ago", type: "survey" },
  { id: "a-3", user: "Mikkel T.", action: "added floor", target: "2nd Floor", time: "Yesterday", type: "floor" },
  { id: "a-4", user: "Ingrid H.", action: "invited", target: "john@oslo-health.no", time: "2 days ago", type: "member" },
  { id: "a-5", user: "John K.", action: "drew room", target: "Open Office", time: "2 days ago", type: "room" },
  { id: "a-6", user: "Sara L.", action: "sent survey to", target: "Floor 1 staff", time: "3 days ago", type: "survey" },
  { id: "a-7", user: "Ingrid H.", action: "created", target: "Oslo HQ Optimisation", time: "1 week ago", type: "project" },
];

export const mockSurveyRecords: SurveyRecord[] = [
  {
    id: "sr-1",
    name: "Space Satisfaction Survey",
    project: "Oslo HQ Optimisation",
    floor: "Ground Floor",
    sentTo: 42,
    responses: 38,
    status: "sent",
    createdAt: "Apr 10, 2024",
    questions: [
      {
        id: "q1", text: "How satisfied are you with your current workspace?", type: "rating",
        responses: [{ label: "5 - Very Satisfied", count: 14 }, { label: "4 - Satisfied", count: 12 }, { label: "3 - Neutral", count: 8 }, { label: "2 - Unsatisfied", count: 3 }, { label: "1 - Very Unsatisfied", count: 1 }]
      },
      {
        id: "q2", text: "Do you have enough quiet space to focus?", type: "yesno",
        responses: [{ label: "Yes", count: 22 }, { label: "No", count: 16 }]
      },
      {
        id: "q3", text: "Which area do you use most?", type: "multiple",
        responses: [{ label: "Open Office", count: 18 }, { label: "Conference Room", count: 10 }, { label: "Focus Zone", count: 7 }, { label: "Break Room", count: 3 }]
      },
    ],
  },
  {
    id: "sr-2",
    name: "Ergonomics Assessment",
    project: "Oslo HQ Optimisation",
    floor: "1st Floor",
    sentTo: 28,
    responses: 19,
    status: "sent",
    createdAt: "Apr 8, 2024",
    questions: [
      {
        id: "q1", text: "How would you rate your desk ergonomics?", type: "rating",
        responses: [{ label: "5 - Excellent", count: 4 }, { label: "4 - Good", count: 7 }, { label: "3 - Fair", count: 5 }, { label: "2 - Poor", count: 2 }, { label: "1 - Very Poor", count: 1 }]
      },
      {
        id: "q2", text: "Do you experience pain related to your workstation?", type: "yesno",
        responses: [{ label: "Yes", count: 11 }, { label: "No", count: 8 }]
      },
    ],
  },
  {
    id: "sr-3",
    name: "Collaboration Needs",
    project: "Oslo HQ Optimisation",
    floor: "2nd Floor",
    sentTo: 0,
    responses: 0,
    status: "draft",
    createdAt: "Apr 15, 2024",
    questions: [],
  },
];

export const mockProjects: ProjectSummary[] = [
  {
    id: "proj-1",
    name: "Oslo HQ Optimisation",
    buildingName: "Aker Brygge Tower",
    floors: 3,
    rooms: 14,
    zones: 4,
    surveyResponses: 57,
    completionPct: 72,
    status: "active",
    lastUpdated: "2 hours ago",
  },
  {
    id: "proj-2",
    name: "Bergen Office Audit",
    buildingName: "Bryggen Business Park",
    floors: 2,
    rooms: 8,
    zones: 3,
    surveyResponses: 21,
    completionPct: 45,
    status: "active",
    lastUpdated: "Yesterday",
  },
  {
    id: "proj-3",
    name: "Stavanger Pilot",
    buildingName: "Forus Tech Hub",
    floors: 1,
    rooms: 5,
    zones: 2,
    surveyResponses: 0,
    completionPct: 10,
    status: "draft",
    lastUpdated: "3 days ago",
  },
];

export const mockDashboardStats = {
  totalProjects: 3,
  totalRooms: 27,
  avgUtilisation: 68,
  surveysCompleted: 57,
};
