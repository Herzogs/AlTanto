import {DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import Category from './Category';
import {Location} from './Location';
import Group from "./Group";

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
    groupId: { type: DataTypes.INTEGER,allowNull: true, defaultValue: null,
        references: {
            model: Group,
            key: 'id'
        }
    }
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Report',
    timestamps: false
});

Report.belongsTo(Category);
Report.belongsTo(Location);
Report.belongsTo(Group, { foreignKey: 'groupId' }); 

export default Report;