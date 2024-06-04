import { NextFunction, Request, Response } from 'express';
import * as groupService from '../services/group.service';
import { getGroupByIdValidator, createGroupValidator } from '../validator/group.validator';

const getAllGroups = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const groups = await groupService.getAllGroups();
        return res.json(groups);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const getGroupById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = getGroupByIdValidator.safeParse(req.params);
    if (!validationResult.success) {
        return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
    }

    const { id } = validationResult.data;
    try {
        const group = await groupService.getGroupById(+id);
        return res.json(group);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const createGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = createGroupValidator.safeParse(req.body);
    if (!validationResult.success) {
        return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
    }

    const { name, ownerId } = validationResult.data;
    try {
        const newGroup = await groupService.createGroup(name, ownerId);
        return res.json(newGroup);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const updateGroupName = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedGroup = await groupService.updateGroupName(+id, name);
        return res.json(updatedGroup);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
        const deleted = await groupService.deleteGroup(+id);
        return res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const addUserToGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { groupId, userId } = req.body;
    try {
        const groupUser = await groupService.addUserToGroup(groupId, userId);
        return res.json(groupUser);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const removeUserFromGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { groupId, userId } = req.body;
    try {
        const removed = await groupService.removeUserFromGroup(groupId, userId);
        return res.json({ message: 'User removed from group successfully' });
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const findGroupByName = async(req: Request, res: Response): Promise<Response> => {
    const { groupName } = req.body;
    try {
        const group = await groupService.findGroupByName(groupName);

        if (!group) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        return res.json(group);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

const getGroupsByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params; 
    try {
        const groups = await groupService.getGroupsByUserId(Number(userId));

        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: 'No se encontraron grupos para este usuario' });
        }

        return res.json(groups);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroupName,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup,
    findGroupByName,
    getGroupsByUserId
};
