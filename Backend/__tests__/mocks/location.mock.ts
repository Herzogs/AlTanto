import MockSequelize from 'sequelize-mock';

const sequelizeMock = new MockSequelize();

const LocationMock = sequelizeMock.define('Location', {
    id: 1,
    latitude: 10,
    longitude: 20
});

// Simular método findOrCreate
LocationMock.findOrCreate = jest.fn(({where: {latitude, longitude}}) => {
    const location = LocationMock.build({id: 1, latitude, longitude});
    location.get = jest.fn(() => ({id: 1, latitude, longitude}));
    return Promise.resolve([location, true]);
});
export {LocationMock, sequelizeMock};