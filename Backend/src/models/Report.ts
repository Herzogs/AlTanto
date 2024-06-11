import {DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import Category from './Category';
import {Location} from './Location';

class Report extends Model {
}

Report.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: { type: DataTypes.STRING, allowNull: false},
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    images: {type: DataTypes.STRING, allowNull: true},
    duration: { type: DataTypes.INTEGER, defaultValue: 2},
    positiveScore: { type: DataTypes.INTEGER, defaultValue: 0},
    negativeScore: { type: DataTypes.INTEGER, defaultValue: 0},
    enabled: {type: DataTypes.BOOLEAN , defaultValue: true},
    idApi: {
        type: DataTypes.STRING, // Cambiado a STRING para permitir el formato 'alert-729091093/68b68895-4fb3-4b98-bde7-85568f5cd2c2'
        unique: true, // Para asegurarse de que sea único
        allowNull: true, // Permitir null
      },
},


{
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Report',
    timestamps: false
});

Report.belongsTo(Category);
Report.belongsTo(Location);


export default Report;



