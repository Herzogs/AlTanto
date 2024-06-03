// src/models/DescripcionClima.ts
import { DataTypes, Model } from 'sequelize';
import dbConnection from '../database/Database';

class DescripcionClima extends Model {
  public numero!: number;
  public iconoDia!: string;
  public iconoNoche!: string;
  public leyenda!: string;

  public static async initialize() {
    const descripcionClimaData = [
      { numero: 0, iconoDia: 'day-sunny', iconoNoche: 'night-clear', leyenda: 'Despejado' },
      { numero: 1, iconoDia: 'day-sunny-overcast', iconoNoche: 'night-alt-cloudy', leyenda: 'Algo nublado' },
      { numero: 2, iconoDia: 'day-cloudy-high', iconoNoche: 'night-cloudy-high', leyenda: 'Parcialmente nublado' },
      { numero: 3, iconoDia: 'rain', iconoNoche: 'rain', leyenda: 'Nublado con lluvia' },
      { numero: 4, iconoDia: 'thunderstorm', iconoNoche: null, leyenda: 'Cubierto con tormenta sin precipitación' },
      { numero: 5, iconoDia: 'snowflake-cold', iconoNoche: 'snowflake-cold', leyenda: 'Cubierto con nevada' },
      { numero: 6, iconoDia: 'day-sleet', iconoNoche: 'night-sleet', leyenda: 'Lloviznas' },
      { numero: 7, iconoDia: 'snow', iconoNoche: 'snow', leyenda: 'Nevadas Aisladas' },
      { numero: 8, iconoDia: null, iconoNoche: null, leyenda: null },
      { numero: 9, iconoDia: 'cloud-down', iconoNoche: 'cloud-down', leyenda: 'Nubosidad en disminución' },
      { numero: 10, iconoDia: 'cloudy', iconoNoche: 'cloudy', leyenda: 'Nublado' },
      { numero: 11, iconoDia: 'day-sleet', iconoNoche: 'night-sleet', leyenda: 'Cielo nublado. Lloviznas aisladas' },
      { numero: 12, iconoDia: 'day-cloudy', iconoNoche: null, leyenda: 'Inestable' },
      { numero: 13, iconoDia: 'rain-mix', iconoNoche: 'rain-mix', leyenda: 'Nubosidad Variable. Lluvias. Nieve' },
      { numero: 14, iconoDia: 'day-sleet-storm', iconoNoche: 'night-sleet-storm', leyenda: 'Tormentas aisladas' },
      { numero: 15, iconoDia: 'day-cloudy-high', iconoNoche: 'night-cloudy-high', leyenda: 'Nubosidad variable' },
      { numero: 16, iconoDia: 'cloud-down', iconoNoche: 'cloud-down', leyenda: 'Cielo parcialmente nublado o nublado. Lloviznas aisladas' },
      { numero: 17, iconoDia: 'day-snow-thunderstorm', iconoNoche: 'night-snow-thunderstorm', leyenda: 'Nubosidad Variable. Probable nieve' },
      { numero: 18, iconoDia: 'cloudy', iconoNoche: 'cloudy', leyenda: 'Desmejorando' },
      { numero: 19, iconoDia: null, iconoNoche: null, leyenda: 'Cielo nublado. Nevadas. Niebla. Ventisca' },
      { numero: 20, iconoDia: 'strong-wind', iconoNoche: 'strong-wind', leyenda: 'Ventoso' },
    ];
  
    await DescripcionClima.bulkCreate(descripcionClimaData);
  }
}

DescripcionClima.init(
  {
    numero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    iconoDia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    iconoNoche: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leyenda: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'DescripcionClima',
    tableName: 'descripciones_clima',
    timestamps: false,
  }
);

export default DescripcionClima;
