// src/repositories/AlertaRepository.ts

import { IAlertaRepository } from './IAlertaRepository';
import Alerta from '../models/Alerta';

export class AlertaRepository implements IAlertaRepository {
  async findById(id: number): Promise<Alerta | null> {
    return await Alerta.findByPk(id);
  }

  async findAll(): Promise<Alerta[]> {
    return await Alerta.findAll();
  }

  async create(idTipoNotificacion: number, descripcion: string, vigente: boolean, fechaCreacion?: Date): Promise<Alerta> {
    return await Alerta.create({ idTipo_notificacion: idTipoNotificacion, descripcion, vigente, fecha_creacion: fechaCreacion });
  }

  async crearOActualziarFEchaSiExiste(idTipoNotificacion: number, descripcion: string): Promise<void> {
    const alertaExistente = await Alerta.findOne({ where: { idTipo_notificacion: idTipoNotificacion, descripcion: descripcion } });
    if (alertaExistente) {
      await alertaExistente.update({ fecha_creacion: new Date() });
    } else {
      await this.create(idTipoNotificacion, descripcion, true, new Date());
    }
  }
}
