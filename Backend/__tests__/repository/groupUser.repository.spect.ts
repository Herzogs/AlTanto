import {GroupUserMock} from '../mocks/groupUser.mock'
import GroupUserRepository from "../../src/repository/groupUser.repository";
import {RoadMock} from "../mocks/road.mock";

describe('GroupUserRepository', ()=>{
    let groupUserRepository: GroupUserRepository;

    beforeAll(()=>{
        groupUserRepository= new GroupUserRepository({GroupUser:GroupUserMock});
    })
    it('should create a new group', async () => {
        const groupData = {
            id: 1,
            userId:1,
            groupId: 1,
        }

        const groupCreated = await groupUserRepository.create(groupData);
        expect(groupCreated).toBeDefined();
        expect(groupCreated?.userId).toEqual(1)

    })
    it('should not create a new group where exists', async () => {
        const groupData = {
            id: 2,
            userId:2,
            groupId: 2,
        }

        const groupCreated = await groupUserRepository.create(groupData);
        expect(groupCreated).toBeNull();


    })
    it('should all group by user', async () => {
        const userId= 2;
        const groupData = [{
            id: 2,
            userId:2,
            groupId: 2,
        },{
            id: 3,
            userId:2,
            groupId: 3,
        }
        ]

        GroupUserMock.findAll= jest.fn(({ where: { userId  } }) => {
            if (userId===2) {

             return  [  GroupUserMock.build({
                    id: 2,
                    userId:2,
                    groupId: 2,
                }), GroupUserMock.build({
                   id: 3,
                   userId:2,
                   groupId: 3,
               })]
            }
            return Promise.resolve([]);
        });
        const groupCreated = await groupUserRepository.findAllByUserId(userId);
       console.log(groupCreated
       );
        expect(groupCreated).toBeDefined();
        expect(groupCreated).toHaveLength(2)


    })

})