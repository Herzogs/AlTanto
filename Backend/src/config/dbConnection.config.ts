import { Sequelize } from "sequelize";
import mysql2 from 'mysql2';

const dbHost = process.env.DB_HOST as string
const dbPort = parseInt(process.env.DB_PORT as string, 10)
const dbName = process.env.BD_NAME_DATABASE as string
const dbUser = process.env.DB_USER as string
const dbPassword = process.env.DB_PASSWORD as string
const dbDialect = process.env.DB_DIALECT as string

const dbConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect as 'mysql',
    dialectModule: mysql2,
    timezone: '-03:00',
    logging: false,
    dialectOptions: {
        ssl:{
            require: true,
            rejectUnauthorized: true,
            ca: process.env.DB_SSL_CA,
        }
    }
        
});

dbConnection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        if (process.env.CREATE_TABLE === "true") {
            dbConnection.sync({ 
                force: true,
            });
        }
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


export default dbConnection