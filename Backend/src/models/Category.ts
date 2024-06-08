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
        timestamps: false,
        hooks: {
            afterSync: async () => {
              try {
                const [category, created] = await Category.findOrCreate({
                  where: { name: 'Seguridad' },
                  defaults: { name: 'Seguridad' }
                });
                if (created) {
                  console.log('Default category "Seguridad" has been created.');
                }
              } catch (error) {
                console.error('Error creating default category "Seguridad":', error);
              }
            }
          }
        });
        
        export default Category;