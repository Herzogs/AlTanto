import DBConnectionMock from '../DbConnection';
//import Category from '../../src/repository/entities/Category';

const CategoryMock = DBConnectionMock.define('Category', {
    id: 1,
    name: 'Test Category'
});

export { CategoryMock };