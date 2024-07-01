import MockSequelize from 'sequelize-mock';

//
const sequelizeMock = new MockSequelize();



const CategoryMock = sequelizeMock.define('Category', {
    id: 1,
    name: 'Test Category'
});


// Simular método

CategoryMock.findAll = jest.fn(() => Promise.resolve([
    CategoryMock.build({id: 1, name: 'Seguridad'}),
    CategoryMock.build({id: 2, name: 'Alerta'})
]))
;

// Simular método findByPk
CategoryMock.findByPk = jest.fn((id) => {
    if (id === 1) {
        return Promise.resolve(CategoryMock.build({id: 1, name: 'Seguridad'}));
    }
    return Promise.resolve(null);
})
;

// Simular método findOne
CategoryMock.findOne = jest.fn(({where: {name}}) => {
    if (name === 'Seguridad') {
        return Promise.resolve(CategoryMock.build({id: 1, name: 'Seguridad'}));
    }
    return Promise.resolve(null);
})
;

// Simular método create
CategoryMock.create = jest.fn(({name}) => {
    if(name=== 'Seguridad') return Promise.resolve(null);
    return Promise.resolve(CategoryMock.build({id: 3, name}));
})
;

export {CategoryMock, sequelizeMock};
