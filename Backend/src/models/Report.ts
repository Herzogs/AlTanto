import {DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import Category from './Category';
import Location from './Location';

class Report extends Model {
}

Report.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: { type: DataTypes.STRING, allowNull: false},
    content: { type: DataTypes.STRING, allowNull: false},
    dateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    images: {type: DataTypes.STRING, allowNull: true},
    duration: { type: DataTypes.DATE, allowNull: false},
    positiveScore: { type: DataTypes.INTEGER, defaultValue: 0},
    negativeScore: { type: DataTypes.INTEGER, defaultValue: 0},
    enabled: {type: DataTypes.BOOLEAN , defaultValue: true},
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Report',
    timestamps: false
});

Report.belongsTo(Category);
Report.belongsTo(Location);


export default Report;