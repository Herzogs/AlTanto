import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "@components/Map/Map.jsx";
import { useStore } from "@store";
import useReports from "@hook/useReports";
import getZone from "@services/getZone";
import { Modal, Button } from "react-bootstrap";

//TODO EMPROLIJAR

function ZoneHome() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRadiusZone
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [zona, setZona] = useState({});
  const { id } = useParams();

  useEffect(() => {

    try {
      if (!id) throw new Error("El id de la zona no es válido");
      getZone(id).then((data) => {
        setRadiusZone(data.radio);
        setUserLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });
        setZona(data)
      }).catch((error) => {
        setError(error.message);
        setShowModal(true);
      });
    } catch (error) {
      setError(error.message);
      setShowModal(true);
    }
  }, [id, setRadiusZone]);

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  const handleClose = () => {
    setShowModal(false);
}


  return (
    <section className="container_home">
      <div className="top-section">
        <h2 className="text-center w-100">{zona.name}</h2>
      </div>
      <div className="bottom-section">
        <Map userLocation={userLocation} radius={radiusZone} />
      </div>
      {!error && (<Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>)}
    </section>
  );
}

export default ZoneHome;
