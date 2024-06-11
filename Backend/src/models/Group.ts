import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from '../config/dbConnection.config';
//import User from './User';
import { v4 as uuidv4 } from 'uuid';

interface GroupAttributes {
    id: number;
    name: string;
   
    groupCode: string;
}

interface GroupCreationAttributes extends Optional<GroupAttributes, 'id' | 'groupCode'> {}

class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    public id!: number;
    public name!: string;
    
    public groupCode!: string;
}

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