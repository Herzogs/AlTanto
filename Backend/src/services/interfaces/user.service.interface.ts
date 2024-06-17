export interface IUserService<T> {
    createUser(user: T): Promise<T>;
    getUserByEmail(email: string): Promise<T>;
    getUserByUserName(userName: string): Promise<T>;
}