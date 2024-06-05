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

    while (resultado.length < cantidad) {
        let indiceAleatorio = Math.floor(Math.random() * segmento.length);
        if (!indicesSeleccionados.has(indiceAleatorio)) {
            indicesSeleccionados.add(indiceAleatorio);
            resultado.push(segmento[indiceAleatorio]);
        }
    }

    

    return resultado;
}

const fetchReports = async (routeCoordinates, numSegments) => {
    
    let segments = dividirEnSegmentos(routeCoordinates, numSegments);
    let resultadoFinal = segments.map(segmento => obtenerElementosAlAzar(segmento, 3));
    
    const uniqueIds = new Set();
    const arrayOfReports = [];
    const arrayOfPoints = [];
    // Hacer consultas al backend para cada punto intermedio optimizado
    for (const point of resultadoFinal) {
        point.forEach(p => {
    
            arrayOfPoints.push(p);
        });
    }

    for (const point of arrayOfPoints) {


        
        
        const reports = await getReportsBy(point, 200);

        // Filtrar reportes únicos antes de agregarlos al array
        reports.forEach(report => {

            if (!uniqueIds.has(report.id)) {
                uniqueIds.add(report.id);
                arrayOfReports.push(report);
            }
        });
    }
    
    return arrayOfReports;
};

export { fetchReports };
