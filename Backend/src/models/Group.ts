import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import User from './User';
import { v4 as uuidv4 } from 'uuid';

interface GroupAttributes {
    id: number;
    name: string;
    ownerId: number;
    codigoGrupo: string;
}

interface GroupCreationAttributes extends Optional<GroupAttributes, 'id' | 'codigoGrupo'> {}

class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    public id!: number;
    public name!: string;
    public ownerId!: number;
    public codigoGrupo!: string;
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
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    codigoGrupo: {
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