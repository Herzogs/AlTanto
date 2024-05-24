import React, { useEffect } from "react";
import { useStore } from "../store";
import Map from "../components/map/Map";

function Home() {
  const { userLocation, setUserLocation, setRoutingMode } = useStore();

  useEffect(() => {
    setUserLocation(null);
    setRoutingMode(false);
  }, [setRoutingMode]);

  return (
    <section className="container_home">
      <Map userLocation={userLocation} />
    </section>
  );
}

export default Home;
