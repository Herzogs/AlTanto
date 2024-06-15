export interface IGroupUserRepository<T,K> {
    create(groupUser: T): Promise<T | null>;
    remove(groupUser: T): Promise<boolean>;
    getMembers(groupId: number): Promise<K | null>;
    findAllByUserId(userId: number): Promise<T[]>;
}