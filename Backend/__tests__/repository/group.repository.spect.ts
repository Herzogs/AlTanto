import GroupRepository from "../../src/repository/group.repository";
import { IGroup } from "../../src/models/group.interface";
import { config } from "dotenv";
import container from "../../src/container";
import { Lifetime } from "awilix";
import UserRepository from "../../src/repository/user.repository";
import dbConnection from "../../src/config/dbConnection.config";

describe('Group Repository', () => {
    let groupRepository: GroupRepository;
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
        groupRepository = container.resolve<GroupRepository>('groupRepository');
        userRepository = container.resolve<UserRepository>('userRepository');
    });

    afterEach(async () => {
    });

    afterAll(async () => {
        await dbConnection.close();
    });

    test('should create a group', async () => {
        const userData = {
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        };

        await userRepository.create(userData);

        const groupData: IGroup = {
            name: 'Test Group',
            ownerId: userData.id,
            groupCode: 'ABC123'
        };

        try {
            const createdGroup = await groupRepository.create(groupData);
            expect(createdGroup).toBeDefined();
            expect(createdGroup!.name).toBe(groupData.name);
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    });

    test('should get a group by id', async () => {
        const userData = {
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        };

        await userRepository.create(userData);

        const groupData: IGroup = {
            name: 'Another Test Group',
            ownerId: userData.id,
            groupCode: 'XYZ789'
        };

        const createdGroup = await groupRepository.create(groupData);

        try {
            const fetchedGroup = await groupRepository.findById(createdGroup!.id as number);
            expect(fetchedGroup).toBeDefined();
            expect(fetchedGroup!.name).toBe(groupData.name);
        } catch (error) {
            console.error('Error fetching group by id:', error);
            throw error;
        }
    });

    test('should get all groups by owner', async () => {
        const userData = {
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        };

        await userRepository.create(userData);

        const groupData: IGroup = {
            name: 'Test Group 1',
            ownerId: userData.id,
            groupCode: '123ABC'
        };

        await groupRepository.create(groupData);

        try {
            const groups = await groupRepository.findByOwner(userData.id);
            expect(groups).toBeDefined();
            expect(groups.length).toBeGreaterThan(0);
        } catch (error) {
            console.error('Error fetching groups by owner:', error);
            throw error;
        }
    });

    test('should return null if group with the same name exists', async () => {
        const userData = {
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        };

        await userRepository.create(userData);

        const groupData: IGroup = {
            name: 'Duplicate Group',
            ownerId: userData.id,
            groupCode: 'DEF456'
        };

        await groupRepository.create(groupData);

        try {
            const createdGroup2 = await groupRepository.create(groupData);
            expect(createdGroup2).toBeNull();
        } catch (error) {
            console.error('Error creating duplicate group:', error);
            throw error;
        }
    });

    test('should remove a group by id', async () => {
        const userData = {
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        };

        await userRepository.create(userData);

        const groupData: IGroup = {
            name: 'Group to be deleted',
            ownerId: userData.id,
            groupCode: 'DELETE123'
        };

        const createdGroup = await groupRepository.create(groupData);

        try {
            const groupId = createdGroup!.id as number;
            const isRemoved = await groupRepository.remove(groupId);
            expect(isRemoved).toBeTruthy();

            const fetchedGroup = await groupRepository.findById(groupId);
            expect(fetchedGroup).toBeNull();
        } catch (error) {
            console.error('Error removing group:', error);
            throw error;
        }
    });
});

