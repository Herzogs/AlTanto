import { DataTypes, Model } from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import { Location } from './Location';
import User from './User';

class Zone extends Model {}

Zone.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    radius: {
        type: DataTypes.INTEGER,
        defaultValue: 500,
    },
    dateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Zone',
    timestamps: false,

});
Zone.belongsTo(Location, {
    foreignKey: {
        allowNull: false,
    },
});
Zone.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
});


//Zone.sync({ alter: true });


export default Zone;