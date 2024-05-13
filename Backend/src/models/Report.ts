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
    description: DataTypes.STRING,
    dateTime: DataTypes.DATE,
    fileId: DataTypes.STRING,
    duration: DataTypes.DATE,
    positiveScore: DataTypes.INTEGER,
    negativeScore: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Report',
    timestamps: false
});

Report.belongsTo(Category);
Report.belongsTo(Location);


export default Report;