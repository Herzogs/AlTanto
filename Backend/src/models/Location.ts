import { DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';

class Location extends Model{}
Location.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    latitude: DataTypes.STRING,
    longitude: DataTypes.INTEGER,
},{sequelize: dbConnection, modelName: 'Location'})
export default Location;
