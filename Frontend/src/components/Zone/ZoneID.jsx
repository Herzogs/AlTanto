import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../Map/Map.jsx";
import { useStore } from "@/store";
import useReports from "@/hook/useReports";

//TODO EMPROLIJAR

function ZoneHome() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRadiusZone
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zona, setZona] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchZone = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/zones/${id}`);
        console.log(response);
        if (!response.ok) {
          setError("No se pudo obtener la zona");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchZone().then((data) => {
      setRadiusZone(data.radio);
      setUserLocation({
        lat: data.location.latitude,
        lng: data.location.longitude,
      });
      setZona(data)
      setIsLoading(false);
    });
  }, [id]);

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="container_home">
      <div className="top-section">
        <h2 className="text-center w-100">{zona.name}</h2>
      </div>
      <div className="bottom-section">
        <Map userLocation={userLocation} radius={radiusZone} />

      </div>
    </section>
  );
}

export default ZoneHome;
