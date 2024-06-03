// src/repositories/IAlertaRepository.ts
import Alerta from '../models/Alerta';

export interface IAlertaRepository {
  findById(id: number): Promise<Alerta | null>;
  findAll(): Promise<Alerta[]>;
  create(idTipoNotificacion: number, descripcion: string, vigente: boolean, fechaCreacion?: Date): Promise<Alerta>;
  crearOActualziarFEchaSiExiste(idTipoNotificacion: number, descripcion: string): Promise<void>;
}
