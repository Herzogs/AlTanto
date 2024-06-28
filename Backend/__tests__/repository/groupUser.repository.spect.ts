import GroupUserRepository from '../../src/repository/groupUser.repository';
import container from '../../src/container';
import { config } from 'dotenv';
import { Lifetime } from 'awilix';
import dbConnection from '../../src/config/dbConnection.config';
// import { IGroupUser } from '../../src/models/group.interface';

describe('GroupUser Repository', () => {
    let groupUserRepository: GroupUserRepository;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED],
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true }); 
        groupUserRepository = container.resolve<GroupUserRepository>('groupUserRepository');
    });

    afterAll(async () => {
    });

    // test('should create a group user', async () => {
    //     const groupUser: IGroupUser = { groupId: 1, userId: 10 };

    //     try {
    //         const createdGroupUser = await groupUserRepository.create(groupUser);

    //         expect(createdGroupUser).toBeDefined();
    //         expect(createdGroupUser!.groupId).toBe(groupUser.groupId);
    //         expect(createdGroupUser!.userId).toBe(groupUser.userId);
    //     } catch (error) {
    //         console.error('Error creating group user:', error);
    //         throw error; 
    //     }
    // });

    // test('should return null if group user already exists', async () => {
    //     const groupUser = { groupId: 1, userId: 10 };
    //     await groupUserRepository.create(groupUser);

    //     const duplicateGroupUser = { groupId: 1, userId: 10 };
    //     const createdGroupUser = await groupUserRepository.create(duplicateGroupUser);

    //     expect(createdGroupUser).toBeNull();
    // });

    // test('should remove a group user', async () => {
    //     const groupUser = { groupId: 1, userId: 10 };
    //     await groupUserRepository.create(groupUser);

    //     const removed = await groupUserRepository.remove(groupUser);

    //     expect(removed).toBe(true);
    // });

    // test('should fetch group members by groupId', async () => {
    //     const groupId = 1;
    //     const groupMembers = [
    //         { groupId: 1, userId: 1 },
    //         { groupId: 1, userId: 2 },
    //     ];
    //     await Promise.all(groupMembers.map(member => groupUserRepository.create(member)));

    //     const fetchedMembers = await groupUserRepository.getMembers(groupId);

    //     expect(fetchedMembers).toBeDefined();
    //     expect(fetchedMembers!.length).toBe(groupMembers.length);
    // });

    test('should return an empty array if groupId does not exist', async () => {
        const groupId = 999;
    
        const fetchedMembers = await groupUserRepository.getMembers(groupId);
    
        expect(fetchedMembers).toEqual([]); 
    });

    // test('should fetch all group users by userId', async () => {
    //     const userId = 10;
    //     const groupUsers = [
    //         { groupId: 1, userId },
    //         { groupId: 2, userId },
    //     ];
    //     await Promise.all(groupUsers.map(user => groupUserRepository.create(user)));

    //     const fetchedUsers = await groupUserRepository.findAllByUserId(userId);

    //     expect(fetchedUsers).toBeDefined();
    //     expect(fetchedUsers!.length).toBe(groupUsers.length);
    // });
});
