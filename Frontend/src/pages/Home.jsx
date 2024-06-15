/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import useReports from "@hook/useReports";
import { useStore, userStore } from "@store";

function Home() {
  const {
    userLocation,
    setUserLocation,
    setRoutingMode,
    reports,
    setRouteCoordinates,
    setOldUserLocation,
    setDistance,
    radiusZone,
    setRadiusZone,
    setMarkerPosition
  } = useStore();

  const { id } = userStore.getState().user;
  const { fetchReports } = useReports();

  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    setMarkerPosition(null);
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchReports().finally(() => setLoading(false)); // Finaliza el estado de carga después de obtener los reportes
      setRadiusZone("500");
    } else {
      setLoading(false); // Asegurarse de que el estado de carga se finalice si no hay ubicación del usuario
    }
  }, [userLocation, radiusZone]);

  useEffect(() => {
    setUserLocation(null);
    setOldUserLocation(null);
    setDistance(0);
    setRoutingMode(false);
    setRouteCoordinates(null);
  }, [setRoutingMode]);

  return (
    <section className="w-100 h-100">
      {loading ? (
        <div className="loading-indicator">Cargando...</div> // Indicador de carga
      ) : (
        <>
          <HeaderHome />
          {id && <Aside />}
          <Map
            userLocation={userLocation}
            radiusZone={radiusZone}
            /* showFilters={true} */
            mapClick={true}
            noCircle={false}
          />
          {reports && reports.length > 0 && <SliderButton />}
        </>
      )}
    </section>
  );
}

export default Home;
