import { IGroup } from "../interfaces/group.interface";
import Group from "./models/Group";
import {IGroupRepository}  from "./interface/group.repository.interface";

class GroupRepository implements IGroupRepository<IGroup>{

    private model: typeof Group;

    constructor(model = Group){
        this.model = model;
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
}

export default new GroupRepository();
