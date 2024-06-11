import cron from 'node-cron';
import WazeApiServices from '../services/WazeApi.service';
import { findOrCreateUserByName } from '../services/user.service';
import {createReport} from '../services/report.service';
import { IReportRequest } from 'interfaces/reports.interface';


const startWazeCronJob = () => {
    const cronJob = cron.schedule(process.env.CRON_TIME_WAZE as string, async () => {
        try {
            const user = await findOrCreateUserByName("Waze");
            const response = await WazeApiServices(); 
            const alerts = Array.isArray(response) ? response : response.alerts || [];
            for (const alert of alerts) {
                const newReport: IReportRequest = {
                    content: traducirCategoriaWaze(alert.type, alert.subtype), 
                    images: '', 
                    categoryId: '3', 
                    latitude: alert.location.y.toString(),
                    longitude: alert.location.x.toString(),
                    idApi: alert.id
                    
                };
                createReport(newReport);
             
            }
            
        } catch (error) {
            console.error('An error occurred while fetching Waze traffic data:', error);
        }
    });
    cronJob.start();

    console.log('Waze cron job started');
};

function traducirCategoriaWaze(type: string, subtype: string) {
    if (type === 'HAZARD' && subtype) {
        switch (subtype) {
            case 'HAZARD_ON_ROAD_POT_HOLE':
                return 'Bache en la carretera';
            case 'HAZARD_ON_SHOULDER':
                return 'Peligro en el arcén';
            case 'HAZARD_ON_ROAD_OBJECT':
                return 'Objeto en la carretera';
            case 'HAZARD_ON_ROAD_ROAD_KILL':
                return 'Animal muerto en la carretera';
            case 'HAZARD_ON_ROAD_CAR_STOPPED':
                return 'Coche detenido en la carretera';
            case 'HAZARD_WEATHER':
                return 'Condiciones meteorológicas peligrosas';
            case 'HAZARD_ON_ROAD_CONSTRUCTION':
                return 'Trabajo en la carretera';
            case 'HAZARD_ON_ROAD_ROAD_CLOSED':
                return 'Carretera cerrada';
            case 'HAZARD_ON_ROAD_LANE_CLOSED':
                return 'Carril cerrado';
            case 'HAZARD_ON_SHOULDER_CAR_STOPPED':
                return 'Coche detenido en el arcén';
            case 'HAZARD_ON_SHOULDER_ANIMALS':
                return 'Animales en el arcén';
            case 'HAZARD_ON_SHOULDER_MISSING_SIGN':
                return 'Señal faltante en el arcén';
            case 'HAZARD_ON_SHOULDER_MISSING_LIGHTS':
                return 'Luces faltantes en el arcén';
            case 'HAZARD_ON_ROAD_OIL':
                return 'Aceite en la carretera';
            case 'HAZARD_ON_ROAD_ICE':
                return 'Hielo en la carretera';
            case 'HAZARD_ON_ROAD_LANE_REMOVED':
                return 'Carril eliminado en la carretera';
            case 'HAZARD_ON_SHOULDER_ROAD_KILL':
                return 'Animal muerto en el arcén';
            case 'HAZARD_ON_ROAD_STOP_SIGN_MISSING':
                return 'Señal de alto faltante en la carretera';
            case 'HAZARD_ON_SHOULDER_ROAD_KILL':
                return 'Animal muerto en el arcén';
            case 'HAZARD_ON_ROAD_SNOW':
                return 'Nieve en la carretera';
            case 'HAZARD_ON_ROAD_ICE':
                return 'Hielo en la carretera';
            case 'HAZARD_ON_ROAD_WATER':
                return 'Agua en la carretera';
            case 'HAZARD_ON_SHOULDER_ROCKS':
                return 'Rocas en el arcén';
            case 'HAZARD_ON_SHOULDER_CAR_STOPPED_SHOULDER':
                return 'Coche detenido en el arcén';
            case 'HAZARD_ON_SHOULDER_CONSTRUCTION':
                return 'Trabajo en el arcén';
            case 'HAZARD_ON_ROAD_LANE_MAINTENANCE':
                return 'Mantenimiento del carril en la carretera';
            case 'HAZARD_ON_ROAD_POT_HOLE':
                return 'Bache en la carretera';
            case 'HAZARD_ON_ROAD_ROAD_DAMAGE':
                return 'Daño en la carretera';
            case 'HAZARD_ON_SHOULDER_ABANDONED_VEHICLE':
                return 'Vehículo abandonado en el arcén';
            case 'HAZARD_ON_SHOULDER_MISSING_COVER':
                return 'Tapa faltante en el arcén';
            case 'HAZARD_ON_SHOULDER_POT_HOLE':
                return 'Bache en el arcén';
            case 'HAZARD_ON_SHOULDER_LANE_MAINTENANCE':
                return 'Mantenimiento del carril en el arcén';
            case 'HAZARD_ON_ROAD_LANE_REPAIRED':
                return 'Carril reparado en la carretera';
            case 'HAZARD_ON_ROAD_ANIMALS':
                return 'Animales en la carretera';
            case 'HAZARD_ON_ROAD_FIRE':
                return 'Fuego en la carretera';
            case 'HAZARD_ON_SHOULDER_FLOODING':
                return 'Inundación en el arcén';
            case 'HAZARD_ON_ROAD_FLOODING':
                return 'Inundación en la carretera';
            case 'HAZARD_ON_ROAD_ROCKS':
                return 'Rocas en la carretera';
            case 'HAZARD_ON_ROAD_CAR_STOPPED_RIGHT_SHOULDER':
                return 'Coche detenido en el arcén derecho';
            case 'HAZARD_ON_ROAD_CAR_STOPPED_LEFT_SHOULDER':
                return 'Coche detenido en el arcén izquierdo';
            case 'HAZARD_ON_SHOULDER_ROAD_CLOSED':
                return 'Carretera cerrada en el arcén';
            case 'HAZARD_ON_ROAD_LANE_CLOSED_ROAD_CLOSED':
                return 'Carril cerrado en la carretera';
            case 'HAZARD_ON_ROAD_CONSTRUCTION_LEFT_LANE':
                return 'Construcción en el carril izquierdo de la carretera';
            default:
                return 'Tipo de reporte desconocido';
        }
    }

    switch (type) {
        case 'ACCIDENT':
            return 'Accidente';
        case 'HAZARD':
        case 'HAZARD_ON_ROAD':
            return 'Peligro en la carretera';
        case 'ROAD_CLOSED':
            return 'Carretera cerrada';
        case 'CONSTRUCTION':
            return 'Construcción';
        case 'WEATHER':
            return 'Clima adverso';
        case 'TRAFFIC_JAM':
            return 'Congestión de tráfico';
        case 'POLICE':
            return 'Presencia policial';
        default:
            return 'Tipo de reporte desconocido';
    }
}





export default startWazeCronJob;
