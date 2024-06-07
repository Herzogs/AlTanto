// src/models/ClimaModel.ts
import ClimaHoyServices from '../services/ClimaHoyServices';
import ClimaMananaServices from '../services/ClimaMananaServices';
import { EstacionMeteorologicaRepository } from '../repositories/EstacionMeteorologicaRepository';
import { EstacionInput } from '../repositories/IEstacionMeteorologicaRepository';
import Pronostico from './Pronostico';
import PronosticoRepository from '../repositories/PronosticoRepository';

async function initializeClimaModel(estacionMeteorologicaRepository: EstacionMeteorologicaRepository, pronosticoRepository: PronosticoRepository) {
  try {
    const climaHoy = await ClimaHoyServices();   
    const climaManana = await ClimaMananaServices();   

    console.log(climaHoy[0])
    if (climaHoy) {

      for (const item of climaHoy) {
        // este for no deberia existir , es para cargar las  estaciones meteorologicas
        const dist = item.dist;
        const lid = item.lid;
        const fid = item.fid;
        const int_number = item.int_number; // número identificador del radar
        const name = item.name; // localidad o ciudad
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
        await estacionMeteorologicaRepository.create(newEstacion);
    }
    for (const item of climaHoy) {
        const timeOfDay = 'today'; 
        const date = new Date(); // Reemplazar con la fecha real si es necesario
        const forecastType = 'today'; // Reemplazar con la lógica real para determinar el tipo de pronóstico
        const newPronostico = new Pronostico({
          date,
          timeOfDay,
          temp: item.weather.temp || null,
          tempDesc: item.weather.tempDesc || null,
          description: item.weather.description || null,
          humidity: item.weather.humidity || null,
          pressure: item.weather.pressure || null,
          visibility: item.weather.visibility || null,
          windSpeed: item.weather.wind_speed || null,
          windDeg: item.weather.wing_deg || null,
          forecastType,
          estacionMeteorologicaLid: item.lid

        });
        await pronosticoRepository.insertOrUpdate(newPronostico);
      }

      console.log(climaManana[0]);

      for (const item of climaManana) {
        const date = new Date(); 
        date.setDate(date.getDate() + 1);         
        const forecastType = 'tomorrow';     
        const morningTimeOfDay = 'morning';
        const morningPronostico = new Pronostico({
            date,
            timeOfDay: morningTimeOfDay,
            temp: item.weather.morning_temp || null,
            tempDesc: item.weather.morning_desc || null,
            forecastType,
            estacionMeteorologicaLid: item.lid 
        });
    
        const afternoonTimeOfDay = 'afternoon'; // Cambiar a 'afternoon' para la tarde
        const afternoonPronostico = new Pronostico({
            date,
            timeOfDay: afternoonTimeOfDay,
            temp: item.weather.afternoon_temp || null,
            tempDesc: item.weather.afternoon_desc || null,
            forecastType,
            estacionMeteorologicaLid: item.lid 
        });
    
        // Insertar los pronósticos en la base de datos
        await pronosticoRepository.insertOrUpdate(morningPronostico);
        await pronosticoRepository.insertOrUpdate(afternoonPronostico);
    }


    }
  } catch (error) {
    console.error('Error al inicializar el modelo de ClimaModel:', error);
    // throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
}


export default initializeClimaModel;
