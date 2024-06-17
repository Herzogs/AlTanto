import { IGroup, IGroupMember } from "../interfaces/group.interface";
import {IGroupRepository}  from "./interface/group.repository.interface";
import { ModelCtor, Model } from "sequelize";
import User from "./models/User";

class GroupRepository implements IGroupRepository<IGroup,IGroupMember>{

    private model: ModelCtor<Model<IGroup>>;

    constructor({ Group }: { Group: ModelCtor<Model<IGroup>> }) {
        this.model = Group;
    }
    
    async create(group: IGroup): Promise<IGroup | null> {
        const search = await this.model.findOne({where: {name: group.name}});
        if(search){
            return null
        }
        const groupCreated = await this.model.create({
            name: group.name,
            ownerId: group.ownerId,
            groupCode: group.groupCode
        });
        if(groupCreated)
            return groupCreated.get({plain: true}) as IGroup;
        
        return null
    }
    
    async findById(groupId: number): Promise< IGroup | null > {
        const group = await this.model.findByPk(groupId);
        if(group)
            return group.get({plain: true}) as IGroup;
        return null;
    }

    async remove(groupId: number): Promise<boolean> {
        const groupDeleted = await this.model.destroy({where: {id: groupId}});
        return groupDeleted > 0;
    }
    
    async findByName(name: string): Promise<IGroup | null> {
        console.log('name', name);
        const group = await this.model.findOne({where: {name}});
        if(group)
            return group.get({plain: true}) as IGroup;
        return null;
    }

    async findByOwner(ownerId: number): Promise<IGroup[]> {
        const groups = await this.model.findAll({where: {ownerId}});
        return groups.map(group => group.get({plain: true}) as IGroup);
    }

    async findByCode(groupCode: string): Promise<IGroup | null> {
        const group = await this.model.findOne({where: {groupCode}});
        if(group)
            return group.get({plain: true}) as IGroup;
        return null;
    }

    async getGroupMembers(groupId: number): Promise<IGroupMember> {
        try {
            const group = await this.model.findOne({
                where: { id: groupId },
                include: {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'name', 'lastName', 'username', 'email', 'phoneNumber'],
                    through: {
                        attributes: [],
                    }
                },
            });
    
            if (!group) {
                throw new Error('Group not found');
            }
            return group.get({ plain: true }) as IGroupMember;
        } catch (error) {
            console.error('Error fetching group members:', error);
            throw error;
        }
    }
}

export default GroupRepository;
