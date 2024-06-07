import cron from 'node-cron';
import initializeModels from './database/ModelsInitializer';
import dbConnection from './database/Database';

import { TipoNotificacionRepository } from './repositories/TipoNotificacionRepository';
import { AlertaRepository } from './repositories/AlertaRepository';
import PronosticoRepository from './repositories/PronosticoRepository';
import { EstacionMeteorologicaRepository } from './repositories/EstacionMeteorologicaRepository';

//models
import EstadoDeLosTrenes from './models/Trenes.Models';
import initializeSubtesAlertaModel from './models/SubtesAlerta.Model';
import initializeColectivosAlertaModel from './models/ColectivosAlerta.Model';
import initializeClimaClimaModel from './models/Clima.Model';
import TraficoBingApiServices from './models/BingMap.Model';


// Carga los imports de los modelos para crear las tablas
//initializeModels();

// Para inyectar
const pronosticoRepository = new PronosticoRepository();
const tipoNotificacionRepo = new TipoNotificacionRepository();
const alertaRepository = new AlertaRepository();
const estacionMeteorologicaRepository = new EstacionMeteorologicaRepository();

// Demora para que se creen las tablas
 setTimeout(() => {
   // initializeSubtesAlertaModel(tipoNotificacionRepo, alertaRepository); 
 //   initializeColectivosAlertaModel(tipoNotificacionRepo, alertaRepository); 
   // initializeClimaClimaModel(estacionMeteorologicaRepository, pronosticoRepository); 
   // EstadoDeLosTrenes(tipoNotificacionRepo, alertaRepository); 

    async function obtenerDatosDeTrafico() {
        try {
          const datos = await TraficoBingApiServices();
        
        } catch (error) {
          console.error('Error al obtener los datos de tráfico:', error);
        }
      }
      
      obtenerDatosDeTrafico();


}, 10000); // 10000 milisegundos = 10 segundos
 

// Ejecutar las tareas cron
//cron.schedule('*/10 * * * *', () => {
//    initializeSubtesAlertaModel(tipoNotificacionRepo, alertaRepository);
//    initializeColectivosAlertaModel(tipoNotificacionRepo, alertaRepository);
//    EstadoDeLosTrenes(tipoNotificacionRepo, alertaRepository);
//});

//cron.schedule('0 0,6,12,18 * * *', () => {
//    initializeClimaClimaModel(estacionMeteorologicaRepository, pronosticoRepository);
//});
