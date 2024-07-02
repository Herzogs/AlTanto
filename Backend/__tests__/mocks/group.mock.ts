import { DataTypes, Model } from 'sequelize';
import MockSequelize from 'sequelize-mock';
import { v4 as uuidv4 } from 'uuid';

const sequelizeMock = new MockSequelize();

const GroupMock = sequelizeMock.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => uuidv4(),
    },
});

// Mock para el método `findByPk`
GroupMock.findByPk = jest.fn();

export default GroupMock;