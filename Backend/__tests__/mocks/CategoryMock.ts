import {sequelizeMock} from '../../src/config/dbConnection.mock'



const CategoryModel = sequelizeMock.define('Category', {
    id: 1,
    name: 'Seguridad'
});

export default {  CategoryModel };
