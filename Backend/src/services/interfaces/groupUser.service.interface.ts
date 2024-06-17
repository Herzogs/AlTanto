export interface IGroupUserService<T> {
    addUser(groupUser: T): Promise<T>;
    removeUser(groupUser: T): Promise<boolean>;
    findAllByUserId(userId: number): Promise<T[]>;
}