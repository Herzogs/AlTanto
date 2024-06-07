import  Group  from '../models/Group';
import { GroupUser } from '../models/GroupUser'; 
import  User  from '../models/User';
import { IGroup } from '../interfaces/group.interface';

export const getAll = async (): Promise<IGroup[]> => {
    const groups = await Group.findAll({ include: [{ model: User, as: 'members' }] });
    return groups.map(group => group.toJSON());
};

export const getById = async (id: number): Promise<IGroup | null> => {
    const group = await Group.findByPk(id, { include: [{ model: User, as: 'members' }] });
    return group ? group.toJSON() : null;
};

export const create = async (name: string, ownerId: number): Promise<IGroup> => {
    const newGroup = await Group.create({ name, ownerId });
    return newGroup.toJSON();
};

export const updateName = async (id: number, name: string): Promise<IGroup | null> => {
    const group = await Group.findByPk(id);
    if (group) {
        group.name = name;
        await group.save();
        return group.toJSON();
    }
    return null;
};

export const remove = async (id: number): Promise<boolean> => {
    const group = await Group.findByPk(id);
    if (group) {
        await group.destroy();
        return true;
    }
    return false;
};

export const addUser = async (groupId: number, userId: number): Promise<GroupUser> => {
    return await GroupUser.create({ groupId, userId });
};

export const removeUser = async (groupId: number, userId: number): Promise<boolean> => {
    const groupUser = await GroupUser.findOne({ where: { groupId, userId } });
    if (groupUser) {
        await groupUser.destroy();
        return true;
    }
    return false;
};
