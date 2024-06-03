//database/Database.ts
import { Sequelize } from "sequelize";

const dbHost = process.env.DB_HOST
const dbPort = parseInt(process.env.DB_PORT ?? '3306', 10)
const dbName = process.env.BD_NAME_DATABASE ?? 'altanto'
const dbUser = process.env.DB_USER ?? 'root'
const dbPassword = process.env.DB_PASSWORD  ?? 'root'
const dbDialect = process.env.DB_DIALECT ?? 'mysql'

const dbConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect as 'mysql',
    logging: false
});

dbConnection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        if (process.env.CREATE_TABLE === 'true') {
            dbConnection.sync({ force: true });
        }
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


export default dbConnection