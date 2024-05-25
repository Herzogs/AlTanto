import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useStore } from "../store";
import Map from "../components/map/Map";
import useReports from "../hook/useReports";


function Home() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRoutingMode,
    reports,
    setReports,
  } = useStore();

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  useEffect(() => {
    setUserLocation(null);
    setRoutingMode(false);
  }, [setRoutingMode]);

  return (
    <section className="container_home">
      <div className="top-section">
        <Container>
          <h3>
            No te pierdas nada <br /> de lo que está pasando
          </h3>
        </Container>
      </div>
      <div className="bottom-section">
        <Map userLocation={userLocation} />
      </div>
    </section>
  );
}

export default Home;
