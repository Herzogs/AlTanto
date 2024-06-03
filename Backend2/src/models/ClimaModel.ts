// src/models/ClimaModel.ts
import ClimaHoyServices from '../services/ClimaHoyServices';
import ClimaMananaServices from '../services/ClimaMananaServices';
import {EstacionMeteorologicaRepository} from '../repositories/EstacionMeteorologicaRepository';
import  {EstacionInput}  from '../repositories/IEstacionMeteorologicaRepository';



async function initializeClimaClimaModel(estacionMeteorologicaRepository : EstacionMeteorologicaRepository) {

    try {
        const data = await ClimaHoyServices();
        if (data) {
            for (const item of data) {
                const dist = item.dist;
                const lid = item.lid;
                const fid=  item.fid;
                const int_number = item.int_number; // numero identificador del radar
                const name =  item.name; // localidad 0 ciudad
                const province = item.province; 
                const latitud = item.lat;
                const longitud = item.lon;
                const zoom = item.zoom;
                const newEstacion: EstacionInput = {
                    dist,
                    lid,
                    fid,
                    int_number,
                    name,
                    province,
                    latitud,
                    longitud,
                    zoom                   
                };                          
             estacionMeteorologicaRepository.create(newEstacion);
                         
                
            }
        } 
    } catch (error) {
        console.error('Error al inicializar el modelo de ClimaModel:', error);
        // throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
}



export default initializeClimaClimaModel;
