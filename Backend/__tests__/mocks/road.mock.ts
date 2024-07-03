import { DataTypes } from 'sequelize';
import MockSequelize from 'sequelize-mock';
import { LocationMock } from "./location.mock";
import { UserMock } from "./user.mock";
import { IRoadDto } from "../../src/models/road.interfaces";

const sequelizeMock = new MockSequelize();

const RoadMock = sequelizeMock.define('Road', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressOrigin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressDestiny: {
        type: DataTypes.STRING,
        allowNull: false
    },
    origin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    freezeTableName: true,
    modelName: 'Route',
    timestamps: false
});

RoadMock.belongsTo(LocationMock, { foreignKey: 'origin' });
RoadMock.belongsTo(LocationMock, { foreignKey: 'destination' });
RoadMock.belongsTo(UserMock, { foreignKey: 'user' });

// Mock del método create
RoadMock.create = jest.fn().mockResolvedValue(
        RoadMock.build({id: 1,
        name: 'Test Road',            // Aquí deberías establecer el nombre esperado
        addressOrigin: '123 Test St', // Aquí deberías establecer la dirección de origen esperada
        addressDestiny: '456 Test Ave', // Aquí deberías establecer la dirección de destino esperada
        origin: 1,                    // Aquí deberías establecer el id de origen esperado
        destination: 2,               // Aquí deberías establecer el id de destino esperado
        distance: 500,                // Aquí deberías establecer la distancia esperada
        duration: 200,                // Aquí deberías establecer la duración esperada
        user: 1,                      // Aquí deberías establecer el id de usuario esperado
        createdAt: new Date(), }))

const response= {
     id:1,
    name:'test1',
    addressOrigin:'Origin test1',
    addressDestiny: 'Destini test1',
    origin:1,
    destination:1,
    distance: 500,
    duration: 200,
    user: 1,
    createdAt: new Date(),
}

RoadMock.findByPk= jest.fn((id) => {
    if (id === 1) {
        return Promise.resolve({
            get: jest.fn().mockReturnValue(response),
        });
    }
    return Promise.resolve(null);
});



export { RoadMock };





// import { DataTypes } from 'sequelize';
// import MockSequelize from 'sequelize-mock';
// import { LocationMock } from "./location.mock";
// import { UserMock } from "./user.mock";
// import {IRoadDto} from "../../src/models/road.interfaces";
//
// const sequelizeMock = new MockSequelize();
//
// const RoadMock = sequelizeMock.define('Road', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     addressOrigin: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     addressDestiny: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     origin: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     destination: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     distance: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     duration: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     user: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     createAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//     }
// }, {
//     freezeTableName: true,
//     modelName: 'Route',
//     timestamps: false
// });
//
// RoadMock.belongsTo(LocationMock, { foreignKey: 'origin' });
// RoadMock.belongsTo(LocationMock, { foreignKey: 'destination' });
// RoadMock.belongsTo(UserMock, { foreignKey: 'user' });
//
// const roadData: IRoadDto = {
//     id:1,
//     name: 'Test Road',
//     addressOrigin: '123 Test St',
//     addressDestiny: '456 Test Ave',
//     origin: { lat: 10.0, lng: 20.0 },
//     destination: { lat: 30.0, lng: 40.0 },
//     distance: 50,
//     duration: 60,
//     user: 1,
// };
//
// const response= {
//     id:1,
//     name:'test1',
//     addressOrigin:'Origin test1',
//     addressDestiny: 'Destini test1',
//     origin:1,
//     destination:1,
//     distance: 500,
//     duration: 200,
//     user: 1,
//     createdAt: new Date(),
// }
// const roadResponse= {
//     id: 1,
//     name: 'Road test1',
//     addressOrigin: 'Origin 1',
//     addressDestiny: 'Destino 1',
//     origin: 1,
//     destination: 1,
//     distance: 500,
//     duration: 100,
//     user: 1
// }
//
// // Mock de métodos adicionales si es necesario (create, findByPk, findAll, etc.)
// RoadMock.create = jest.fn().mockResolvedValue({
//     get:jest.fn().mockResolvedValue(response),
//
// }
// );
//
// export { RoadMock };
