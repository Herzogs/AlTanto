import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';

class Pronostico extends Model {
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
      allowNull: false,
    },
    timeOfDay: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'night'),
      allowNull: false,
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
  },
  {
    sequelize: dbConnection,
    modelName: 'Pronostico',
    tableName: 'pronostico',
    timestamps: false,
  }
);

export default Pronostico;
