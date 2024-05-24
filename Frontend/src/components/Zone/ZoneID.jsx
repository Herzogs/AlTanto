import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../Map";

function ZoneHome() {
  const [localization, setLocalization] = useState({ lat: 0, lon: 0 });
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
      console.log(data.Location);
      setZona(data);
      setLocalization({
        lat: data.location.latitude,
        lon: data.location.longitude,
      });
      setIsLoading(false);
    });
  }, [id]);

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
        <Map localization={localization} radius={zona.radio} />
      </div>
    </section>
  );
}

export default ZoneHome;
