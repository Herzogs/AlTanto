import create from "zustand";

const useStore = create((set) => ({
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  radiusZone: 500,
  setRadiusZone: (radiusZone) => set({ radiusZone: radiusZone }),
  routingMode: false,
  setRoutingMode: (routing) => set({ routingMode: routing }),

  reports: null,
  setReports: (reports) => set({ reports: reports }),

  startPoint: null,
  endPoint: null,
  setStartPoint: (point) => set({ startPoint: point }),
  setEndPoint: (point) => set({ endPoint: point }),

  routeCoordinates: [],
  setRouteCoordinates: (coordinates) => set({ routeCoordinates: coordinates }),
}));

export { useStore };
