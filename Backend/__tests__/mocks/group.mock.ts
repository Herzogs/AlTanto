import {DataTypes} from 'sequelize';
import MockSequelize from 'sequelize-mock';
import {v4 as uuidv4} from 'uuid';
import {RoadMock} from "./road.mock";
import {CategoryMock} from "./category.mock";

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

GroupMock.create = jest.fn().mockResolvedValue(
    GroupMock.build({
        id: 2,
        name: 'Test Group2',
        groupCode: 'cualquiera',
        ownerId: 1,
    }))
GroupMock.findOne = jest.fn(({where: {name}}) => {
    if (name === 'Test Group') {
        return Promise.resolve(CategoryMock.build({ id: 1,
            name: 'Test Group',
            groupCode: 'cualquiera',
            ownerId: 1,}));
    }
    return Promise.resolve(null);
})




export {GroupMock};