export interface IUser {
    id: number;
    name: string;
    lastName: string;
    username: string;
    password: string;
    phoneNumber: string;
    email: string;
    rol?: 'ADMIN' | 'USER';
}

export type IUserCognito = Omit<IUser, 'id'>;