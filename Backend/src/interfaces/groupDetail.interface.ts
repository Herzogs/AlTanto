import { IGroup } from './group.interface';
import { IUser } from './user.interface';

export interface IGroupDetails extends IGroup {
    members: IUser[];
}
