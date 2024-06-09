import { useEffect, useState } from "react";
import { useStore } from "@store";
import Map from "@components/Map/Map";
import { Container } from "react-bootstrap";
import { fetchReports } from "@services/getReportsInRoutings";
import { getDataOfRoadById } from "@services/getRoutesByUser";
import ModalAT from "@components/modal/ModalAT";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import { formatDuration, formatDistance } from "@/utilities/conversion"
import CategoryFilter from "@components/Map/CategoryFilter";

function RoadID() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [addressOrigin, setAddressOrigin] = useState(null);
  const [addressDestination, setAddressDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [name, setName] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const { id } = useParams();
  const { routeCoordinates, setRouteCoordinates, userLocation, setUserLocation, setReports } = useStore();

  useEffect(() => {
    setReports([]);
    setRouteCoordinates([]);
  }, [setReports, setRouteCoordinates]);

  useEffect(() => {
    if (!origin && !destination) {
      const getData = async () => {
        try {
          const data = await getDataOfRoadById(id);
          if (!data) {
            throw new Error("No se encontraron datos");
          }
          
          setName(data.name);
          setOrigin(data.origin);
          setAddressOrigin(data.addressOrigin);
          setAddressDestination(data.addressDestiny);
          setDestination(data.destination);
          setDistance(data.distance);
          setDuration(data.duration);

          const plan = new L.Routing.Plan([
            L.latLng(data.origin.latitude, data.origin.longitude),
            L.latLng(data.destination.latitude, data.destination.longitude),
          ]);

          const routeControl = L.Routing.control({
            plan: plan            
          });

          routeControl.on('routesfound', (e) => {
            const routes = e.routes[0];
            setRouteCoordinates(routes.coordinates);
          });


          routeControl.route(); // Ejecuta el cálculo de la ruta

        } catch (error) {
          setShowModal(true);
          setModalTitle("Error");
          console.log("Error ====> ", error.message);
          setModalContent(error.message);
        }
      };

      getData();
    }
  }, [id, origin, destination, setRouteCoordinates]);

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      setUserLocation(routeCoordinates[0]);
      fetchReports(routeCoordinates, 4)
        .then((reports) => {
          setReports(reports);
        })
        .catch((error) => {
          setShowModal(true);
          setModalTitle("Error");
          setModalContent(error.message);
        });
    }
  }, [routeCoordinates, setUserLocation, setReports]);


  return (
    <section className="container_home">
      <Container fluid className="h-100">
        <h3 className="my-4 text-center">Recorridos</h3>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <h5>Nombre: {name}</h5>
            <h5>Origen: {addressOrigin}</h5>
            <h5>Destino: {addressDestination}</h5>
            <h5>Distancia: {formatDistance(distance)}</h5>
            <h5>Duración: {formatDuration(duration)}</h5>
          </div>
        </div>
        {origin && destination && (
          <div className="h-map pb-footer">
            <Map
              userLocation={userLocation}
              radiusZone={500}
              startPoint={{lat: origin.latitude, lon: origin.longitude}}
              endPoint={{lat: destination.latitude, lon: destination.longitude}}
              zoneMode={true}
              routingMode={true}
              CategoryFilterComponent={CategoryFilter}
            />
          </div>
        )}
        <ModalAT
          title={modalTitle}
          message={modalContent}
          showModal={showModal}
          setShowModal={setShowModal}
         url="/recorridos"
        />
      </Container>
    </section>
  );
}

export default RoadID;
