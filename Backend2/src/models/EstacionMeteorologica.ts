// models/EstacionMeteorologica.ts

import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';

class EstacionMeteorologica extends Model {
  public id!: number;
  public dist!: number | null;
  public lid!: number | null;
  public fid!: number | null;
  public int_number!: number | null;
  public name!: string | null;
  public province!: string | null;
  public latitud!: string | null;
  public longitud!: string | null;
  public zoom!: number | null;
}

EstacionMeteorologica.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dist: {
      type: DataTypes.FLOAT,
      allowNull: true, // Permitir valores nulos
    },
    lid: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir valores nulos
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir valores nulos
    },
    int_number: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir valores nulos
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir valores nulos
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir valores nulos
    },
    latitud: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir valores nulos
    },
    longitud: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir valores nulos
    },
    zoom: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir valores nulos
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'EstacionMeteorologica',
    tableName: 'estaciones_meteorologicas',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['lid'],
      },
    ],
  }
);

export default EstacionMeteorologica;
