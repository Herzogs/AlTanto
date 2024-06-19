import GroupRepository from "../../src/repository/group.repository";
import { IGroup, IGroupMember } from "../../src/models/group.interface";
import { ModelCtor, Model, Sequelize } from "sequelize";
import User from "../../src/repository/entities/User";

describe('Group Repository', () => {
    let GroupModelMock: ModelCtor<Model<IGroup>>;
    let groupRepository: GroupRepository;

    beforeAll(() => {
        const sequelizeMock = new Sequelize() as any;
        GroupModelMock = sequelizeMock.define('Group', {}) as ModelCtor<Model<IGroup>>;
    });

    beforeEach(() => {
        groupRepository = new GroupRepository({ Group: GroupModelMock });
    });

    test('should create a group', async () => {
        const groupData: IGroup = {
            name: 'Test Group',
            ownerId: 1,
            groupCode: 'ABC123'
        };

        GroupModelMock.findOne = jest.fn().mockResolvedValue(null);
        GroupModelMock.create = jest.fn().mockResolvedValue(groupData as any);

        const createdGroup = await groupRepository.create(groupData);

        expect(GroupModelMock.findOne).toHaveBeenCalledWith({ where: { name: groupData.name } });
        expect(GroupModelMock.create).toHaveBeenCalledWith({
            name: groupData.name,
            ownerId: groupData.ownerId,
            groupCode: groupData.groupCode
        });
        expect(createdGroup).toEqual(groupData);
    });

    test('should get a group by id', async () => {
        const groupId = 1;
        const groupData: IGroup = {
            id: groupId,
            name: 'Test Group',
            ownerId: 1,
            groupCode: 'ABC123'
        };

        GroupModelMock.findByPk = jest.fn().mockResolvedValue(groupData as any);

        const fetchedGroup = await groupRepository.findById(groupId);

        expect(GroupModelMock.findByPk).toHaveBeenCalledWith(groupId);
        expect(fetchedGroup).toEqual(groupData);
    });

    test('should get all groups by owner', async () => {
        const ownerId = 1;
        const groupsData: IGroup[] = [
            { id: 1, name: 'Group 1', ownerId, groupCode: 'ABC123' },
            { id: 2, name: 'Group 2', ownerId, groupCode: 'XYZ789' }
        ];

        GroupModelMock.findAll = jest.fn().mockResolvedValue(groupsData as any);

        const fetchedGroups = await groupRepository.findByOwner(ownerId);

        expect(GroupModelMock.findAll).toHaveBeenCalledWith({ where: { ownerId } });
        expect(fetchedGroups).toEqual(groupsData);
    });

    test('should get group members by group id', async () => {
        // Datos de prueba para obtener los miembros de un grupo por su ID
        const groupId = 1;
        const groupMemberData: IGroupMember = {
            name: 'Group 1',
            ownerId: 1,
            members: [{
                name: 'John Doe',
                lastName: 'Doe',
                email: 'johndoe@example.com'
            }]
        };

        GroupModelMock.findOne = jest.fn().mockResolvedValue({ get: () => groupMemberData } as any);

        const fetchedGroupMembers = await groupRepository.getGroupMembers(groupId);

        expect(GroupModelMock.findOne).toHaveBeenCalledWith({
            where: { id: groupId },
            include: {
                model: User,
                as: 'members',
                attributes: ['id', 'name', 'lastName', 'username', 'email', 'phoneNumber'],
                through: { attributes: [] }
            }
        });
        expect(fetchedGroupMembers).toEqual(groupMemberData);
    });
});
