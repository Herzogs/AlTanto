// src/repositories/TipoNotificacionRepository.ts
import { ITipoNotificacionRepository } from './ITipoNotificacionRepository';
import TipoNotificacion from '../models/TipoNotificacion';

export class TipoNotificacionRepository implements ITipoNotificacionRepository {

  async findById(id: number): Promise<TipoNotificacion | null> {
    return await TipoNotificacion.findByPk(id);
  }

  async findByIdentifier(identificador: string): Promise<number | null> {
    const tipoNotificacion = await TipoNotificacion.findOne({
      attributes: ['idTipo_Notificacion'], 
      where: { identificador }
    });
    return tipoNotificacion ? tipoNotificacion.idTipo_Notificacion : null;
  }
  
  async create(identificador: string, descripcion: string, grupo: string): Promise<number> {
    const nuevoTipoNotificacion = await TipoNotificacion.create({ identificador, descripcion, grupo });
    return nuevoTipoNotificacion.idTipo_Notificacion; // Retorna el ID del nuevo registro
  }
}