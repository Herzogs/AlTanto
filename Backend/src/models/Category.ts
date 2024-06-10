import {DataTypes, Model} from 'sequelize';
import dbConnection from '../config/dbConnection.config';

class Category extends Model {
}

Category.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING, allowNull: false }
    },
    {
        sequelize: dbConnection,
        freezeTableName: true,
        modelName: 'Category',
        timestamps: false
    }
);
export default Category;