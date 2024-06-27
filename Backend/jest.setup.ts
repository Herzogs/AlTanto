import dbConnection from './src/config/dbConnection.config';

beforeEach(async () => {
    await dbConnection.sync({ force: true });
});

afterAll(async () => {
    await dbConnection.close();
});
