import { DataTypes, Model } from 'sequelize';
import dbConnection from '../config/dbConnection.config';
import Group from './Group';
import User from './User';

class GroupUser extends Model {}

GroupUser.init({
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize: dbConnection,
    freezeTableName: true,
    modelName: 'GroupUser',
    timestamps: false
});

Group.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Group.belongsToMany(User, { through: GroupUser, as: 'members', foreignKey: 'groupId' });
User.belongsToMany(Group, { through: GroupUser, as: 'groups', foreignKey: 'userId' });

export { Group, GroupUser };
