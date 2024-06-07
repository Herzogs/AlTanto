// src/repositories/TipoNotificacionRepository.ts
import { ITipoNotificacionRepository } from './ITipoNotificacionRepository';
import TipoNotificacion from '../models/TipoNotificacion'; // Importar el modelo TipoNotificacion

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
    // Verificar si ya existe un registro con los mismos valores
    const existingTipoNotificacion = await TipoNotificacion.findOne({
        where: { identificador, descripcion, grupo }
    });

    // Si ya existe, devolver el idTipo_Notificacion del registro existente
    if (existingTipoNotificacion) {
        return existingTipoNotificacion.idTipo_Notificacion;
    }

    // Si no existe, crear un nuevo registro
    const nuevoTipoNotificacion = await TipoNotificacion.create({ identificador, descripcion, grupo });
    return nuevoTipoNotificacion.idTipo_Notificacion;
  }
}
