// src/repositories/PronosticoRepository.ts
import Pronostico from '../models/Pronostico';
import { IPronosticoRepository } from './IPronosticoRepository';

export class PronosticoRepository implements IPronosticoRepository {
  public async findOneByDateAndTime(date: Date, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night', forecastType: 'today' | 'tomorrow'): Promise<Pronostico | null> {
    try {
      const pronostico = await Pronostico.findOne({
        where: {
          date,
          timeOfDay,
          forecastType,
        },
      });
      return pronostico ? pronostico : null;
    } catch (error) {
      console.error('Error while finding pronostico:', error);
      return null;
    }
  }

  public async insertOrUpdate(pronostico: Pronostico): Promise<Pronostico> {
    try {
      const existingPronostico = await Pronostico.findOne({
        where: {
          estacionMeteorologicaLid: pronostico.estacionMeteorologicaLid,
          forecastType: pronostico.forecastType,
          timeOfDay: pronostico.timeOfDay,
        },
      });
  
      if (existingPronostico) {
        // Update existing forecast with all fields
        await existingPronostico.update(pronostico.toJSON());
        return existingPronostico;
      } else {
        // Insert new forecast
        const newPronostico = await Pronostico.create(pronostico.toJSON());
        return newPronostico;
      }
    } catch (error) {
      console.error('Error while inserting or updating pronostico:', error);
      throw error;
    }
  }
  

  
}

export default PronosticoRepository;
