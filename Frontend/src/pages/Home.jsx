import { useStore } from "../store/index";
import { useEffect } from "react";
import Map from "../components/map/Map";

function Home() {
  const { userLocation, radiusZone, setRoutingMode } = useStore();

  useEffect(() => {
    setRoutingMode(false);
  }, []);

  return (
    <section className="container_home">
      <Map userLocation={userLocation} radius={radiusZone} />
    </section>
  );
}

export default Home;
