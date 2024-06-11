import { useEffect, useState } from "react";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import { useParams } from "react-router-dom";
import { useStore } from "@store";
import { fetchReports } from "@services/getReportsInRoutings";
import { getDataOfRoadById } from "@services/getRoutesByUser";
import { formatDistance } from "@/utilities/conversion";

import "./styles.css";

function RoadID() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [addressOrigin, setAddressOrigin] = useState(null);
  const [addressDestination, setAddressDestination] = useState(null);
  const [distance, setDistance] = useState(0);

  const [name, setName] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const {
    routeCoordinates,
    userLocation,
    setUserLocation,
    reports,
    setReports,
  } = useStore();

  useEffect(() => {
    setReports([]);

  }, [setReports]);

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

          setLoading(false);
        } catch (error) {
          setShowModal(true);
          setModalTitle("Error");
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
          <h2 className="float-title">{name}</h2>
          <div className="float-box">
            <p><strong>Nombre:</strong> {name}</p>
            <p><strong>Origen:</strong> {addressOrigin}</p>
            <p><strong>Destino:</strong> {addressDestination}</p>
            <p><strong>Distancia:</strong> {formatDistance(distance)}</p>
          </div>
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
  );
}

export default RoadID;
