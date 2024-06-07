import axios from 'axios';


interface Incident {
    incidentId: string;
    type: string;
    severity: string;
    verified: boolean;
    start: string;
    end: string;
    description: string;
    roadClosed: boolean;
    point: {
        coordinates: [number, number];
    };
    toPoint?: {
        coordinates: [number, number];
    };
    lane: string;
    roadName: string;
    intersection: string;
}

async function obtenerDatosDeAPI() {

    const Area = '-34.78712653421942,-58.83613518664739,-34.49876070617906,-58.22536601079223';
    const BingMapsAPIKey = process.env.API_BINGMAPKEY;
    const url = `http://dev.virtualearth.net/REST/v1/Traffic/Incidents/${Area}?key=${BingMapsAPIKey}`;
   
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
        return datos;
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

export {Incident}
export default TraficoBingApiServices;
