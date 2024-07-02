// Importa las dependencias necesarias
import MockSequelize from 'sequelize-mock';
import { DataTypes } from 'sequelize';

// Define el modelo UserMock con sequelize-mock
const sequelizeMock = new MockSequelize();
const UserMock = sequelizeMock.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER',
    },
}, {
    freezeTableName: true,
    modelName: 'User',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['email', 'phoneNumber'],
        },
    ],
});

export { UserMock };
