import { DataTypes, Model } from 'sequelize';
import dbConnection from '../../config/dbConnection.config';

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
          await Category.bulkCreate([
            { name: 'Seguridad' },
            { name: 'Transito' },
            { name: 'Via publica' },
            { name: 'Alerta' }
          ], { ignoreDuplicates: true });
          console.log('Default categories have been created.');
        } catch (error) {
          console.error('Error creating default categories:', error);
        }
      }
    }
  });

export default Category;