export interface IGroupUserService<T,K> {
    addUser(groupUser: T): Promise<T>;
    removeUser(groupUser: T): Promise<boolean>;
    findAllByUserId(userId: number): Promise<T[]>;
    findAllMembers(groupId: number): Promise<K>;
}