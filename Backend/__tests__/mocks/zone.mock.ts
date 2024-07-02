import MockSequelize from 'sequelize-mock';
import {DataTypes} from "sequelize";
import {LocationMock} from "./location.mock";

const sequelizeMock = new MockSequelize();
const ZoneMock = sequelizeMock.define('Zone', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    radio: {
        type: DataTypes.INTEGER,
        defaultValue: 500,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
ZoneMock.belongsTo(LocationMock, { foreignKey: 'LocationId' });
ZoneMock.create = jest.fn(({ name, radio, LocationId, userId }) => {
    const createdZone = ZoneMock.build({
        id: 1,
        name,
        radio,
        LocationId,
        userId
    });
    return Promise.resolve(createdZone);
});

// Array de zonas simuladas
const zones = [
    ZoneMock.build({
        id: 1,
        name: 'Zone 1',
        radio: 1000,
        userId: 1,
        LocationId: 1,
        Location: LocationMock.build({ id: 1, latitude: 54, longitude: 55 }),
    }),
    ZoneMock.build({
        id: 2,
        name: 'Zone 2',
        radio: 1500,
        userId: 2,
        LocationId: 2,
        Location: LocationMock.build({ id: 2, latitude: 56, longitude: 57 }),
    }),
];

// Mockear función `get` para cada zona
zones.forEach(zone => {
    zone.get = jest.fn(() => ({
        id: zone.id,
        name: zone.name,
        radio: zone.radio,
        userId: zone.userId,
        Location: {
            id: zone.Location.id,
            latitude: zone.Location.latitude,
            longitude: zone.Location.longitude,
        },
    }));
});

// Mockear función `findAll` para devolver todas las zonas o filtrar por `userId`
ZoneMock.findAll = jest.fn(({ where }) => {
    if (where && where.userId !== undefined) {
        // Filtrar y devolver las zonas que pertenecen al userId especificado
        const filteredZones = zones.filter(zone => zone.userId === where.userId);
        return Promise.resolve(filteredZones);
    }

    // Si no se proporciona un filtro `where` o no coincide con `userId`, devolver todas las zonas
    return Promise.resolve(zones);
});
ZoneMock.findByPk = jest.fn((zoneId: number) => {
    const zone = zones.find(z => z.id === zoneId);
    return Promise.resolve(zone || null);
});

export { ZoneMock, sequelizeMock, LocationMock};