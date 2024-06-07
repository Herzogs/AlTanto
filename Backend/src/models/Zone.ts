import {DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import {Location} from './Location';
import User from './User';

class Zone extends Model {}

Zone.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    radio: {type: DataTypes.INTEGER, defaultValue: 500},
    createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Zone',
    timestamps: false
});

Zone.belongsTo(Location);
Zone.belongsTo(User, { as: 'user', foreignKey: 'id' })

export default Zone;