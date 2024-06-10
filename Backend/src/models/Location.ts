import {DataTypes, Model, ModelStatic, Op} from 'sequelize';
import dbConnection from '../config/dbConnection.config';

interface LocationAttributes {
    id?: number;
    latitude: string;
    longitude: string;
}
class Location extends Model<LocationAttributes> implements LocationAttributes {
    public id!: number;
    public latitude!: string;
    public longitude!: string;
}
interface EntityModel extends Model {}
Location.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
},{sequelize: dbConnection, freezeTableName: true,
    modelName: 'Location'})

async function findEntitiesWithinRadius<Entity extends EntityModel>(
    EntityModel: ModelStatic<Model>,
    location: Location,
    radiusInMeters: number
): Promise<Entity[]> {
    const earthRadiusInMeters = 6371000;

    const latitudeInRadians = parseFloat(location.latitude) * Math.PI / 180;
    const longitudeInRadians = parseFloat(location.longitude) * Math.PI / 180;
    const radiusInRadians = radiusInMeters / earthRadiusInMeters;

    // Calculating the bounds of the search area
    const minLatitude = latitudeInRadians - radiusInRadians;
    const maxLatitude = latitudeInRadians + radiusInRadians;
    const minLongitude = longitudeInRadians - radiusInRadians / Math.cos(latitudeInRadians);
    const maxLongitude = longitudeInRadians + radiusInRadians / Math.cos(latitudeInRadians);

    // Find entities within the search area
    const entities = await EntityModel.findAll({
        include: [{
            model: Location,
            attributes:['latitude', 'longitude'],
            where: {
                latitude: { [Op.between]: [minLatitude * 180 / Math.PI, maxLatitude * 180 / Math.PI] },
                longitude: { [Op.between]: [minLongitude * 180 / Math.PI, maxLongitude * 180 / Math.PI] }
            }
        }]
    });

    return entities as Entity[];
}

export { Location, findEntitiesWithinRadius };