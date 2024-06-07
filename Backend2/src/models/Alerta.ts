// src/models/Alerta.ts
import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';
import TipoNotificacion from './TipoNotificacion';

class Alerta extends Model {
  public idAlerta!: number;
  public idTipo_notificacion!: number;
  public descripcion!: string;
  public vigente!: boolean;
  public fecha_creacion!: Date;
}

Alerta.init(
  {
    idAlerta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idTipo_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoNotificacion,
        key: 'idTipo_Notificacion',
      },
    },
    descripcion: {
      type: DataTypes.STRING(1000), // Definir el límite de caracteres
      allowNull: false,
    },
    vigente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Alerta',
    tableName: 'alertas',
    timestamps: false,
  }
);


TipoNotificacion.hasMany(Alerta, { foreignKey: 'idTipo_notificacion' });
Alerta.belongsTo(TipoNotificacion, { foreignKey: 'idTipo_notificacion' });

export default Alerta;
