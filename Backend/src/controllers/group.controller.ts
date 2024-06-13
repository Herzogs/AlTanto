import { NextFunction, Request, Response } from 'express';
import * as groupService from '../services/group.service';
import { getGroupByIdValidator } from '../validator/group.validator';

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
    const { name, ownerId } = req.body;
    

    try {
        if (typeof ownerId !== 'number') {
            throw new Error('Invalid ownerId');
        }

        const newGroup = await groupService.createGroup(name, ownerId);

        if (newGroup && typeof newGroup.id === 'number') {
            await groupService.addUserToGroup(newGroup.id, ownerId);
        } else {
            throw new Error('Invalid groupId');
        }

        return res.json(newGroup);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};


const deleteGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
        await groupService.deleteGroup(+id);
        return res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
};

const addUserToGroupWithCode = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { groupId = null, userId, groupCode } = req.body;
        const groupUser = await groupService.addUserToGroupWithCode(groupId, userId, groupCode);
        return res.json(groupUser);
    } catch (error) {
        return next({ message: (error as Error).message, statusCode: 500 });
    }
}

    const removeUserFromGroup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const { groupId, userId } = req.params;
        try {
            await groupService.removeUserFromGroup(Number(groupId), Number(userId));
            return res.json({ message: 'User removed from group successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    };

    const findGroupsByName = async (req: Request, res: Response): Promise<Response> => {
        const { groupName } = req.params;
        try {
            const groups = await groupService.findGroupsByName(groupName);
            return res.json(groups);
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    };

const getGroupsByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params; 
    try {
        const groups = await groupService.getGroupsByUserId(Number(userId));

            if (!groups || groups.length === 0) {
                return res.status(200).json([]);
            }

            return res.json(groups);
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    };

    const getGroupDetailsById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const { id } = req.params;
        try {
            const groupDetails = await groupService.getGroupDetailsById(Number(id));
            return res.json(groupDetails);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    };

const getUserByUserName = async (req: Request, res: Response): Promise<Response> => {
    const { userName } = req.params; 
    try {
        const user = await groupService.getUser(userName);

            if (!user) {
                return res.status(500).json([]);
            }
            return res.json(user);

        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    };

    const getGroupsAndNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId} = req.body;
            const zones = await groupService.getNotification(+userId);
            return res.json(zones);
        } catch (error) {
            if (error ) {
            console.log(error);
            }
            return next((error as Error).message);
        }
    }

    export {
        getAllGroups,
        getGroupById,
        createGroup,
        deleteGroup,
        addUserToGroupWithCode,
        removeUserFromGroup,
        findGroupsByName,
        getGroupsByUserId,
        getGroupDetailsById,
        getUserByUserName,
        getGroupsAndNotifications
    };