import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../Map/Map";

function ZoneHome() {
    const [localization, setLocalization] = useState({ lat: 0, lng: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [zona, setZona] = useState({});
    const { id } = useParams();

    

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/zone/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener la zona");
                }
                const data = await response.json();
                const { latitude, longitude } = data.zone.Location;
                if (latitude && longitude) {
                    const arr = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
                    setZona(data.zone);
                    return arr;
                } else {
                    throw new Error("Ubicación no válida");
                }
            } catch (error) {
                console.error(error);
                return { lat: 0, lng: 0 };
            }
        };
        fetchZone().then((data) => {
            setLocalization(data);
            setIsLoading(false);
        });
    }, [id]);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className="text-center">Mis Zonas - {zona.name}</h1>
            <Map localization={localization} />
        </div>
    );
}

export default ZoneHome;