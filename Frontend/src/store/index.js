import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useStore = create(
  persist(
    (set) => ({
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),

      oldUserLocation: null,
      setOldUserLocation: (location) => set({ oldUserLocation: location }),

      distance: 0,
      setDistance: (distance) => set({ distance: distance }),

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
    }),
    {
      name: 'store',
    }
  )
);

const automaticReport = create(

  (set) => ({
    title: null,
    setTitle: (title) => set({ title: title }),
    category: null,
    setCategory: (category) => set({ category: category }),
    idCategory: null,
    setIdCategory: (id) => set({ idCategory: id }),
    file: null,
    setFile: (file) => set({ file: file }),
  })
);

if (import.meta.env.VITE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
  mountStoreDevtool('AutomaticReport', automaticReport);
}


export { useStore, automaticReport };
