export interface IGroupUserRepository<T> {
    create(groupUser: T): Promise<T | null>;
    remove(groupUser: T): Promise<boolean>;
    getMembers(groupId: number): Promise<T[] | null>;
    findAllByUserId(userId: number): Promise<T[]>;
}