import { DataTypes, Model } from "sequelize";
import dbConnection from "../config/dbConnection.config";
import { Location } from "./Location";

class Routes extends Model {
}

Routes.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false},
    originId: {
        type: DataTypes.INTEGER,
        references: {
            model: Location,
            key: 'id'
        }
    },
    destinationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Location,
            key: 'id'
        }
    },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true},
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Routes',
    timestamps: false
});

Routes.belongsTo(Location, { as: 'origin', foreignKey: 'originId' });
Routes.belongsTo(Location, { as: 'destination', foreignKey: 'destinationId' });

export default Routes;