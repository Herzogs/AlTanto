import MockSequelize from 'sequelize-mock';

const sequelizeMock = new MockSequelize();

// Define el modelo de categoría para sequelize-mock con valores predeterminados
const CategoryModel = sequelizeMock.define('Category', {
    id: {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: 'STRING',
        allowNull: false,
    },
}, {
    defaultScope: {
        where: { id: 1, name: 'Seguridad' }
    },
});

// Exportar el modelo de categoría
export { CategoryModel };
