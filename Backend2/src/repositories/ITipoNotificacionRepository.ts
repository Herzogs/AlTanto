// src/repositories/ITipoNotificacionRepository.ts

import TipoNotificacion from '../models/TipoNotificacion';

export interface ITipoNotificacionRepository {
  findById(id: number): Promise<TipoNotificacion | null>;
  findByIdentifier(identificador: string): Promise<number | null>; // Modificado para que devuelva solo el ID
  create(identificador: string, descripcion: string, grupo: string): Promise<number>;
}
