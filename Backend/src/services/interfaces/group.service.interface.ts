export interface IGroupService<T,K,E> {
    getAllByOwner(userId: number): Promise<T[]>;
    create(group: T): Promise<T>;
    remove(id: number): Promise<boolean>;
    validateGroupCode(groupCode: string): Promise<boolean>;
    findByName(name: string): Promise<T>;
    findAllByGroupId(groupUser: K[]): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    findMembersByGroupId(groupId: number): Promise<E>;
}