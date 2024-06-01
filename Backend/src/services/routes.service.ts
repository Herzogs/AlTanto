import * as reportRepository from '../repository/reports.repository';
import RBush from 'rbush';

// Función para calcular la distancia de un punto a un segmento de línea
const pointToSegmentDistance = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy) * 111320; // Convertir grados a metros
};


const getReportsIntoRoutes = async (arrayOfCoordinates: [], threshold: number) => {
    console.log(" Serivce getReportsIntoRoutes");
    const reports = await reportRepository.default.getAll();
    
    // Crear una instancia de RBush
    const tree = new RBush();

    // Insertar los reportes en el RBush
    const items = reports.map(report => ({
        minX: report.getDataValue('Location').longitude,
        minY: report.getDataValue('Location').latitude,
        maxX: report.getDataValue('Location').longitude,
        maxY: report.getDataValue('Location').latitude,
        id: report.getDataValue('Location').id,
        lat: report.getDataValue('Location').latitude,
        lng: report.getDataValue('Location').longitude,
        data: report
    }));

    console.log("Items");
    console.log(items);
    tree.load(items);

    // Calcular el bounding box de la ruta más el umbral
    let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
    arrayOfCoordinates.forEach(({ lat, lng }: { lat: number, lng: number }) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
    });
    const bbox = {
        minX: minLng - threshold,
        minY: minLat - threshold,
        maxX: maxLng + threshold,
        maxY: maxLat + threshold
    };

    // Buscar los reportes dentro del bounding box
    const candidates = tree.search(bbox);
    console.log("Candidatos");
    console.log(candidates);

    // Filtrar los reportes candidatos cercanos a la ruta
    const filteredReports = candidates.filter(report => {
        console.log(report);
        for (let i = 0; i < arrayOfCoordinates.length - 1; i++) {
            const p1 = arrayOfCoordinates[i];
            const p2 = arrayOfCoordinates[i + 1];
            const distance = pointToSegmentDistance(report.latitude, report.longitude, p1.latitude, p1.longitude, p2.latitude, p2.longitude);
            if (distance < threshold) return true;
        }
        return false;
    });

    return filteredReports;
}

export { getReportsIntoRoutes };
