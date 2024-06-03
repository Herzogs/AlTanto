// src/models/SubtesAlerta.Mode.ts
import ColectivosCapitalApiServices from '../services/ColectivosCapitalApiServices';
import { TipoNotificacionRepository } from '../repositories/TipoNotificacionRepository';
import { AlertaRepository } from '../repositories/AlertaRepository';

// const arraySinPRoblemas =  {"_entity":[],"_header":{"_gtfs_realtime_version":"1.0","_incrementality":0,"_timestamp":1717427291,"extensionObject":null},"extensionObject":null} ;
async function initializeColectivosAlertaModel(tipoNotificacionRepo: TipoNotificacionRepository , alertaRepository: AlertaRepository ) {

    try {
        const data = await ColectivosCapitalApiServices();
        const entity = obtenerArrayEntity(data);
        if (entity) {
            for (const item of entity) {
                // no existen alertas  por el momento, asi que no puedo saber que retgresa
/*                 const identificador=item.id;
                const descripcionSubte= item.alert.informed_entity[0].route_id; // son dos datos diferentes
                const descripcionAlerta= item.alert.description_text.translation[0].text;
                let idTipoNotificacion = await tipoNotificacionRepo.findByIdentifier(item.id);               
                if (!idTipoNotificacion) {
                    idTipoNotificacion = await tipoNotificacionRepo.create(identificador, descripcionSubte ,"subte")
                } 
                alertaRepository.crearOActualziarFEchaSiExiste(idTipoNotificacion, descripcionAlerta);
                 */
            }
        }
    } catch (error) {
        console.error('Error al inicializar el modelo de alertas de Colectivos:', error);
        // throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
}


function obtenerArrayEntity(data: any): any[] | null {
    if (data && Array.isArray(data.entity)) {
        return data.entity;
    } else {
        return null;
    }
}

export default initializeColectivosAlertaModel;

