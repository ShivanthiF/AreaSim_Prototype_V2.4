import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room, Zone, Floor, mockProject, ZONE_COLORS, CountEntry, DetectedRoom } from "@/lib/mockData";

type Tool = "select" | "pen" | "zone" | "group" | "eraser";

interface CanvasState {
  floors: Floor[];
  activeFloorId: string;
  activeTool: Tool;
  selectedRoomIds: string[];
  detailPanelOpen: boolean;
  surveyModalOpen: boolean;
  completionModalOpen: boolean;
  totalRooms: number;
  totalZones: number;
  surveyResponses: number;

  setActiveFloor: (id: string) => void;
  setTool: (tool: Tool) => void;
  toggleRoomSelection: (id: string) => void;
  clearSelection: () => void;

  addRoom: (floorId: string, room: Room) => void;
  updateRoom: (floorId: string, roomId: string, data: Partial<Room>) => void;
  updateRoomPoints: (floorId: string, roomId: string, dx: number, dy: number) => void;
  deleteRoom: (floorId: string, roomId: string) => void;
  addCountEntry: (floorId: string, roomId: string, entry: CountEntry) => void;

  addZone: (floorId: string, zone: Zone) => void;
  deleteZone: (floorId: string, zoneId: string) => void;
  addFloor: (floor: Floor) => void;

  verifyDetectedRoom: (floorId: string, detectedId: string) => void;

  setDetailPanel: (open: boolean) => void;
  setSurveyModal: (open: boolean) => void;
  setCompletionModal: (open: boolean) => void;

  getActiveFloor: () => Floor | undefined;
  getRoomsForFloor: (floorId: string) => Room[];
  getZonesForFloor: (floorId: string) => Zone[];
  getDetectedRooms: (floorId: string) => DetectedRoom[];
  getNextZoneColor: (floorId: string) => string;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      floors: mockProject.floors,
      activeFloorId: mockProject.floors[0].id,
      activeTool: "select",
      selectedRoomIds: [],
      detailPanelOpen: true,
      surveyModalOpen: false,
      completionModalOpen: false,
      totalRooms: 0,
      totalZones: 0,
      surveyResponses: 0,

      setActiveFloor: (id) => set({ activeFloorId: id, selectedRoomIds: [] }),
      setTool: (tool) => set({ activeTool: tool, selectedRoomIds: [] }),

      toggleRoomSelection: (id) =>
        set((s) => ({
          selectedRoomIds: s.selectedRoomIds.includes(id)
            ? s.selectedRoomIds.filter((r) => r !== id)
            : [...s.selectedRoomIds, id],
        })),

      clearSelection: () => set({ selectedRoomIds: [] }),

      addRoom: (floorId, room) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId ? { ...f, rooms: [...f.rooms, room] } : f
          ),
          totalRooms: s.totalRooms + 1,
        })),

      updateRoom: (floorId, roomId, data) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? { ...f, rooms: f.rooms.map((r) => (r.id === roomId ? { ...r, ...data } : r)) }
              : f
          ),
        })),

      updateRoomPoints: (floorId, roomId, dx, dy) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? {
                  ...f,
                  rooms: f.rooms.map((r) =>
                    r.id === roomId
                      ? {
                          ...r,
                          points: r.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy)),
                        }
                      : r
                  ),
                }
              : f
          ),
        })),

      deleteRoom: (floorId, roomId) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId ? { ...f, rooms: f.rooms.filter((r) => r.id !== roomId) } : f
          ),
          totalRooms: Math.max(0, s.totalRooms - 1),
        })),

      addCountEntry: (floorId, roomId, entry) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? {
                  ...f,
                  rooms: f.rooms.map((r) =>
                    r.id === roomId
                      ? {
                          ...r,
                          status: "counted" as const,
                          currentCount: entry.count,
                          countHistory: [entry, ...r.countHistory],
                        }
                      : r
                  ),
                }
              : f
          ),
        })),

      addZone: (floorId, zone) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? {
                  ...f,
                  zones: [...f.zones, zone],
                  rooms: f.rooms.map((r) =>
                    zone.roomIds.includes(r.id) ? { ...r, zoneId: zone.id } : r
                  ),
                }
              : f
          ),
          totalZones: s.totalZones + 1,
        })),

      deleteZone: (floorId, zoneId) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? {
                  ...f,
                  zones: f.zones.filter((z) => z.id !== zoneId),
                  rooms: f.rooms.map((r) =>
                    r.zoneId === zoneId ? { ...r, zoneId: undefined } : r
                  ),
                }
              : f
          ),
          totalZones: Math.max(0, get().totalZones - 1),
        })),

      addFloor: (floor) =>
        set((s) => ({ floors: [...s.floors, floor] })),

      verifyDetectedRoom: (floorId, detectedId) =>
        set((s) => ({
          floors: s.floors.map((f) =>
            f.id === floorId
              ? {
                  ...f,
                  detectedRooms: (f.detectedRooms ?? []).map((dr) =>
                    dr.id === detectedId ? { ...dr, verified: true } : dr
                  ),
                }
              : f
          ),
        })),

      setDetailPanel: (open) => set({ detailPanelOpen: open }),
      setSurveyModal: (open) => set({ surveyModalOpen: open }),
      setCompletionModal: (open) => set({ completionModalOpen: open }),

      getActiveFloor: () => get().floors.find((f) => f.id === get().activeFloorId),
      getRoomsForFloor: (floorId) => get().floors.find((f) => f.id === floorId)?.rooms ?? [],
      getZonesForFloor: (floorId) => get().floors.find((f) => f.id === floorId)?.zones ?? [],
      getDetectedRooms: (floorId) => get().floors.find((f) => f.id === floorId)?.detectedRooms ?? [],
      getNextZoneColor: (floorId) => {
        const used = get().floors.find((f) => f.id === floorId)?.zones.length ?? 0;
        return ZONE_COLORS[used % ZONE_COLORS.length];
      },
    }),
    { name: "areasim-canvas-v2" }
  )
);
