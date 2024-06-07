import GroupRepository from '../repository/group.repository';
import { GroupNotCreatedException, GroupNotFoundException, UserNotFoundException } from '../exceptions/group.exceptions';
import { IGroup } from '../interfaces/group.interface';
import { GroupUser } from '../models/GroupUser';
import { IGroupDetails } from '../interfaces/groupDetail.interface';
import { getUserByUserName } from "../services/user.service";
import { IUser } from 'interfaces/user.interface';

async function getAllGroups(): Promise<IGroup[]> {
    const groups = await GroupRepository.getAll();
    if (!groups) throw new GroupNotFoundException('Groups not found');
    return groups;
}

async function getGroupById(groupId: number): Promise<IGroup> {
    const group = await GroupRepository.getById(groupId);
    if (!group) throw new GroupNotFoundException('Group not found');
    return group;
}

async function createGroup(name: string, ownerId: number): Promise<IGroup> {
    const newGroup = await GroupRepository.create(name, ownerId);
    if (!newGroup) throw new GroupNotCreatedException('Group not created');
    return newGroup;
}

async function updateGroupName(groupId: number, name: string): Promise<IGroup> {
    const updatedGroup = await GroupRepository.updateName(groupId, name);
    if (!updatedGroup) throw new GroupNotFoundException('Group not found');
    return updatedGroup;
}

async function deleteGroup(groupId: number): Promise<boolean> {
    const deleted = await GroupRepository.remove(groupId);
    if (!deleted) throw new GroupNotFoundException('Group not found');
    return deleted;
}

async function addUserToGroup(groupId: number, userId: number): Promise<GroupUser> {
    const groupUser = await GroupRepository.addUser(groupId, userId);
    if (!groupUser) throw new UserNotFoundException('User not found in group');
    return groupUser;
}

async function addUserToGroupWithCode(groupId: number | null, userId: number, groupCode: string): Promise<GroupUser> {
    let group: IGroup | null = null;

    if (groupId !== null) {
        group = await GroupRepository.getGroupById(groupId);
    } else {
        group = await GroupRepository.getGroupByGroupCode(groupCode);
    }
    if (!group) {
        throw new Error('Group not found');
    }
    if (group.groupCode !== groupCode) {
        throw new Error('Invalid group code');
    }
    if (!group.id) {
        throw new Error('Group ID is undefined or null');
    }
    return await GroupRepository.addUser(group.id, userId);
}

async function removeUserFromGroup(groupId: number, userId: number): Promise<boolean>{
    const removed = await GroupRepository.removeUser(groupId, userId);
    if (!removed) throw new UserNotFoundException('User not found in group');
    return removed;
}

async function findGroupsByName(name: string): Promise<IGroup[]> {
    try {
        const groups = await GroupRepository.findByName(name);
        return groups;
    } catch (error) {
        throw new Error(`Error en el servicio al buscar grupos por nombre`);
    }
}

async function getGroupsByUserId(userId: number): Promise<IGroup[]> {
    try {
        const groups = await GroupRepository.getGroupsByUserId(userId);
        return groups;
    } catch (error) {
        throw new Error('Error al obtener los grupos del usuario');
    }
}

async function getGroupDetailsById(groupId: number): Promise<IGroupDetails> {
    const group = await GroupRepository.getGroupById(groupId);
    const members = await GroupRepository.getGroupMembers(groupId);
    return { ...group, members } as IGroupDetails;
}

async function getUser(userName: string): Promise<IUser> {
    console.log(userName)
    try {
        const user = await getUserByUserName(userName);
        return user;
    } catch (error) {
        throw new Error('Error al obtener usuario');
    }
}


export{
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroupName,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup,
    findGroupsByName,
    getGroupsByUserId,
    getGroupDetailsById,
    addUserToGroupWithCode,
    getUser
}