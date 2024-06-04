// models/Pronostico.ts
import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';
import PronosticoInterface from '../interfaces/PronosticoInterface';
import EstacionMeteorologica from './EstacionMeteorologica';

class Pronostico extends Model implements PronosticoInterface {
  public id!: number;
  public date!: Date;
  public timeOfDay!: 'morning' | 'afternoon' | 'evening' | 'night';
  public temp!: number | null;
  public tempDesc!: string | null;
  public description!: string | null;
  public humidity!: number | null;
  public pressure!: number | null;
  public visibility!: number | null;
  public windSpeed!: number | null;
  public windDeg!: string | null;
  public forecastType!: 'today' | 'tomorrow';
  public estacionMeteorologicaLid!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pronostico.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    timeOfDay: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'night','today'),
      allowNull: true,
    },
    temp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    tempDesc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    pressure: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
      defaultValue: null,
    },
    visibility: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
      defaultValue: null,
    },
    windSpeed: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
      defaultValue: null,
    },
    windDeg: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    forecastType: {
      type: DataTypes.ENUM('today', 'tomorrow'),
      allowNull: false,
    },
    estacionMeteorologicaLid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EstacionMeteorologica,
        key: 'lid',
      },
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Pronostico',
    tableName: 'pronostico',
    timestamps: false,
  }
);

Pronostico.belongsTo(EstacionMeteorologica, {
  foreignKey: 'estacionMeteorologicaLid',
  targetKey: 'lid',
});


export default Pronostico;
