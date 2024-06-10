import { useEffect, useState } from "react";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import { useParams } from "react-router-dom";
import L from "leaflet";
import { useStore } from "@store";
import { fetchReports } from "@services/getReportsInRoutings";
import { getDataOfRoadById } from "@services/getRoutesByUser";
import { formatDuration, formatDistance } from "@/utilities/conversion";
import "leaflet-routing-machine";
import "./styles.css";

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
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const {
    routeCoordinates,
    setRouteCoordinates,
    userLocation,
    setUserLocation,
    reports,
    setReports,
  } = useStore();

  useEffect(() => {
    setReports([]);
    setRouteCoordinates([]);
  }, [setReports, setRouteCoordinates]);

  useEffect(() => {
    setLoading(true);
    setOrigin(null);
    setDestination(null);

    if (id) {
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
            plan: plan,
          });

          routeControl.on("routesfound", (e) => {
            const routes = e.routes[0];
            setRouteCoordinates(routes.coordinates);
          });

          routeControl.route(); // Ejecuta el cálculo de la ruta
          setLoading(false);
        } catch (error) {
          setShowModal(true);
          setModalTitle("Error");
          console.log("Error ====> ", error.message);
          setModalContent(error.message);
        }
      };

      getData();
    }
  }, [id]);

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
    <>
      {!loading && (
        <section className="w-100 h-100 roads-section">
          <HeaderHome />
          <h2 className="zone-title">{name}</h2>
          {id && <Aside />}

          {origin && destination && (
            <Map
              key={`${userLocation.lat}-${userLocation.lng}`}
              userLocation={userLocation}
              startPoint={{ lat: origin.latitude, lon: origin.longitude }}
              endPoint={{
                lat: destination.latitude,
                lon: destination.longitude,
              }}
              zoneMode={true}
              routingMode={true}
              showFilters={true}
            />
          )}
          {reports && reports.length > 0 && <SliderButton />}
          <ModalAT
            title={modalTitle}
            message={modalContent}
            showModal={showModal}
            setShowModal={setShowModal}
            url="/recorridos"
          />
        </section>
      )}
    </>

    /*  
          <div className="d-flex flex-column">
            <h5>Nombre: {name}</h5>
            <h5>Origen: {addressOrigin}</h5>
            <h5>Destino: {addressDestination}</h5>
            <h5>Distancia: {formatDistance(distance)}</h5>
            <h5>Duración: {formatDuration(duration)}</h5>
          </div>
        */
  );
}

export default RoadID;
