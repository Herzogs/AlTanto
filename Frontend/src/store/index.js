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

const automaticReport = create(
  persist(
    (set) => ({
      title: null,
      setTitle: (title) => set({ title: title }),
      category: null,
      setCategory: (category) => set({ category: category }),
      idCategory: null,
      setIdCategory: (id) => set({ idCategory: id }),
      file: null,
      setFile: (file) => set({ file: file }),
    }),
    {
    name: 'automaticReport'
  })
);

const userStore = create(
  persist(
    (set) => ({
      user: {
        name: null,
        lastName: null,
        email: null,
      },
      setUser: (user) => set({
        user: {
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
  mountStoreDevtool('AutomaticReport', automaticReport);
  mountStoreDevtool('UserStore', userStore);
}


export { useStore, automaticReport, userStore };
