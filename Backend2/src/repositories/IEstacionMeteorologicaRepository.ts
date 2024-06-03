// src/repositories/IEstacionMeteorologicaRepository.ts
import EstacionMeteorologica from '../models/EstacionMeteorologica';

export interface IEstacionMeteorologicaRepository {
  findById(id: number): Promise<EstacionMeteorologica | null>;
  findAll(): Promise<EstacionMeteorologica[]>;
  create(data: EstacionInput): Promise<EstacionMeteorologica>;
}

export type EstacionInput = {
  dist: number;
  lid: number;
  fid: number;
  int_number: number;
  name: string;
  province: string;
  latitud: string;
  longitud: string;
  zoom: number;
};
