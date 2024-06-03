// src/models/SubtesAlerta.Mode.ts
import SubtesApiServices from '../services/SubtesApiServices';
import { TipoNotificacionRepository } from '../repositories/TipoNotificacionRepository';
import { AlertaRepository } from '../repositories/AlertaRepository';


async function initializeSubtesAlertaModel(tipoNotificacionRepo: TipoNotificacionRepository , alertaRepository: AlertaRepository ) {

    try {
        const data = await SubtesApiServices();
        const entity = obtenerArrayEntity(data);
        if (entity) {
            for (const item of entity) {
                const identificador=item.id;
                const descripcionSubte= item.alert.informed_entity[0].route_id; // son dos datos diferentes
                const descripcionAlerta= item.alert.description_text.translation[0].text;
                let idTipoNotificacion = await tipoNotificacionRepo.findByIdentifier(item.id);               
                if (!idTipoNotificacion) {
                    idTipoNotificacion = await tipoNotificacionRepo.create(identificador, descripcionSubte ,"subte")
                } 
                alertaRepository.crearOActualziarFEchaSiExiste(idTipoNotificacion, descripcionAlerta);
                
            }
        }
    } catch (error) {
        console.error('Error al inicializar el modelo de alertas de subtes:', error);
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

export default initializeSubtesAlertaModel;
