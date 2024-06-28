import { IGroupUser } from "../models/group.interface";
import { IGroupUserRepository } from "./interface/groupUser.repository.interface";
import { ModelCtor, Model } from "sequelize";

class GroupUserRepository implements IGroupUserRepository<IGroupUser> {
    private model: ModelCtor<Model<IGroupUser>>;

    constructor({ GroupUser }: { GroupUser: ModelCtor<Model<IGroupUser>> }) {
        this.model = GroupUser;
    }

    async create(groupUser: IGroupUser): Promise<IGroupUser | null> {
        const search = await this.model.findOne({ where: { groupId: groupUser.groupId, userId: groupUser.userId } });
        if (search) {
            return null;
        }
        console.log(groupUser);
        const groupUserCreated = await this.model.create({
            groupId: groupUser.groupId,
            userId: groupUser.userId
        });
        if (groupUserCreated)
            return groupUserCreated.get({ plain: true }) as IGroupUser;

        return null;
    }

    async remove(groupUser: IGroupUser): Promise<boolean> {
        const groupUserDeleted = await this.model.destroy({
            where: {
                groupId: groupUser.groupId,
                userId: groupUser.userId
            }
        });
        return groupUserDeleted > 0;
    }

    async getMembers(groupId: number): Promise<IGroupUser[] | null> {
        try {
            const groupMembers = await this.model.findAll({
                where: { groupId }
            });
            return groupMembers.map(groupMember => groupMember.get({ plain: true }) as IGroupUser);
        } catch (error) {
            console.log(error);
        }
        return null
    }

    async findAllByUserId(userId: number): Promise<IGroupUser[]> {
        const groupUsers = await this.model.findAll({ where: { userId } });
        return groupUsers.map(groupUser => groupUser.get({ plain: true }) as IGroupUser);
    }
}

export default GroupUserRepository;
