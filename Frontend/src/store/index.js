import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';


const useStore = create(
  persist(
    (set) => ({

      time: null,
      setTime: (time) => set({ time: time }),

      markerPosition: null,
      setMarkerPosition: (position) => set({ markerPosition: position }),

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
      setStartPoint: (point) => set({ startPoint: point }),
      endPoint: null,
      setEndPoint: (point) => set({ endPoint: point }),

      routeCoordinates: [],
      setRouteCoordinates: (coordinates) => set({ routeCoordinates: coordinates }),
    }),
    {
      name: 'store',
    }
  )
);

const userStore = create(
  persist(
    (set) => ({
      user: {
        id: null,
        name: null,
        lastName: null,
        email: null,
      },
      setUser: (user) => set({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          lastName: user.lastName
        }
      }),
      token: null,
      setToken: (token) => set({ token: token }),
    }),
    {
      name: 'userStore',
    }
  )
);

if (import.meta.env.VITE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
  mountStoreDevtool('UserStore', userStore);
}


export { useStore, userStore };
