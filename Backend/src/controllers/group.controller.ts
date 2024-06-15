import { NextFunction, Request, Response } from 'express';
import GroupService from '../services/group.service';
import GroupUserService from '../services/groupUser.service';
import { getGroupByIdValidator } from '../validator/group.validator';
import { IGroupService } from '../services/interfaces/group.service.interface';
import { IGroup, IGroupUser, IGroupMember } from '../interfaces/group.interface';
import { IGroupUserService } from '../services/interfaces/groupUser.service.interface';

class GroupController {
    private groupService: IGroupService<IGroup, IGroupUser>;
    private groupUserService: IGroupUserService<IGroupUser, IGroupMember>;

    constructor(groupService = GroupService, groupUserService = GroupUserService) {
        console.log("En el controlador ====> ", groupService);
        console.log("En el controlador ====> ", groupUserService);
        this.groupService = groupService;
        this.groupUserService = groupUserService;
    }

    async createGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { name, ownerId } = req.body;
        try {
            if (typeof ownerId !== 'number') {
                return next({ message: 'Invalid ownerId', statusCode: 400 });
            }
            const group: IGroup = { name, ownerId };
            const newGroup = await this.groupService.create(group);
            if (newGroup && typeof newGroup.id === 'number') {
                await this.groupUserService.addUser({ groupId: newGroup.id, userId: ownerId });
                return res.status(201).json(newGroup);
            } else {
                throw new Error('Invalid groupId');
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async getGroupById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await getGroupByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const group = await this.groupService.findById(+id);
            if (group) {
                return res.json(group);
            } else {
                return next({ message: 'Group not found', statusCode: 404 });
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;
        try {
            await this.groupService.remove(+id);
            return res.json({ message: 'Group deleted successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async addUserToGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { groupId = null, userId, groupCode } = req.body;
        try {
            if (!groupId || !userId || !groupCode) {
                return next({ message: 'Invalid input', statusCode: 400 });
            }
            const groupUser = await this.groupService.validateGroupCode(groupCode);
            await this.groupUserService.addUser({ groupId, userId });
            return res.status(201).json(groupUser);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async removeUserFromGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { groupId, userId } = req.params;
        try {
            if (!groupId || !userId) {
                return next({ message: 'Invalid input', statusCode: 400 });
            }
            await this.groupUserService.removeUser({ groupId: Number(groupId), userId: Number(userId) });
            return res.json({ message: 'User removed from group successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async findGroupsByName(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { name } = req.params;
        try {
            console.log("En controlador ===> ", name);
            console.log("Servicio de Group ====> ", this.groupService)
            const groups = await this.groupService.findByName(name);
            console.log(groups);
            return res.json(groups);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async getGroupsByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { userId } = req.params;
        try {
            const groups = await this.groupService.getAllByOwner(+userId);
            return res.json(groups);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }

    async getGroupDetailsById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { name } = req.params;
        try {
            const group = await this.groupService.findByName(name);
            if (!group) {
                return next({ message: 'Group not found', statusCode: 404 });
            }
            const groupDetails = await this.groupUserService.findAllMembers(group.id as number);
            return res.json(groupDetails);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }
}

export default new GroupController();
