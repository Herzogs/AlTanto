import { useEffect } from "react";
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
    setMarkerPosition,
  } = useStore();

  const { id } = userStore.getState().user;

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
      {id && <Aside />}
      <Map
        userLocation={userLocation}
        radiusZone={radiusZone}
        showFilters={true}
        mapClick={true}
      />
      {reports && reports.length > 0 && <SliderButton />}
    </section>
  );
}

export default Home;
