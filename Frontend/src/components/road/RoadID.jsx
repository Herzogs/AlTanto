/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map.jsx";
import Aside from "@components/aside/Aside";
import SliderButton from "@components/slider/SliderButton";
import { useParams } from "react-router-dom";
import { useStore } from "@store";
import { fetchReports } from "@services/getReportsInRoutings";
import { getDataOfRoadById } from "@services/getRoutesByUser";
import { formatDistance } from "@/utilities/conversion";
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoadID() {
  const [road, setRoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();

  const {
    routeCoordinates,
    userLocation,
    setUserLocation,
    reports,
    setReports,
  } = useStore();

  const loadRoadData = useCallback(async () => {
    try {
      const data = await getDataOfRoadById(id);
      if (data.status !== 200) {
        setError(true);
        throw new Error("Hubo un error en el servidor");
      }

      if (data.data === "Road not found") {
        setError(true);
        throw new Error("No se encontraron datos");
      }
      setRoad(data.data);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setReports([]);
  }, [setReports]);

  useEffect(() => {
    if (id) {
      loadRoadData();
    }
  }, [id, loadRoadData]);

  useEffect(() => {
    if (!error && routeCoordinates && routeCoordinates.length > 0) {
      setUserLocation(routeCoordinates[0]);
      fetchReports(routeCoordinates, 4)
        .then(setReports)
        .catch((error) => {
          toast.error(error.message, {
            position: "top-right",
          });
        });
    }
  }, [error, routeCoordinates, setUserLocation, setReports]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <section className="w-100 h-100 roads-section">
      <HeaderHome />
      {!error && road && (
        <>
          <h2 className="float-title">{road.name}</h2>
          <div className="float-box">
            <p><strong>Origen:</strong> {road.addressOrigin}</p>
            <p><strong>Destino:</strong> {road.addressDestiny}</p>
            <p><strong>Distancia:</strong> {formatDistance(road.distance)}</p>
          </div>
        </>
      )}
      {id && <Aside />}
      <Map
        key={`${userLocation.lat}-${userLocation.lng}`}
        userLocation={!error ? road.origin : userLocation}
        startPoint={!error ? road.origin : null}
        endPoint={!error ? road.destination : null}
        zoneMode={true}
        routingMode={true}
        showFilters={true}
      />
      {!error && reports.length > 0 && <SliderButton />}
      <ToastContainer />
    </section>
  );
}

export default RoadID;
