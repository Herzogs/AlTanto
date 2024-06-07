// src/models/TipoNotificacion.ts
import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';



interface TipoNotificacionAttributes {
  identificador?: string;
  descripcion?: string;
  grupo?: string;
}



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
      unique: false,
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

export {TipoNotificacionAttributes}
export default TipoNotificacion;
