import GroupUserRepository from "../repository/groupUser.repository";
import { IGroupMember, IGroupUser } from "../interfaces/group.interface";
import { IGroupUserRepository } from "repository/interface/groupUser.repository.interface";
import { UserNotFoundException } from "../exceptions/users.exceptions";
import { IGroupUserService } from "./interfaces/groupUser.service.interface";

class GroupUserService implements IGroupUserService<IGroupUser, IGroupMember>{
    
        private groupUserRepository: IGroupUserRepository<IGroupUser, IGroupMember>;
    
        constructor(groupUserRepository = GroupUserRepository) {
            this.groupUserRepository = groupUserRepository;
        }
    
        async addUser(groupUser: IGroupUser): Promise<IGroupUser> {
            const groupUserCreated = await this.groupUserRepository.create(groupUser);
            if (!groupUserCreated) throw new UserNotFoundException('User not found in group');
            return groupUser;
        }
    
        async removeUser(groupUser: IGroupUser): Promise<boolean> {
            const removed = await this.groupUserRepository.remove(groupUser);
            if (!removed) throw new UserNotFoundException('User not found in group');
            return removed;
        }

        async findAllByUserId(userId: number): Promise<IGroupUser[]> {
            return await this.groupUserRepository.findAllByUserId(userId);
        }

        async findAllMembers(groupId: number): Promise<IGroupMember> {
            const result = await this.groupUserRepository.getMembers(groupId);
            if (!result) throw new UserNotFoundException('Members not found');
            return result;
        }

}

export default new GroupUserService();