// src/models/BingMap.Model.ts

import TraficoBingApiServices from '../services/TraficoBingApiServices';
import {Incident} from '../services/TraficoBingApiServices';
import  AlertaRepository  from '../../../Backend/src/repository/reports.repository';


async function CargarBingMap( ) {

    try {
        const data = await TraficoBingApiServices();
        if (data) {
            for (const item of data) {
               console.log(item);
              // AlertaRepository.create();
            }
        }
    } catch (error) {
        console.error('Error al inicializar el modelo de BingMaps:', error);
        // throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
}



export default CargarBingMap;
