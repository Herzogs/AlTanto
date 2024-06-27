import { IGroupReport } from "../../models/group.interface";

export interface IGroupService<T,K,E> {
    getAllByOwner(id: number): Promise<T[]>;
    create(group: T): Promise<T>;
    remove(id: number): Promise<boolean>;
    validateGroupCode(code: string): Promise<T>;
    findByName(name: string): Promise<T>;
    findAllByGroupId(user: K[]): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    findMembersByGroupId(id: number): Promise<E>;
    getNotifications(id: number): Promise<IGroupReport[]>;
}