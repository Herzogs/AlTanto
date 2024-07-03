import {GroupMock} from '../mocks/group.mock'

import GroupRepository from "../../src/repository/group.repository";
import {CategoryMock} from "../mocks/category.mock";

describe('GroupRepository', () => {
    let groupRepository: GroupRepository;

    beforeAll(() => {
        groupRepository = new GroupRepository({Group: GroupMock})
    })
    it('should create a new group', async () => {
        const groupData = {
            id: 2,
            name: 'Test Group2',
            ownerId: 1,
            groupCode: 'cualquiera'
        }

        const groupCreated = await groupRepository.create(groupData);
        expect(groupCreated).toBeDefined();
        expect(groupCreated?.name).toEqual(groupData.name);
        expect(groupCreated?.id).toEqual(2);
    })
    it('should return null where a new group exists', async () => {
        const groupData = {
            id: 1,
            name: 'Test Group',
            ownerId: 1,
            groupCode: 'cualquiera'
        }

        const groupCreated = await groupRepository.create(groupData);
        expect(groupCreated).toBeNull();
    })

    it('should find group by id', async () => {

        const group = {
            id: 2,
            name: 'Test Group2',
            groupCode: 'cualquiera',
            ownerId: 1,
        }
        GroupMock.findByPk = jest.fn().mockResolvedValue(GroupMock.build(group));
        const groupSearch = await groupRepository.findById(group.id)
        expect(groupSearch).toBeDefined()
        expect(groupSearch?.name).toEqual(group.name);

    })
    it('should return null when group not exists ', async () => {
        const idNotExists = 88;
        GroupMock.findByPk = jest.fn().mockResolvedValue(null);
        const groupSearch = await groupRepository.findById(idNotExists)
        expect(groupSearch).toBeNull();
    })


    it('should find group by name', async () => {
        const group = {
            id: 2,
            name: 'Test Group',
            groupCode: 'cualquiera',
            ownerId: 1,
        }

        const groupSearch = await groupRepository.findByName(group.name)
        expect(groupSearch).toBeDefined()
        expect(groupSearch?.name).toEqual(group.name);

    })
    it('should find group by code', async () => {
        const group = {
            id: 2,
            name: 'Test Group',
            groupCode: 'cualquiera',
            ownerId: 1,
        }
        GroupMock.findOne = jest.fn(({where: {groupCode}}) => {
            if (groupCode === 'cualquiera') {
                return Promise.resolve(CategoryMock.build({ id: 1,
                    name: 'Test Group',
                    groupCode: 'cualquiera',
                    ownerId: 1,}));
            }
            return Promise.resolve(null);
        })
        const groupSearch = await groupRepository.findByCode(group.groupCode)
        expect(groupSearch).toBeDefined()
        expect(groupSearch?.name).toEqual(group.name);

    })
    it('should return null when code is not valid  ', async () => {
        const code = '88';
        GroupMock.findne = jest.fn().mockResolvedValue(null);
        const groupSearch = await groupRepository.findByCode(code)
        expect(groupSearch).toBeNull();
    })

})