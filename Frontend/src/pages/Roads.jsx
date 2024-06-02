import { useEffect } from "react";
import { useStore } from "@store";
import Map from "@components/Map/Map";
import { getReportsBy } from "@services/getReportsByLocationAndRadius";


function Roads() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    routingMode,
    setRoutingMode,
    setStartPoint,
    setEndPoint,
    routeCoordinates,
    setReports,
    setRouteCoordinates,
  } = useStore();

  useEffect(() => {
    setUserLocation(null);
    setStartPoint(null)
    setEndPoint(null)
    setRoutingMode(true);
    setReports([]);
    setRouteCoordinates(null);
  }, []);

  const apiKey = import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY;

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length >= 1) {
      const arrayOfReports = [];
      const uniqueIds = new Set();
      const segmentSize =  routeCoordinates.length / 2;

      setUserLocation({ lat: routeCoordinates[0][0], lng: routeCoordinates[0][1] });

      const fetchReports = async () => {
        for (let i = 0; i < routeCoordinates.length; i += segmentSize) {
          const startCoordinate = routeCoordinates[i];
          const endCoordinate = routeCoordinates[Math.min(i + segmentSize, routeCoordinates.length - 1)];

          const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinate[1]},${startCoordinate[0]}&end=${endCoordinate[1]},${endCoordinate[0]}`);
          const data = await response.json();
          
          // Obtener los puntos intermedios de la geometría de la ruta
          const intermediatePoints = data.features[0].geometry.coordinates
          

          // Hacer consultas al backend para cada punto intermedio optimizado
          for (const point of intermediatePoints) {
            const lat = point[1];
            const lng = point[0];
            const reports = await getReportsBy({ lat, lng }, 200);

            // Filtrar reportes únicos antes de agregarlos al array
            reports.forEach(report => {
              if (!uniqueIds.has(report.id)) {
                uniqueIds.add(report.id);
                arrayOfReports.push(report);
              }
            });
          }
        }
        setReports(arrayOfReports);
      };

      fetchReports();
    }
  }, [routeCoordinates]);



  return (
    <section className="container_home">
        <Map
          userLocation={userLocation}
          radius={radiusZone}
          routingMode={routingMode}
        />
    </section>
  
  );
}

export default Roads;
