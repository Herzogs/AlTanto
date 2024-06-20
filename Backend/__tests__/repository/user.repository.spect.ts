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
        const UserModal: ModelCtor<User> = container.resolve<ModelCtor<User>>('User'); // Asegúrate de obtener el modelo correcto desde el contenedor
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
            id:3
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
            id:3
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
            id:3
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
});
