import { IGroup, IGroupMember, IGroupReport, IGroupUser } from "../models/group.interface";
import { IGroupService } from "./interfaces/group.service.interface";
import { IGroupRepository } from "../repository/interface/group.repository.interface";
import { GroupNotCreatedException } from "../exceptions/group.exceptions";
import { IReportService } from "./interfaces/report.service.interface";
import { IReportDto } from "models/reports.interface";

class GroupService implements IGroupService<IGroup, IGroupUser, IGroupMember> {

    private groupRepository: IGroupRepository<IGroup,IGroupMember>;
    private reportService: IReportService<IReportDto>;

    constructor({ groupRepository, reportService }: { 
        groupRepository: IGroupRepository<IGroup,IGroupMember>, 
        reportService: IReportService<IReportDto>}) {
            this.groupRepository = groupRepository;
            this.reportService = reportService;
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

    async findMembersByGroupId(groupId: number): Promise<IGroupMember> {
        const result = await this.groupRepository.getGroupMembers(groupId);
        console.log(result);
        if (!result)
            throw new Error(`Error searching group members by group id`);
        return result;
    }

    async getNotifications(id: number): Promise<IGroupReport[]> {
        const groupUser = await this.groupRepository.findByOwner(id);
        const reportByZone: IGroupReport[] = [];
        for (const group of groupUser) {
            const result = await this.reportService.getReportsByGroup(group.id as number);
            reportByZone.push({
                groupName: group.name,
                reports: result as IReportDto[]
            });
        }
        return reportByZone;
    }
}

export default GroupService;