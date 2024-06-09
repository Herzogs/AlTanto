/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Map from "@components/Map/Map";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import CategoryFilter from "@components/Map/CategoryFilter";
import useReports from "@hook/useReports";
import { useStore } from "@store";

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
    setMarkerPosition,
  } = useStore();

  const { fetchReports } = useReports();

  useEffect(() => {
    setMarkerPosition(null);
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchReports();
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
      <Aside />
      <Map
        userLocation={userLocation}
        radiusZone={radiusZone}
        CategoryFilterComponent={CategoryFilter}
        mapClick={true}
      />
      {reports.length > 0 && <SliderButton />}
    </section>
  );
}

export default Home;
