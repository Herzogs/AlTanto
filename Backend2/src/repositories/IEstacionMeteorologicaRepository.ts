// src/repositories/IEstacionMeteorologicaRepository.ts

import EstacionMeteorologica from '../models/EstacionMeteorologica';

export interface IEstacionMeteorologicaRepository {
  findById(id: number): Promise<EstacionMeteorologica | null>;
  findAll(): Promise<EstacionMeteorologica[]>;
  create(data: EstacionInput): Promise<EstacionMeteorologica>;
}

export type EstacionInput = {
  dist?: number | null; // Permitir valores nulos
  lid?: number | null; // Permitir valores nulos
  fid?: number | null; // Permitir valores nulos
  int_number?: number | null; // Permitir valores nulos
  name?: string | null; // Permitir valores nulos
  province?: string | null; // Permitir valores nulos
  latitud?: string | null; // Permitir valores nulos
  longitud?: string | null; // Permitir valores nulos
  zoom?: number | null; // Permitir valores nulos
};
