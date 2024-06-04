import  Group  from '../models/Group';
import { GroupUser } from '../models/GroupUser'; 
import  User  from '../models/User';
import { IGroup } from '../interfaces/group.interface';

class GroupRepository{

    static async getAll(): Promise<IGroup[]>{
        const groups = await Group.findAll({ include: [{ model: User, as: 'members' }] });
        return groups.map(group => group.toJSON());
    };
    
    static async getById(id: number): Promise<IGroup | null>{
        const group = await Group.findByPk(id, { include: [{ model: User, as: 'members' }] });
        return group ? group.toJSON() : null;
    };
    
    static async create(name: string, ownerId: number): Promise<IGroup>{
        const newGroup = await Group.create({ name, ownerId });
        return newGroup.toJSON();
    };
    
    static async updateName(id: number, name: string): Promise<IGroup | null>{
        const group = await Group.findByPk(id);
        if (group) {
            group.name = name;
            await group.save();
            return group.toJSON();
        }
        return null;
    };
    
    static async remove(id: number): Promise<boolean>{
        const group = await Group.findByPk(id);
        if (group) {
            await group.destroy();
            return true;
        }
        return false;
    };
    
    static async addUser(groupId: number, userId: number): Promise<GroupUser>{
        return await GroupUser.create({ groupId, userId });
    };
    
    static async removeUser(groupId: number, userId: number): Promise<boolean>{
        const groupUser = await GroupUser.findOne({ where: { groupId, userId } });
        if (groupUser) {
            await groupUser.destroy();
            return true;
        }
        return false;
    };
    
    static async findByName(name: string): Promise<Group | null>{
        try {
            const group = await Group.findOne({ where: { name } });
            return group;
        } catch (error) {
            throw new Error(`Error buscando el grupo por nombre`);
        }
    }

    static async getGroupsByUserId(userId: number): Promise<Group[]> {
        try {
            const groups = await Group.findAll({
                include: [{ association: 'members', where: { userId } }] // Busca los grupos asociados al usuario con el ID dado
            });
    
            return groups;
        } catch (error) {
            throw new Error('Error al obtener los grupos del usuario');
        }
    }
    
}


export default GroupRepository;