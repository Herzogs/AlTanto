// server.ts
import initializeModels from './database/ModelsInitializer';
import dbConnection from './database/Database';

import { TipoNotificacionRepository } from './repositories/TipoNotificacionRepository';
import { AlertaRepository } from './repositories/AlertaRepository';
import PronosticoRepository from './repositories/PronosticoRepository';
import {EstacionMeteorologicaRepository} from './repositories/EstacionMeteorologicaRepository';



import initializeSubtesAlertaModel from './models/SubtesAlertaModel'; // Importa el modelo SubtesAlertaModel
import initializeColectivosAlertaModel from './models/ColectivosAlertaModel';
import  initializeClimaClimaModel from './models/ClimaModel'

// carga los imports de los modelos para crear las tablas
initializeModels();

// para inyectar
const pronosticoRepository = new PronosticoRepository();
const tipoNotificacionRepo = new TipoNotificacionRepository();
const alertaRepository = new AlertaRepository();
const estacionMeteorologicaRepository = new EstacionMeteorologicaRepository();
// demora par que se creen las tablas
setTimeout(() => {
    //initializeSubtesAlertaModel(tipoNotificacionRepo, alertaRepository);
    //initializeColectivosAlertaModel(tipoNotificacionRepo, alertaRepository);
    initializeClimaClimaModel(estacionMeteorologicaRepository, pronosticoRepository);
  }, 10000); // 5000 milisegundos = 5 segundos



  //CREATE USER 'root2'@'localhost' IDENTIFIED BY 'root2';
  //GRANT ALL PRIVILEGES ON *.* TO 'root2'@'localhost';
  //FLUSH PRIVILEGES;

