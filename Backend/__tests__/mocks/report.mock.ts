import MockSequelize from 'sequelize-mock';
import {DataTypes} from 'sequelize';
import { UserMock } from './user.mock';
import GroupMock from './group.mock';
import { LocationMock } from './zone.mock';
import { CategoryMock } from './category.mock';

const sequelizeMock = new MockSequelize();

const ReportMock = sequelizeMock.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
    },
    positiveScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    negativeScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
});

ReportMock.Category = CategoryMock;
ReportMock.Location = LocationMock;
ReportMock.Group = GroupMock;
ReportMock.User = UserMock;


ReportMock.belongsTo = jest.fn();
const reportResponse = {
    id: 1,
    content: 'Report test 1',
    createdAt: new Date(),
    image: 'imageTest',
    duration: 2,
    positiveScore: 0,
    negativeScore: 0,
    enable: 1,
    groupId: undefined,
    categoryId: 1,
    locationId: 1,
    userId: 1,
};


ReportMock.create = jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(reportResponse),
});

ReportMock.findByPk = jest.fn((id) => {
    if (id === 1) {
        return Promise.resolve({
            get: jest.fn().mockReturnValue(reportResponse),
        });
    }
    return Promise.resolve(null);
});
ReportMock.findAll = jest.fn(({ where }) => {
    const reports = [
        ReportMock.build({
            id: 1,
            content: 'Report 1',
            createdAt: new Date(),
            images: 'image1.jpg',
            duration: 2,
            positiveScore: 0,
            negativeScore: 0,
            enabled: true,
            groupId: null,
            userId: 1,
            Category: CategoryMock.build({ id: 1, name: 'Category 1' }),
            Location: LocationMock.build({ id: 1, latitude: 40.7128, longitude: -74.0060 }),
        }),
        ReportMock.build({
            id: 2,
            content: 'Report 2',
            createdAt: new Date(),
            images: 'image2.jpg',
            duration: 2,
            positiveScore: 0,
            negativeScore: 0,
            enabled: true,
            groupId: null,
            userId: 1,
            Category: CategoryMock.build({ id: 2, name: 'Category 2' }),
            Location: LocationMock.build({ id: 2, latitude: 34.0522, longitude: -118.2437 }),
        }),
        ReportMock.build({
            id: 3,
            content: 'Report 3',
            createdAt: new Date(),
            images: 'image3.jpg',
            duration: 2,
            positiveScore: 0,
            negativeScore: 0,
            enabled: true,
            groupId: null,
            userId: 2,
            Category: CategoryMock.build({ id: 1, name: 'Category 1' }),
            Location: LocationMock.build({ id: 1, latitude: 40.7128, longitude: -74.0060 }),
        }),
    ];

    if (where && where.userId !== undefined) {
        return Promise.resolve(reports.filter(report => report.userId === where.userId));
    }

    return Promise.resolve(reports);
});
ReportMock.increment = jest.fn().mockImplementation(async (field: string) => {
    // Simular el error si el campo no es 'positiveScore' o 'negativeScore'
    if (field !== 'positiveScore' && field !== 'negativeScore') {
        throw new TypeError(`Field '${field}' is not incrementable.`);
    }

    // Obtener el reporte actualizado
    const report = await ReportMock.findByPk(1);
    if (field === 'positiveScore') {
        report.positiveScore++;
    } else if (field === 'negativeScore') {
        report.negativeScore++;
    }

    return report;
});


export { ReportMock };
