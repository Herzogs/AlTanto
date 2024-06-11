// models/TraficoWazeApiServices.ts
import axios from 'axios';

const areas = [
    'top=-34.6255281406868&bottom=-34.66556491390973&left=-58.601911067962654&right=-58.534705638885505',
     'top=-34.657728549266615&bottom=-34.69774977125423&left=-58.59259843826295&right=-58.52539300918579',
    'top=-34.65783445102913&bottom=-34.69785562185051&left=-58.6731505393982&right=-58.60594511032105',
    'top=-34.62609316788394&bottom=-34.66612966833505&left=-58.66924524307252&right=-58.60203981399537'  
];

const env = 'row';
const types = 'alerts';

async function obtenerDatosDeAPI(area: string) {
    const url = `https://www.waze.com/live-map/api/georss?${area}&env=${env}&types=${types}`;
    
    try {
        const respuesta = await axios.get(url);
        return respuesta.data;
    } catch (error) {
        throw new Error(`Error al obtener datos de la API Waze: ${error}`);
    }
}

async function TraficoWazeApiServices() {
    const allAlerts = []; // Array para almacenar todos los alertas
    try {
        for (const area of areas) {
            const data = await obtenerDatosDeAPI(area); // Obtener datos para cada área
            if (data.alerts) {
                allAlerts.push(...data.alerts); // Si hay alertas, agregar cada uno al array
            }
        }
        return { alerts: allAlerts }; // Devolver un objeto que contiene todos los alertas
    } catch (error) {
        console.log("Error en TraficoWazeApiServices: " + error);
        return allAlerts;
    }
}



export default TraficoWazeApiServices;
