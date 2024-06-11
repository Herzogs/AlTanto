export interface IGroup {
    id?: number;
    name: string;
    ownerId: number;
    groupCode: string;
}

export interface IGroupWithMembers extends IGroup {
    members: {
        id: number;
        name: string;
        lastName: string;
        username: string;
        email: string;
        phoneNumber: string;
    }[];
}
