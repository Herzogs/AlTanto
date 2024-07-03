import {DataTypes} from 'sequelize';
import MockSequelize from 'sequelize-mock';
import {v4 as uuidv4} from 'uuid';

// Creación de una instancia de sequelize-mock
const sequelizeMock = new MockSequelize();

// Definición del modelo Group en sequelize-mock
const GroupUserMock = sequelizeMock.define('Group', {
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
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

// Mockear el método create de GroupMock
GroupUserMock.create = jest.fn().mockResolvedValue(
    GroupUserMock.build({
        id: 1,
        userId:1,
        groupId: 1,
    })
);

// Mockear el método findOne de GroupMock
GroupUserMock.findOne = jest.fn(({ where: { groupId,userId  } }) => {
    if (groupId === 2 && userId===2) {
        return Promise.resolve(GroupUserMock.build({
            id: 2,
            userId:2,
            groupId: 2,
        }));
    }
    return Promise.resolve(null);
});

export { GroupUserMock };
