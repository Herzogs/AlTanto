import axios from "axios";
import { getReportsBy } from "@services/getReportsByLocationAndRadius";

const apiKey = import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY;

const fetchReports = async (routeCoordinates, numSegments) => {
    console.log(routeCoordinates);
    const arrayOfReports = [];
    const uniqueIds = new Set();
    const segmentSize = Math.ceil(routeCoordinates.length / numSegments);
    console.log(segmentSize);
    for (let i = 0; i < routeCoordinates.length; i += segmentSize) {
        const startCoordinate = routeCoordinates[i];
        const endCoordinateIndex = Math.min(i + segmentSize - 1, routeCoordinates.length - 1);
        const endCoordinate = routeCoordinates[endCoordinateIndex];
        console.log(startCoordinate, endCoordinate);
        if (!endCoordinate) {
            console.error(`Invalid endCoordinate at index: ${endCoordinateIndex}`);
            continue;
        }
        const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinate[1]},${startCoordinate[0]}&end=${endCoordinate[1]},${endCoordinate[0]}`);
        if(response.status !== 200) {
            throw new Error(`Failed to fetch route segment ${i} to ${endCoordinateIndex}`);
        }
        const data = response.data;

        // Obtener los puntos intermedios de la geometría de la ruta
        const intermediatePoints = data.features[0].geometry.coordinates;

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
    console.log(arrayOfReports);
    return arrayOfReports;
};

export { fetchReports };
