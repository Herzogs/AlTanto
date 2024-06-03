// src/repositories/DescripcionClimaRepository.ts
import { IDescripcionClimaRepository } from './IDescripcionClimaRepository';
import  DescripcionClima  from '../models/DescripcionClima';

export class DescripcionClimaRepository implements IDescripcionClimaRepository {
  async findAll(): Promise<DescripcionClima[]> {
    return await DescripcionClima.findAll();
  }

  async findByNumero(numero: number): Promise<DescripcionClima | null> {
    return await DescripcionClima.findOne({ where: { numero: numero } });
  }
}
