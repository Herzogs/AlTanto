import axios from 'axios';


async function obtenerDatosDeAPI() {

    const Area = '-34.78712653421942,-58.83613518664739,-34.49876070617906,-58.22536601079223';
    const BingMapsAPIKey = process.env.API_BINGMAPKEY;
    const url = `http://dev.virtualearth.net/REST/v1/Traffic/Incidents/${Area}?key=${BingMapsAPIKey}`;
    console.log("url "+ url);
   
    try {
        const respuesta = await axios.get(url);
        return respuesta.data;
    } catch (error) {
        throw new Error(`Error al obtener datos de la API Bing: ${error}`);
    }
}

async function TraficoBingApiServices() {
    try {
        const data = await obtenerDatosDeAPI();
        const datos = await validarRespuesta(data);   
        if (data.resourceSets && data.resourceSets.length > 0) {
            const incidents = data.resourceSets[0].resources;
            incidents.forEach((incident: { incidentId: any; type: any; severity: any; verified: any; start: any; end: any; description: any; roadClosed: any; point: { coordinates: any; }; toPoint: { coordinates: any; }; lane: any; roadName: any; intersection: any; }) => {
                console.log('ID del incidente:', incident.incidentId);
                console.log('Tipo de incidente:', incident.type);
                console.log('Gravedad:', incident.severity);
                console.log('Verificado:', incident.verified);
                console.log('Inicio:', incident.start);
                console.log('Fin:', incident.end);
                console.log('Descripción:', incident.description);
                console.log('Carretera cerrada:', incident.roadClosed);
                console.log('Coordenadas:', incident.point.coordinates);
                if (incident.toPoint) {
                    console.log('Coordenadas finales:', incident.toPoint.coordinates);
                }
                console.log('Carril afectado:', incident.lane);
                console.log('Nombre de la carretera:', incident.roadName);
                console.log('Intersección:', incident.intersection);
                console.log('---------------------------------------------');
            });
        } else {
            console.log("No se encontraron incidentes de tráfico.");
        }
    } catch (error) {
        manejarError(error);
    }
}

/* 1: Accident
- 2: Congestion
- 3: DisabledVehicle
- 4: MassTransit
- 5: Miscellaneous
- 6: OtherNews
- 7: PlannedEvent
- 8: RoadHazard
- 9: Construction
- 10: Alert
- 11: Weather */



function validarRespuesta(data : any) {
    if (!data) {
        throw new Error('Error: La respuesta es nula o indefinida');
    }

    if (data.statusCode !== 200) {
        throw new Error(`Error: Estado de respuesta no es 200 OK (${data.statusCode})`);
    }

    return data.resourceSets;
}

function manejarError(error:any) {
    console.error('Error en :', error);
    process.exit(1);
}

export default TraficoBingApiServices;
