import  Pronostico  from '../models/Pronostico';

export interface IPronosticoRepository {
  findOneByDateAndTime(date: Date, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night', forecastType: 'today' | 'tomorrow'): Promise<Pronostico | null>;
  insertOrUpdate(pronostico: Pronostico): Promise<Pronostico>;
}