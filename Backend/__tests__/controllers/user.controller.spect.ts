import { Request, Response, NextFunction } from 'express';
import UserController from '../../src/controllers/user.controller';
import { IUser } from '../../src/models/user.interface';
import { IUserService } from '../../src/services/interfaces/user.service.interface';
import { STATUS_CODE } from '../../src/utilities/statusCode.utilities';

const userServiceMock: jest.Mocked<IUserService<IUser>> = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByUserName: jest.fn(),
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
});
