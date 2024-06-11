/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import { useStore } from "@store";
import useReports from "@hook/useReports";
import {getZone} from "@services/getZone";
import "./styles.css";

function ZoneHome() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRadiusZone,
    setMarkerPosition,
    reports,
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zona, setZona] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchZoneData = async () => {
      try {
        if (!id) throw new Error("El id de la zona no es válido");
        setMarkerPosition(null);
        const data = await getZone(id);
        setRadiusZone(data.radio);
        setUserLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });
        setZona(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setShowModal(true);
      }
    };

    fetchZoneData();
  }, [id]);

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  return (
    <>
      {!loading && (
        <section className="w-100 h-100">
          <HeaderHome />
          <h2 className="float-title">{zona.name}</h2>
          {id && <Aside />}
          <Map
            key={`${userLocation.lat}-${userLocation.lng}`}  // Añadir key para forzar re-renderizado
            userLocation={userLocation}
            radiusZone={radiusZone}
            showFilters={true}
            mapClick={true}
            noCircle={false}
          />
          {reports && reports.length > 0 && <SliderButton />}
          {!error && (
            <ModalAT
              title="Encontramos un error"
              message={error}
              showModal={showModal}
              handleClose={() => navigate("/")}
              handleAccept={() => navigate("/")}
            />
          )}
        </section>
      )}
    </>
  );
}

export default ZoneHome;
