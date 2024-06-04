import { useEffect, useState } from "react";
import { useStore } from "@store";
import Map from "@components/Map/Map";
import { Container } from "react-bootstrap";
import { fetchReports } from "@services/getReportsInRoutings.js";
import ModalAT from "@components/modal/ModalAT";

function Roads() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

  const {
    userLocation,
    setUserLocation,
    radiusZone,
    routingMode,
    setRoutingMode,
    setStartPoint,
    setEndPoint,
    routeCoordinates,
    setReports,
    setRouteCoordinates
  } = useStore();

  useEffect(() => {
    setUserLocation(null);
    setStartPoint(null);
    setEndPoint(null);
    setRoutingMode(true);
    setReports([]);
    setRouteCoordinates(null);
  }, []);



  useEffect(() => {
    if (routeCoordinates) {
      setUserLocation({ lat: routeCoordinates[0][0], lng: routeCoordinates[0][1] });
      fetchReports(routeCoordinates, 4).then((reports) => {
        setReports(reports);
      }).catch((error) => {
        setShowModal(true);
        setModalTitle("Error");
        setModalContent(error.message);
      });
    }
  }, [routeCoordinates]);



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

        <ModalAT
          title={modalTitle}
          message={modalContent}
          showModal={showModal}
          setShowModal={setShowModal}
          url="/"
        />
      </Container>
    </section>

  );
}

export default Roads;
