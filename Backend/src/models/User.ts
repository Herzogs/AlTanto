import { DataTypes, Model } from 'sequelize';
import dbConnection from '../config/dbConnection.config';

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER'
    }
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'User',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email', 'phoneNumber']
        }
    ]
});

export default User;
