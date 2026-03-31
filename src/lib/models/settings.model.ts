import { IOrganization } from "./orgaization.model";
import { IUser } from "./user.model";

export interface ISettings {
    _id?: string;
    threshold: number;
    organizationId: string | IOrganization;
    updatedBy: string | IUser;
    createdAt?: Date;
    updatedAt?: Date;
}