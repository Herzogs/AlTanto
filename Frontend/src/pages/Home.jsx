import { Container } from "react-bootstrap";
import { useStore } from "../store/index";
import MapComponent from "../components/map/MapComponent";

function Home() {
  const {
    routingMode,
    setRoutingMode,
    setStartPoint,
    setEndPoint,
    setReports,
  } = useStore();

  const handleToggleRoutingMode = () => {
    setRoutingMode(!routingMode);
    setStartPoint(null);
    setEndPoint(null);
    setReports([]);
  };

  return (
    <section className="container_home">
      <MapComponent />
    </section>
  );
}

export default Home;
