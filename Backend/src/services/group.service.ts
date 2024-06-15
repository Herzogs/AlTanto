import GroupRepository from "../repository/group.repository";
import { IGroup, IGroupUser } from "../interfaces/group.interface";
import { IGroupService } from "./interfaces/group.service.interface";
import { IGroupRepository } from "../repository/interface/group.repository.interface";
import { GroupNotCreatedException } from "../exceptions/group.exceptions";

class GroupService implements IGroupService<IGroup, IGroupUser> {

    private groupRepository: IGroupRepository<IGroup>;

    constructor({ groupRepository }: { groupRepository: IGroupRepository<IGroup> }) {
        this.groupRepository = groupRepository;
    }

    async getAllByOwner(userId: number): Promise<IGroup[]> {
        return await this.groupRepository.findByOwner(userId);
    }

    async create(group: IGroup): Promise<IGroup> {
        const result = await this.groupRepository.create(group);
        if (!result)
            throw new GroupNotCreatedException('Error creating group');
        return result;
    }

    async remove(id: number): Promise<boolean> {
        const groupRemoved = await this.groupRepository.remove(id);
        return groupRemoved;
    }

    async validateGroupCode(groupCode: string): Promise<boolean> {
        const result = await this.groupRepository.findByCode(groupCode);
        if (!result)
            throw new Error(`Error validating group code`);
        return true;
    }

    async findByName(name: string): Promise<IGroup> {
        console.log('En el servicio ===> ', name);
        const result = await this.groupRepository.findByName(name);
        if (!result)
            throw new Error(`Error searching group by name`);
        return result;
    }

    async findAllByGroupId(groupUser: IGroupUser[]): Promise<IGroup[]> {
        const listOfGroups: IGroup[] = [];
        groupUser.forEach(async (group) => {
            const groupSearched = await this.groupRepository.findById(group.groupId);
            if (groupSearched) {
                listOfGroups.push(groupSearched);
            }
        });
        return listOfGroups;
    }

    async findById(id: number): Promise<IGroup> {
        const result = await this.groupRepository.findById(id);
        if (!result)
            throw new Error(`Error searching group by id`);
        return result;
    }

}

export default GroupService;