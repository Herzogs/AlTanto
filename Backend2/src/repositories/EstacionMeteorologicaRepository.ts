// src/repositories/EstacionMeteorologicaRepository.ts
import { IEstacionMeteorologicaRepository, EstacionInput } from './IEstacionMeteorologicaRepository';
import EstacionMeteorologica from '../models/EstacionMeteorologica';

export class EstacionMeteorologicaRepository implements IEstacionMeteorologicaRepository {
  async findById(id: number): Promise<EstacionMeteorologica | null> {
    return await EstacionMeteorologica.findByPk(id);
  }

  async findAll(): Promise<EstacionMeteorologica[]> {
    return await EstacionMeteorologica.findAll();
  }

  async create(data: EstacionInput): Promise<EstacionMeteorologica> {
    const existingStation = await EstacionMeteorologica.findOne({ where: { lid: data.lid } });
    if (existingStation) {
      return existingStation;
    }
    return await EstacionMeteorologica.create(data);
  }
}
