/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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

  console.log(id);
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
    setRoad(null);

    if (id) {

      const getData = async () => {
        try {
          const data = await getDataOfRoadById(id);
          console.log("DATA ROAD ", data)
          if (data.status !== 200) {
            setError(true)
            throw new Error("Hubo un error en el serivdor");
          }

          if (data.data === "Road not found") {
            setError(true)
            throw new Error("No se encontraron datos");
          }
          console.log(data.data)
          setRoad(data.data);
          console.log(road)
          console.log(!error)
        } catch (error) {
          console.log(error.message)
          toast.error(error.message, {
            position: "top-right",
          });
        } finally {
          
          setLoading(false);
          
        }
      }

      getData();
    }
  }, [id]);

  useEffect(() => {
    if (error !== true && routeCoordinates && routeCoordinates.length > 0) {
      setUserLocation(routeCoordinates[0]);
      fetchReports(routeCoordinates, 4)
        .then((reports) => {
          setReports(reports);
        })
        .catch((error) => {
          console.log(error.message)
          toast.error(error.message, {
            position: "top-right",
          });
        });
    }
  }, [routeCoordinates, setUserLocation, setReports]);

  return (
    <>
      {!loading && (
        <section className="w-100 h-100 roads-section">
          <HeaderHome />

          {!error && (
            <>
              <h2 className="float-title">{road.name}</h2>
              <div className="float-box">
                <p><strong>Origen:</strong> {road.addressOrigin}</p>
                <p><strong>Destino:</strong> {road.addressDestination}</p>
                <p><strong>Distancia:</strong> {formatDistance(road.distance)}</p>
              </div>
            </>)}

          {id && <Aside />}

          
            <Map
              key={`${userLocation.lat}-${userLocation.lng}`}
              userLocation={!error ? road.origin: userLocation}
              startPoint={!error ? road.origin: null}
              endPoint={!error ? road.destination: null}
              zoneMode={true}
              routingMode={true}
              showFilters={true}
            />
          {!error && reports && reports.length > 0 && <SliderButton />}
          <ToastContainer />
        </section>
      )}
    </>
  );
}

export default RoadID;
