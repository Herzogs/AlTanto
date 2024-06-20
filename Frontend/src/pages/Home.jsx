/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import useReports from "@hook/useReports";
import { useStore, userStore } from "@store";
import Spinner from 'react-bootstrap/Spinner';

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
    setLoading(false);

  }, []);
  
  useEffect(() => {
    if (userLocation) {
      fetchReports()

      setRadiusZone("500");
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
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div> // Indicador de carga
      ) : (
        <>
          <HeaderHome />
          {id && <Aside />}
          <Map
            userLocation={userLocation}
            radiusZone={radiusZone}
            showFilters={true}
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
