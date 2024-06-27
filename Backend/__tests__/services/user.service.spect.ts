import {Lifetime} from 'awilix';
import UserService from "../../src/services/user.service";
import UserRepository from "../../src/repository/user.repository";
import CognitoService from "../../src/services/cognito.service";
import dbConnection from "../../src/config/dbConnection.config";
import {config} from "dotenv";
import container from "../../src/container";
import {IUser} from "../../src/models/user.interface";
import {UserNotCreatedException,UserNotFoundException} from "../../src/exceptions/users.exceptions";


jest.mock('../../src/repository/user.repository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            delete: jest.fn(),
            getByEmail: jest.fn(),
            getByUserName: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn()
        }
    })
})
jest.mock('../../src/services/cognito.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            createUser: jest.fn(),
        }
    });
});
describe('User Service', () => {
    let userService: UserService;
    let cognitoService: jest.Mocked<CognitoService>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        userRepository = container.resolve<UserRepository>('userRepository') as jest.Mocked<UserRepository>;
        cognitoService = new CognitoService() as jest.Mocked<CognitoService>;
    });


    beforeEach(async () => {
        await dbConnection.sync({force: true});
        userService = container.resolve<UserService>('userService');

    });
    test('create a user', async () => {
        const newUser: IUser = {
            email: 'pepeargento@gmail.com',
            password: 'Pepe12345',
            name: 'Pepe',
            lastName: 'Argento',
            phoneNumber: '1145745458',
            username: 'epeArgento',
            id: 1,
        };
        cognitoService.createUser.mockResolvedValue(newUser.email);
        userRepository.create.mockResolvedValue(newUser);
        const userCreated = await userService.createUser(newUser);

        expect(userCreated.lastName).toBe(newUser.lastName);
    })
    test("create a user - userRepository does not create user", async () => {
        const newUser: IUser = {
            email: "pepeargento@gmail.com",
            password: "Pepe12345",
            name: "Pepe",
            lastName: "Argento",
            phoneNumber: "1145745458",
            username: "epeArgento",
            id: 1,
        };
        userRepository.create.mockRejectedValue(new Error('User not created'));
        try {
            const response = await userService.createUser(newUser);
            console.log("que devolvio", response)
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeInstanceOf(UserNotCreatedException);
            expect((error as Error).message).toEqual("User not created");
        }
    });
    test('should get user by email', async () => {
        const email = 'pepeargento@gmail.com';
        const expectedUser: IUser = {
            email: email,
            password: 'Pepe12345',
            name: 'Pepe',
            lastName: 'Argento',
            phoneNumber: '1145745458',
            username: 'epeArgento',
            id: 1,
        };

        userRepository.getByEmail.mockResolvedValue(expectedUser);

        const user = await userService.getUserByEmail(email);

        expect(user).toBeDefined();
        expect(user!.email).toBe(email);
        expect(user!.lastName).toBe(expectedUser.lastName);
    });
    test('should throw UserNotFoundException when user not found by email', async () => {
        const email = 'nonexistent@gmail.com';
        userRepository.getByEmail.mockResolvedValue(null)
        try {
            await userService.getUserByEmail(email);
            expect(true).toBe(false);
        } catch (error) {
            expect((error as Error).message).toBe('User not found.');
        }
    });
    test('should get user by username', async () => {
        const username = 'epeArgento';

        const expectedUser: IUser = {
            email: 'pepeargento@gmail.com',
            password: 'Pepe12345',
            name: 'Pepe',
            lastName: 'Argento',
            phoneNumber: '1145745458',
            username: username,
            id: 1,
        };

        userRepository.getByUserName.mockResolvedValue(expectedUser);

        const user = await userService.getUserByUserName(username);

        expect(user).toBeDefined();
        expect(user!.username).toBe(username);
        expect(user!.lastName).toBe(expectedUser.lastName);
    });

    test('should throw UserNotFoundException when user not found by username', async () => {
        const username = 'nonexistentUsername';

        userRepository.getByUserName.mockResolvedValue(null);

        try {
            await userService.getUserByUserName(username);
            expect(true).toBe(false);
        } catch (error) {
            expect((error as Error).message).toBe('User not found.');
        }
    });

    test('should get user by id', async () => {
        const id = 1;
        const expectedUser: IUser = {
            email: 'pepeargento@gmail.com',
            password: 'Pepe12345',
            name: 'Pepe',
            lastName: 'Argento',
            phoneNumber: '1145745458',
            username: 'epeArgento',
            id: id,
        };

        userRepository.getUserById.mockResolvedValue(expectedUser);

        const user = await userService.getUserById(id);

        expect(user).toBeDefined();
        expect(user!.id).toBe(id);
        expect(user!.email).toBe(expectedUser.email);
    });

    test('should throw UserNotFoundException when user not found by id', async () => {
        const id = 999;
        userRepository.getUserById.mockResolvedValue(null);

        try {
            await userService.getUserById(id);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeInstanceOf(UserNotFoundException);
            expect((error as Error).message).toBe('User not found.');
        }
    });

    test('should update user', async () => {
        const id = 1;
        const userData: Partial<IUser> = {
            name: 'UpdatedName',
            email: 'updated.email@example.com'
        };

        const expectedUser: IUser = {
            name: 'UpdatedName',
            lastName: 'Argento',
            email: 'updated.email@example.com',
            phoneNumber: '1145745458',
            username: 'epeArgento',
            password: 'Pepe12345',
            id: id,
        };

        userRepository.updateUser.mockResolvedValue(expectedUser);

        const updatedUser = await userService.updateUser(id, userData);

        expect(updatedUser).toBeDefined();
        expect(updatedUser.name).toBe('UpdatedName');
        expect(updatedUser.email).toBe('updated.email@example.com');
    });

    test('should throw UserNotFoundException when update fails', async () => {
        const id = 999;
        const userData: Partial<IUser> = {
            name: 'UpdatedName'
        };

        userRepository.updateUser.mockResolvedValue(null);

        try {
            await userService.updateUser(id, userData);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeInstanceOf(UserNotFoundException);
            expect((error as Error).message).toBe('User not found.');
        }
    });
})