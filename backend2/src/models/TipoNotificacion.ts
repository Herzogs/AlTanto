// src/models/TipoNotificacion.ts
import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';

class TipoNotificacion extends Model {
  public idTipo_Notificacion!: number;
  public identificador!: string;
  public descripcion!: string;
  public grupo!: string;
}

TipoNotificacion.init(
  {
    idTipo_Notificacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    identificador: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false 
      },
    grupo: {
      type: DataTypes.STRING,
      allowNull: false 
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'TipoNotificacion',
    tableName: 'tipo_notificacion',
    timestamps: false,
  }
);

export default TipoNotificacion;
