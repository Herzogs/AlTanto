import { Request, Response, NextFunction } from 'express';
import UserController from '../../src/controllers/user.controller';
import { IUser } from '../../src/models/user.interface';
import { IUserService } from '../../src/services/interfaces/user.service.interface';
import { STATUS_CODE } from '../../src/utilities/statusCode.utilities';

const userServiceMock: jest.Mocked<IUserService<IUser>> = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByUserName: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn()
};

describe('User Controller', () => {
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController({ userService: userServiceMock });
    });

    test('should get user by name', async () => {
        const userData: IUser = {
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '123456789',
            username: 'johndoe',
            password: 'password123',
            id: 1,
        };

        userServiceMock.getUserByUserName.mockResolvedValue(userData);

        const req = { params: { name: 'johndoe' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.getUserByName(req, res, next);

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(userData);
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle user not found by name', async () => {
        userServiceMock.getUserByUserName.mockRejectedValue(new Error('User not found'));

        const req = { params: { name: 'unknownuser' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.getUserByName(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'User not found', statusCode: STATUS_CODE.SERVER_ERROR });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

     test('should get user by id', async () => {
        const userData: IUser = {
            name: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phoneNumber: '987654321',
            username: 'janedoe',
            password: 'password123',
            id: 2,
        };

        userServiceMock.getUserById.mockResolvedValue(userData);

        const req = { params: { id: '2' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.getUserById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(userData);
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle user not found by id', async () => {
        userServiceMock.getUserById.mockRejectedValue(new Error('User not found'));

        const req = { params: { id: '999' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.getUserById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'User not found', statusCode: STATUS_CODE.SERVER_ERROR });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should update user', async () => {
        const userData: Partial<IUser> = {
            name: 'UpdatedName',
            email: 'updated.email@example.com'
        };

        const updatedUserData: IUser = {
            name: 'UpdatedName',
            lastName: 'Doe',
            email: 'updated.email@example.com',
            phoneNumber: '123456789',
            username: 'johndoe',
            password: 'password123',
            id: 1,
        };

        userServiceMock.updateUser.mockResolvedValue(updatedUserData);

        const req = { params: { id: '1' }, body: userData } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.updateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(updatedUserData);
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle error while updating user', async () => {
        userServiceMock.updateUser.mockRejectedValue(new Error('Update failed'));

        const req = { params: { id: '1' }, body: { name: 'UpdatedName' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await userController.updateUser(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Update failed', statusCode: STATUS_CODE.SERVER_ERROR });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
