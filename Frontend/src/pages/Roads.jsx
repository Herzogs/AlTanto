import { useEffect } from "react";
import { useStore } from "@store";
import Map from "@components/Map/Map";
import { Container } from "react-bootstrap";

function Roads() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    routingMode,
    setRoutingMode,
    setStartPoint,
    setEndPoint,
  } = useStore();

  useEffect(() => {
    setUserLocation(null);
    setStartPoint(null);
    setEndPoint(null);
    setRoutingMode(true);
  }, [setRoutingMode]);

  return (
    <section className="container_home">
      <Container fluid className="h-100">
        <h3 className="my-4 text-center">Recorridos</h3>
        <div className="h-map pb-fotter">
          <Map
            userLocation={userLocation}
            radius={radiusZone}
            routingMode={routingMode}
          />
        </div>
      </Container>
    </section>
  );
}

export default Roads;
