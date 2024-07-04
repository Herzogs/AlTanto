import { IGroupUser } from "../models/group.interface";
import { IGroupUserRepository } from "../repository/interface/groupUser.repository.interface";
import { UserNotFoundException } from "../exceptions/users.exceptions";
import { IGroupUserService } from "./interfaces/groupUser.service.interface";
import { INotificationService } from "./interfaces/notification.service.interface";

class GroupUserService implements IGroupUserService<IGroupUser>{
    
        private groupUserRepository: IGroupUserRepository<IGroupUser>;
        private notificationService: INotificationService;
    
        constructor({ groupUserRepository, notificationService }: { groupUserRepository: IGroupUserRepository<IGroupUser>, notificationService: INotificationService }) {
            this.groupUserRepository = groupUserRepository;
            this.notificationService= notificationService;
        }
    
        async addUser(groupUser: IGroupUser): Promise<IGroupUser> {
            const groupUserCreated = await this.groupUserRepository.create(groupUser);
            if (!groupUserCreated) throw new UserNotFoundException('User not found in group');
            return groupUser;
        }
    
        async removeUser(groupUser: IGroupUser): Promise<boolean> {
            const notificationSend = await this.notificationService.sendNotificationRemoveUser(groupUser.groupId, groupUser.userId!)
            if(notificationSend){
                const removed = await this.groupUserRepository.remove(groupUser);
                if (!removed) throw new UserNotFoundException('User not found in group');
                return removed;
            }
            return false;
        }

        async findAllByUserId(userId: number): Promise<IGroupUser[]> {
            return await this.groupUserRepository.findAllByUserId(userId);
        }

        /*async findAllMembers(groupId: number): Promise<IGroupMember> {
            const result = await this.groupUserRepository.getMembers(groupId);
            if (!result) throw new UserNotFoundException('Members not found');
            return result;
        }*/

}

export default GroupUserService;