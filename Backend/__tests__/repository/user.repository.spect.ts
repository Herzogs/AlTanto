import UserRepository from "../../src/repository/user.repository";
import { IUser } from "../../src/models/user.interface";
import container from "../../src/container";
import { config } from "dotenv";
import { Lifetime } from "awilix";
import dbConnection from "../../src/config/dbConnection.config";
import User from "../../src/repository/entities/User";
import { ModelCtor } from "sequelize";

describe('User Repository', () => {
    let userRepository: UserRepository;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED],
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
        const UserModal: ModelCtor<User> = container.resolve<ModelCtor<User>>('User');
        userRepository = new UserRepository({ User: UserModal });
    });

    test('should create a user', async () => {
        const newUser: IUser = {
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'Test',
            lastName: 'User',
            phoneNumber: '123456789',
            username: 'testuser',
            rol: 'USER',
            id: 1
        };

        const createdUser = await userRepository.create(newUser);
        expect(createdUser).toBeDefined();
        expect(createdUser.email).toBe(newUser.email);
    });

    test('should get a user by email', async () => {
        const newUser: IUser = {
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'Test',
            lastName: 'User',
            phoneNumber: '123456789',
            username: 'testuser',
            rol: 'USER',
            id: 2
        };

        await userRepository.create(newUser);

        const fetchedUser = await userRepository.getByEmail(newUser.email);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser!.email).toBe(newUser.email);
    });

    test('should return null when user not found by email', async () => {
        const nonExistentEmail = 'nonexistent@gmail.com';

        const fetchedUser = await userRepository.getByEmail(nonExistentEmail);
        expect(fetchedUser).toBeNull();
    });

    test('should get a user by username', async () => {
        const newUser: IUser = {
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'Test',
            lastName: 'User',
            phoneNumber: '123456789',
            username: 'testuser',
            rol: 'USER',
            id: 3
        };

        await userRepository.create(newUser);

        const fetchedUser = await userRepository.getByUserName(newUser.username);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser!.username).toBe(newUser.username);
    });

    test('should return null when user not found by username', async () => {
        const nonExistentUserName = 'nonexistentuser';

        const fetchedUser = await userRepository.getByUserName(nonExistentUserName);
        expect(fetchedUser).toBeNull();
    });

    test('should get a user by id', async () => {
        const newUser: IUser = {
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'Test',
            lastName: 'User',
            phoneNumber: '123456789',
            username: 'testuser',
            rol: 'USER',
            id: 4
        };

        const createdUser = await userRepository.create(newUser);

        const fetchedUser = await userRepository.getUserById(createdUser.id);
        console.log('Fetched User by ID:', fetchedUser);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser!.id).toBe(createdUser.id);
    });

    test('should return null when user not found by id', async () => {
        const nonExistentId = 999;

        const fetchedUser = await userRepository.getUserById(nonExistentId);
        expect(fetchedUser).toBeNull();
    });

    // test('should update a user', async () => {
    //     const newUser: IUser = {
    //         email: 'testuser@gmail.com',
    //         password: 'password123',
    //         name: 'Test',
    //         lastName: 'User',
    //         phoneNumber: '123456789',
    //         username: 'testuser',
    //         rol: 'USER',
    //         id: 5
    //     };
    
    //     const createdUser = await userRepository.create(newUser);
    //     expect(createdUser).toBeDefined();
    //     expect(createdUser.id).toBeDefined();
    
    //     const updatedData: Partial<IUser> = {
    //         name: 'UpdatedTest',
    //         email: 'updateduser@gmail.com'
    //     };
    
    //     const updatedUser = await userRepository.updateUser(createdUser.id, updatedData);
    //     expect(updatedUser).toBeDefined();
    //     expect(updatedUser!.name).toBe(updatedData.name);
    //     expect(updatedUser!.email).toBe(updatedData.email);
    // });

    test('should return null when user not found for update', async () => {
        const nonExistentId = 999;
        const updatedData: Partial<IUser> = {
            name: 'UpdatedTest'
        };

        const updatedUser = await userRepository.updateUser(nonExistentId, updatedData);
        expect(updatedUser).toBeNull();
    });
});
