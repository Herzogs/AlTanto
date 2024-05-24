import create from 'zustand';

const useStore = create((set) => ({
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  startPoint: null,
  endPoint: null,
  setStartPoint: (point) => set({ startPoint: point }),
  setEndPoint: (point) => set({ endPoint: point }),
  routeCoordinates: [],
  setRouteCoordinates: (coordinates) => set({ routeCoordinates: coordinates }),
  routingMode: false,
  setRoutingMode: (routingMode) => set({ paramRoutingMode: routingMode }),
  reports: [],
  setReports: (reports) => set({ paramReports: reports }),
}));

export { useStore };
