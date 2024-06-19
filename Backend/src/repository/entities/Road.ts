import { DataTypes, Model } from 'sequelize';
import dbConnection from "../../config/dbConnection.config";
import { Location } from './Location';
import User from "./User";

class Road extends Model { }

Road.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressOrigin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressDestiny: {
        type: DataTypes.STRING,
        allowNull: false
    },
    origin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Route',
    timestamps: false
});

Road.belongsTo(Location, { foreignKey: 'origin' });
Road.belongsTo(Location, { foreignKey: 'destination' });
Road.belongsTo(User, { foreignKey: 'user' });
export default Road;