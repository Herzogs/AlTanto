import { useEffect } from "react";
import { useStore } from "@store";
import Map from "@components/Map/Map";

function Roads() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    routingMode,
    setRoutingMode,
    setStartPoint,
    setEndPoint
  } = useStore();

  useEffect(() => {
    setUserLocation(null);
    setStartPoint(null)
    setEndPoint(null)
    setRoutingMode(true);
  }, [setRoutingMode]);

  return (
    <section className="container_home">
      <div className="top-section">
        <h3>Mantene al tanto</h3>
      </div>
      <div className="bottom-section">
        <Map
          userLocation={userLocation}
          radius={radiusZone}
          routingMode={routingMode}
        />
      </div>
    </section>
  );
}

export default Roads;
