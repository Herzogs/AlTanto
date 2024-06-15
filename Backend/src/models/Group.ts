import { DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';
//import User from './User';
import { v4 as uuidv4 } from 'uuid';


class Group extends Model{}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => uuidv4()
    }
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'Group',
    timestamps: false
});

export default Group;