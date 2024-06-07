import { getReportsBy } from "@services/getReportsByLocationAndRadius";

function dividirEnSegmentos(arr, tamanoSegmento) {
    let segmentos = [];
    for (let i = 0; i < arr.length; i += tamanoSegmento) {
        segmentos.push(arr.slice(i, i + tamanoSegmento));
    }
    return segmentos;
}

function obtenerElementosAlAzar(segmento, cantidad) {
    let resultado = [];
    let indicesSeleccionados = new Set();

    while (resultado.length < cantidad && indicesSeleccionados.size < segmento.length) {
        let indiceAleatorio = Math.floor(Math.random() * segmento.length);
        if (!indicesSeleccionados.has(indiceAleatorio)) {
            indicesSeleccionados.add(indiceAleatorio);
            resultado.push(segmento[indiceAleatorio]);
        }
    }
    return resultado;
}

const fetchReports = async (routeCoordinates, numSegments) => {
    console.log("entre acá");
    console.log(routeCoordinates.length);
    console.log(numSegments);

    let segments = dividirEnSegmentos(routeCoordinates, numSegments);
    let puntosSeleccionados = segments.flatMap(segmento => obtenerElementosAlAzar(segmento, 3));

    const uniqueIds = new Set();
    const arrayOfReports = [];

    const fetchPromises = puntosSeleccionados.map(point => getReportsBy(point, 120));

    try {
        const reportsArray = await Promise.all(fetchPromises);
        
        for (const reports of reportsArray) {
            for (const report of reports) {
                if (!uniqueIds.has(report.id)) {
                    uniqueIds.add(report.id);
                    arrayOfReports.push(report);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching reports:", error);
    }

    return arrayOfReports;
};

export { fetchReports };
