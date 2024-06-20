export interface IUserRepository <T> {
    create(user: T): Promise<T>;
    delete(email: string): Promise<void>;
    getByEmail(email: string): Promise<T | null>;
    getByUserName(userName: string): Promise<T | null>;
}
