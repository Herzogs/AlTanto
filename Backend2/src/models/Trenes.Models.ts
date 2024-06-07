// models/Trenes.Models.ts
import TrenesApiServices from "../services/TrenesApiServices";
import { TipoNotificacionRepository } from "../repositories/TipoNotificacionRepository";
import { AlertaRepository } from "../repositories/AlertaRepository";

import TipoNotificacionAtributes from "./TipoNotificacion";

async function EstadoDeLosTrenes(tipoNotificacionRepo: TipoNotificacionRepository, alertaRepository: AlertaRepository) {

    try {
        const data = await TrenesApiServices();
        if (data) {
            for (const item of data) {
                const tipoAlerta = await TipoNotificacionAtributes.create({
                    identificador: item.name,
                    descripcion: item.name,
                    grupo: "Trenes"
                });
                 let idTipoNotificacion = await tipoNotificacionRepo.create(item.name , item.name, "Trenes" );
                //tipoNotificacionRepo.createFromAttributes(tipoAlerta);                          
            }

            for (const item of data) {      
                if(item.alerts){
                    const id = await tipoNotificacionRepo.findByIdentifier(item.name);                
                    
                    for (const alerta of item.alerts){                      
                        const mensaje = alerta.message.slice(0, 1000);             
                       alertaRepository.crearOActualziarFEchaSiExiste(id, mensaje);// nose porque el id no anda
                    }  
                }
            }       
        } 
    }catch (error) {
            console.error('Error en Trenes.Models:', error);
            throw error;
        }
    } 

export default EstadoDeLosTrenes;
