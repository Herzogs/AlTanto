// src/models/ClimaModel.ts
import ClimaHoyServices from '../services/ClimaHoyServices';
import { EstacionMeteorologicaRepository } from '../repositories/EstacionMeteorologicaRepository';
import { EstacionInput } from '../repositories/IEstacionMeteorologicaRepository';
import Pronostico from '../models/Pronostico';
import PronosticoRepository from '../repositories/PronosticoRepository';

async function initializeClimaModel(estacionMeteorologicaRepository: EstacionMeteorologicaRepository, pronosticoRepository: PronosticoRepository) {
  try {
    const data = await ClimaHoyServices();   
    if (data) {

      for (const item of data) {
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
    for (const item of data) {
        const timeOfDay = determineTimeOfDay(); // Reemplazar con la lógica real para determinar el momento del día
        const date = new Date(); // Reemplazar con la fecha real si es necesario
        const forecastType = 'today'; // Reemplazar con la lógica real para determinar el tipo de pronóstico
        const newPronostico = new Pronostico({
          date,
          timeOfDay,
          temp: item.weather.temp || null,
          tempDesc: item.tempDesc || null,
          description: item.weather.description || null,
          humidity: item.weather.humidity || null,
          pressure: item.weather.pressure || null,
          visibility: item.weather.visibility || null,
          windSpeed: item.weather.windSpeed || null,
          windDeg: item.weather.windDeg || null,
          forecastType,
          estacionMeteorologicaLid: item.lid

        });
        await pronosticoRepository.insertOrUpdate(newPronostico);
      }
    }
  } catch (error) {
    console.error('Error al inicializar el modelo de ClimaModel:', error);
    // throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
}

function determineTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'afternoon';
  } else if (currentHour >= 18 && currentHour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

export default initializeClimaModel;
