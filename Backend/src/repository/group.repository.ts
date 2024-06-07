import Group from '../models/Group';
import { GroupUser } from '../models/GroupUser';
import User from '../models/User';
import { IGroup } from '../interfaces/group.interface';

class GroupRepository {
    static async getAll(): Promise<IGroup[]> {
        const groups = await Group.findAll({
            include: [{ model: User, as: 'members', through: { attributes: [] } }]
        });
        return groups.map(group => group.toJSON());
    }

    static async getById(id: number): Promise<IGroup | null> {
        const group = await Group.findByPk(id, {
            include: [{ model: User, as: 'members', through: { attributes: [] } }]
        });
        return group ? group.toJSON() : null;
    }

    static async create(name: string, ownerId: number): Promise<IGroup> {
        const newGroup = await Group.create({
            name,
            ownerId,
        });
        if(!newGroup)
            throw new Error('Error creating group');
        return newGroup.toJSON();
    }

    static async updateName(id: number, name: string): Promise<IGroup | null> {
        const group = await Group.findByPk(id);
        if (group) {
            group.name = name;
            await group.save();
            return group.toJSON();
        }
        return null;
    }

    static async remove(id: number): Promise<boolean> {
        const group = await Group.findByPk(id);
        if (group) {
            await group.destroy();
            return true;
        }
        return false;
    }

    static async addUser(groupId: number, userId: number): Promise<GroupUser> {
        return await GroupUser.create({ groupId, userId });
    }
    
    static async removeUser(groupId: number, userId: number): Promise<boolean> {
        const groupUser = await GroupUser.findOne({ where: { groupId, userId } });
        if (groupUser) {
            await groupUser.destroy();
            return true;
        }
        return false;
    }

    static async findByName(name: string): Promise<IGroup[]> {
        try {
            const groups = await Group.findAll({ where: { name } });
            return groups;
        } catch (error) {
            throw new Error(`Error buscando el grupo por nombre`);
        }
    }

    static async getGroupsByUserId(userId: number): Promise<Group[]> {
        try {
            const groupUsers: GroupUser[] = await GroupUser.findAll({ where: { userId } });
            const groupIds = groupUsers.map(groupUser => groupUser.getDataValue('groupId'));
            const groups = await Group.findAll({ where: { id: groupIds } });
            return groups;
        } catch (error) {
            throw new Error('Error al obtener los grupos del usuario');
        }
    }

    static async getGroupById(groupId: number): Promise<IGroup> {
        const group = await Group.findByPk(groupId, {
            include: [{ model: User, as: 'members', through: { attributes: [] } }]
        });
        if (!group) throw new Error('Group not found');
        return group.toJSON();
    }

    static async getGroupByGroupCode(groupCode: string): Promise<IGroup> {
        const group = await Group.findOne({ where: { groupCode} })
        if (!group) throw new Error('Group not found');
        return group.toJSON();
    }

    static async getGroupMembers(groupId: number): Promise<any> {
        const groupUsers = await GroupUser.findAll({
            where: { groupId },
            include: [{ model: User }],
        });
        return groupUsers;
    }
}

export default GroupRepository;