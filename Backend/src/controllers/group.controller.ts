import { NextFunction, Request, Response } from 'express';
import { getGroupByIdValidator } from '../validator/group.validator';
import { IGroupService } from '../services/interfaces/group.service.interface';
import { IGroup, IGroupUser, IGroupMember } from '../models/group.interface';
import { IGroupUserService } from '../services/interfaces/groupUser.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class GroupController {
    private groupService: IGroupService<IGroup, IGroupUser, IGroupMember>;
    private groupUserService: IGroupUserService<IGroupUser>;

    constructor({ groupService, groupUserService }: { groupService: IGroupService<IGroup, IGroupUser, IGroupMember>, groupUserService: IGroupUserService<IGroupUser> }) {
        this.groupService = groupService;
        this.groupUserService = groupUserService;
    }

    async createGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { name, ownerId } = req.body;
        try {
            if (typeof ownerId !== 'number') {
                return next({ message: 'Invalid ownerId', statusCode: STATUS_CODE.BAD_REQUEST });
            }
            const group: IGroup = { name, ownerId };
            const newGroup = await this.groupService.create(group);
            if (newGroup && typeof newGroup.id === 'number') {
                await this.groupUserService.addUser({ groupId: newGroup.id, userId: ownerId });
                res.status(201).json(newGroup);
            } else {
                throw new Error('Invalid groupId');
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

    async getGroupById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await getGroupByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const group = await this.groupService.findById(+id);
            if (group) {
                res.status(200).json(group);
            } else {
                return next({ message: 'Group not found', statusCode: STATUS_CODE.BAD_REQUEST });
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const { id } = req.params;
        try {
            await this.groupService.remove(+id);
            return res.json({ message: 'Group deleted successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

    async addUserToGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { userId, groupCode } = req.body;
        try {
            if (!userId || !groupCode) {
                return next({ message: 'Invalid input', statusCode: STATUS_CODE.BAD_REQUEST });
            }
            const groupUser = await this.groupService.validateGroupCode(groupCode);
            await this.groupUserService.addUser({ groupId: groupUser.id as number, userId });
            return res.status(201).json(groupUser);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async removeUserFromGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const { groupId, userId } = req.params;
        try {
            if (!groupId || !userId) {
                return next({ message: 'Invalid input', statusCode: STATUS_CODE.BAD_REQUEST });
            }
            await this.groupUserService.removeUser({ groupId: Number(groupId), userId: Number(userId) });
            return res.status(STATUS_CODE.SUCCESS).json({ message: 'User removed from group successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async findGroupsByName(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const { name } = req.params;
        try {
            const groups = await this.groupService.findByName(name);
            return res.json(groups);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getGroupsByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const { userId } = req.params;
        console.log(userId);

        try {
            const groups = await this.groupService.getAllByOwner(+userId);
            const groupUser = await this.groupUserService.findAllByUserId(+userId);
            const listOfGroups = await this.groupService.findAllByGroupId(groupUser);
            listOfGroups.forEach((group) => {
                if (!groups.find((g) => g.id === group.id))
                    groups.push(group);
            })
            console.log(groups);
            return res.status(STATUS_CODE.SUCCESS).json(groups);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getGroupDetailsById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { id } = req.params;

        try {
            const group = await this.groupService.findMembersByGroupId(+id);
            return res.json(group);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getGroupNotifications(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const { id } = req.params;

        try {
            const notifications = await this.groupService.getNotifications(+id);
            return res.json(notifications);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

}

export default GroupController;
