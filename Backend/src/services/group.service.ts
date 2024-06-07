import * as GroupRepository from '../repository/group.repository';
import { GroupNotCreatedException, GroupNotFoundException, UserNotFoundException } from '../exceptions/group.exceptions';
import { IGroup } from '../interfaces/group.interface';
import { GroupUser } from '../models/GroupUser';

async function getAllGroups(): Promise<IGroup[]> {
    const groups = await GroupRepository.getAll();
    if (!groups) throw new GroupNotFoundException('Groups not found');
    return groups;
};

async function getGroupById(groupId: number): Promise<IGroup> {
    const group = await GroupRepository.getById(groupId);
    if (!group) throw new GroupNotFoundException('Group not found');
    return group;
};

async function createGroup(name: string, ownerId: number): Promise<IGroup> {
    const newGroup = await GroupRepository.create(name, ownerId);
    if (!newGroup) throw new GroupNotCreatedException('Group not created');
    return newGroup;
};

async function updateGroupName(groupId: number, name: string): Promise<IGroup> {
    const updatedGroup = await GroupRepository.updateName(groupId, name);
    if (!updatedGroup) throw new GroupNotFoundException('Group not found');
    return updatedGroup;
};

async function deleteGroup(groupId: number): Promise<boolean> {
    const deleted = await GroupRepository.remove(groupId);
    if (!deleted) throw new GroupNotFoundException('Group not found');
    return deleted;
};

async function addUserToGroup(groupId: number, userId: number): Promise<GroupUser> {
    const groupUser = await GroupRepository.addUser(groupId, userId);
    if (!groupUser) throw new UserNotFoundException('User not found in group');
    return groupUser;
};

async function removeUserFromGroup(groupId: number, userId: number): Promise<boolean>{
    const removed = await GroupRepository.removeUser(groupId, userId);
    if (!removed) throw new UserNotFoundException('User not found in group');
    return removed;
};

export{
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroupName,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup
}
