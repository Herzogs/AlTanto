import { Lifetime } from 'awilix';
import container from '../../src/container';
import GroupService from '../../src/services/group.service';
import GroupUserService from '../../src/services/groupUser.service';
import dbConnection from '../../src/config/dbConnection.config';
import { config } from 'dotenv';
import { IGroup } from '../../src/models/group.interface';
import GroupController from '../../src/controllers/group.controller';
import * as validationRoutes from '../../src/validator/group.validator';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../src/services/group.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
            validateGroupCode: jest.fn(),
            findByName: jest.fn(),
            getAllByOwner: jest.fn(),
            findMembersByGroupId: jest.fn(),
            getNotifications: jest.fn(),
        };
    });
});

jest.mock('../../src/services/groupUser.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            addUser: jest.fn(),
            removeUser: jest.fn(),
        };
    });
});

jest.mock('../../src/validator/group.validator', () => {
    return {
        getGroupByIdValidator: {
            safeParseAsync: jest.fn(),
        },

    };
});

describe('Group Controller', () => {
    let groupService: jest.Mocked<GroupService>;
    let groupUserService: jest.Mocked<GroupUserService>;
    let groupController: GroupController;

    const groupData: IGroup = {
        name: 'Test Group',
        ownerId: 1,
    };

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
        groupService = container.resolve<GroupService>('groupService') as jest.Mocked<GroupService>;
        groupUserService = container.resolve<GroupUserService>('groupUserService') as jest.Mocked<GroupUserService>;
        groupController = new GroupController({ groupService, groupUserService });
    });

    test('should create a group', async () => {
        (validationRoutes.getGroupByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: groupData });
        groupService.create.mockResolvedValue({ id: 1, ...groupData });
        groupUserService.addUser.mockResolvedValue({ groupId: 1, userId: 1 });

        const req = { body: groupData } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await groupController.createGroup(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...groupData });
    });

    test('should return bad request error when creating a group with invalid ownerId', async () => {
        const req = { body: { name: 'Test Group', ownerId: 'invalid' } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await groupController.createGroup(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Invalid ownerId', statusCode: 400 });
    });

    test('should get a group by id', async () => {
        (validationRoutes.getGroupByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });
        groupService.findById.mockResolvedValue(groupData);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await groupController.getGroupById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(groupData);
    });

    test('should return bad request error when getting a group by id with validation failed', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid id', path: ['id'] }
                ]
            }
        };
        (validationRoutes.getGroupByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await groupController.getGroupById(req, res, next);

        const listOfErrors = invalidDataResult.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')
            };
        });

        expect(next).toHaveBeenCalledWith({ message: listOfErrors, statusCode: 400 });
    });

    test('should delete a group', async () => {
        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await groupController.deleteGroup(req, res, next);

        expect(res.json).toHaveBeenCalledWith({ message: 'Group deleted successfully' });
    });

});
