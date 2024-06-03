// models/EstacionMeteorologica.ts

import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';

class EstacionMeteorologica extends Model {
  public id!: number;
  public dist!: number;
  public lid!: number;
  public fid!: number;
  public int_number!: number;
  public name!: string;
  public province!: string;
  public latitud!: string;
  public longitud!: string;
  public zoom!: number;
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
      allowNull: false,
    },
    lid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    int_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitud: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitud: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zoom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'EstacionMeteorologica',
    tableName: 'estaciones_meteorologicas',
    timestamps: false,
  }
);

export default EstacionMeteorologica;
