// src/repositories/IDescripcionClimaRepository.ts
import  DescripcionClima  from '../models/DescripcionClima';

export interface IDescripcionClimaRepository {
  findAll(): Promise<DescripcionClima[]>;
  findByNumero(numero: number): Promise<DescripcionClima | null>;
}

