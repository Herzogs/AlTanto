import { IGroupUser, IGroupMember } from "../interfaces/group.interface";
import { GroupUser } from "./models/GroupUser";
import  User from "./models/User";
import { IGroupUserRepository } from "./interface/groupUser.repository.interface";

class GroupUserRepository implements IGroupUserRepository<IGroupUser,IGroupMember>{
    private model: typeof GroupUser;

    constructor(model = GroupUser) {
        this.model = model;
    }

    async create(groupUser: IGroupUser): Promise<IGroupUser | null> {
        const search = await this.model.findOne({ where: { groupId: groupUser.groupId, userId: groupUser.userId } });
        if (search) {
            return null;
        }
        const groupUserCreated = await this.model.create({
            groupId: groupUser.groupId,
            userId: groupUser.userId
        });
        if (groupUserCreated)
            return groupUserCreated.get({ plain: true }) as IGroupUser;

        return null;
    }

    async remove(groupUser: IGroupUser): Promise<boolean> {
        const groupUserDeleted = await this.model.destroy({ where: {
            groupId: groupUser.groupId,
            userId: groupUser.userId
        } });
        return groupUserDeleted > 0;
    }

    async getMembers(groupId: number): Promise<IGroupMember | null> {
        const groupMembers = await this.model.findByPk(groupId, {
            include: [{ model: User, as: 'members', through: { attributes: [] } }]
        });
        if(groupMembers){
            const groupMembersPlain = groupMembers.get({plain: true});
            const groupMember: IGroupMember = {
                id: groupMembersPlain.id,
                name: groupMembersPlain.name,
                ownerId: groupMembersPlain.ownerId,
                members: groupMembersPlain.members.map((member: {
                    name: string;
                    lastName: string;
                    email: string;
                }) => {
                    return {
                        name: member.name,
                        lastName: member.lastName,
                        email: member.email
                    }
                })
            };
            return groupMember;
        }
        return null;
    }

    async findAllByUserId(userId: number): Promise<IGroupUser[]> {
        const groupUsers = await this.model.findAll({ where: { userId } });
        return groupUsers.map(groupUser => groupUser.get({ plain: true }) as IGroupUser);
    }


}

export default new GroupUserRepository();