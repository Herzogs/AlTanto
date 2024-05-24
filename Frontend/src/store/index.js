import create from 'zustand';

const useStore = create((set) => ({
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  radiusZone: null,
  setRadiusZone: (radius) => set({ radiusZone: radius }),
  routingMode: false,
  setRoutingMode: (routing) => set({ routingMode: routing }),

  startPoint: null,
  endPoint: null,
  setStartPoint: (point) => set({ startPoint: point }),
  setEndPoint: (point) => set({ endPoint: point }),
  
  routeCoordinates: [],
  setRouteCoordinates: (coordinates) => set({ routeCoordinates: coordinates }),
}));

export { useStore };
