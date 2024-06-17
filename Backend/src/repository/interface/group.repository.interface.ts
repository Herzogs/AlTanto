export interface IGroupRepository<T,K> {
    create(group: T): Promise<T | null>;
    remove(groupId: number): Promise<boolean>;
    findById(groupId: number): Promise<T | null>;
    findByName(name: string): Promise<T | null>;
    findByOwner(ownerId: number): Promise<T[]>;
    findByCode(groupCode: string): Promise<T | null>;
    getGroupMembers(groupId: number): Promise<K>;
}