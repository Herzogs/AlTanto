import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useStore, automaticReport } from "@store";
import Map from "@components/Map/Map";
import useReports from "@hook/useReports";

function Home() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRoutingMode,
    reports,
    setReports,
    setOldUserLocation,
    setDistance,
    setRouteCoordinates,
  } = useStore();

  const { setFile, setTitle, setCategory, setIdCategory } = automaticReport();


  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  useEffect(() => {
    setUserLocation(null);
    setOldUserLocation(null);
    setDistance(0);
    setFile(null);
    setTitle(null);
    setCategory(null);
    setIdCategory(null);
    setRoutingMode(false);
    setRouteCoordinates(null);

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
