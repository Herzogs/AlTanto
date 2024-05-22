import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../components/Map";

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
                const response = await fetch(`http://localhost:3000/api/zone/${id}`);
                if (!response.ok) {
                    setError("No se pudo obtener la zona");
                }
                const data = await response.json();
                return data.zone
            } catch (error) {
                setError(error.message);
                console.error(error);
            }
        };

        fetchZone().then((data) => {
            console.log(data.Location);
            setZona(data);
            setLocalization({ lat: data.Location.latitude, lon: data.Location.longitude });
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
        <div>
            <h1 className="text-center">Mis Zonas - {zona.name}</h1>
            <Map localization={localization} radius={zona.radio} />
        </div>
    );
}

export default ZoneHome;