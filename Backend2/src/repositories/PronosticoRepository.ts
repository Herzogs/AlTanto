import  Pronostico  from '../models/Pronostico';
import IPronosticoRepository from './IPronosticoRepository'

// Clase del repositorio de Pronostico
class PronosticoRepository implements IPronosticoRepository {
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
          date: pronostico.date,
          timeOfDay: pronostico.timeOfDay,
          forecastType: pronostico.forecastType,
        },
      });

      if (existingPronostico) {
        // Update existing forecast
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
