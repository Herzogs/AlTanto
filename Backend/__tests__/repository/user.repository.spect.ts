import UserRepository from '../../src/repository/user.repository';
import {UserMock} from '../mocks/user.mock';
import {IUser} from '../../src/models/user.interface';

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository({User: UserMock});
    });

    it('should create a new user', async () => {
        const newUser: IUser = {
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john.doe@example.com',
            phoneNumber: '123456789',
            password: 'Pepe1235',
            rol: 'USER',
        };
        UserMock.create = jest.fn().mockReturnValue({
            id: 1,
            name: newUser.name,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            rol: newUser.rol,
            get: jest.fn().mockReturnValue(newUser)
        });

        const createdUser = await userRepository.create(newUser);

        expect(UserMock.create).toHaveBeenCalledWith({
            name: newUser.name,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            rol: newUser.rol,
        });

        expect(createdUser).toEqual(newUser);

    });
    it('should delete a user by email', async () => {
        const emailToDelete = 'john.doe@example.com';
        UserMock.destroy = jest.fn().mockResolvedValue(1);
        await userRepository.delete(emailToDelete);
        expect(UserMock.destroy).toHaveBeenCalledWith({
            where: {email: emailToDelete},
        });
    });

    it('should handle delete error gracefully', async () => {
        const emailToDelete = 'nonexistent.user@example.com';
        UserMock.destroy = jest.fn().mockResolvedValue(0);

        await expect(userRepository.delete(emailToDelete)).resolves.not.toThrow();
    });
    it('should find user by email', async () => {
        const userEmail = 'john.doe@example.com';
        const expectedUser: IUser = {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: userEmail,
            phoneNumber: '123456789',
            password: undefined,
            rol: 'USER',
        };

        UserMock.findOne = jest.fn().mockResolvedValue({
            ...expectedUser,
            get: jest.fn().mockReturnValue(expectedUser),
        });

        const foundUser = await userRepository.getByEmail(userEmail);

        expect(UserMock.findOne).toHaveBeenCalledWith({
            where: {email: userEmail},
        });

        expect(foundUser).toEqual(expectedUser);
    });

    it('should return null for non-existing user', async () => {
        const userEmail = 'nonexistent.user@example.com';
        UserMock.findOne = jest.fn().mockResolvedValue(null);
        const foundUser = await userRepository.getByEmail(userEmail);

        expect(UserMock.findOne).toHaveBeenCalledWith({
            where: {email: userEmail},
        });

        expect(foundUser).toBeNull();
    });


    it('should return null when updating a non-existing user', async () => {
        const nonExistingUserId = 999;
        const updatedUserData: Partial<IUser> = {
            name: 'Updated John',
            lastName: 'Updated Doe',
        };

        UserMock.update = jest.fn().mockResolvedValue([0, []]);
        const updatedUser = await userRepository.updateUser(nonExistingUserId, updatedUserData);
        expect(UserMock.update).toHaveBeenCalledWith(updatedUserData, {
            where: {id: nonExistingUserId},
            returning: true,
        });

        expect(updatedUser).toBeNull();
    });
    it('should get a user by ID', async () => {
        const userId = 1;
        const expectedUser: IUser = {
            id: userId,
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john.doe@example.com',
            phoneNumber: '123456789',
            rol: 'USER',
        };
        UserMock.findByPk = jest.fn().mockResolvedValue({
            ...expectedUser,
            get: jest.fn().mockReturnValue(expectedUser),
        });

        const user = await userRepository.getUserById(userId);
        expect(UserMock.findByPk).toHaveBeenCalledWith(userId);
        expect(user).toEqual(expectedUser);
    });

    it('should return null when user ID does not exist', async () => {
        const nonExistingUserId = 999;

        UserMock.findByPk = jest.fn().mockResolvedValue(null);

        const user = await userRepository.getUserById(nonExistingUserId);

        expect(UserMock.findByPk).toHaveBeenCalledWith(nonExistingUserId);

        expect(user).toBeNull();
    });

});
