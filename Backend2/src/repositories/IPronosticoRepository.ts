import  Pronostico  from '../models/Pronostico';

// Interfaz del repositorio de Pronostico
interface PronosticoRepositoryInterface {
  findOneByDateAndTime(date: Date, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night', forecastType: 'today' | 'tomorrow'): Promise<Pronostico | null>;
  insertOrUpdate(pronostico: Pronostico): Promise<Pronostico>;
}