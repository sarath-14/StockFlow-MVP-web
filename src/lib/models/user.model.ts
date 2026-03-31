import { IOrganization } from "./orgaization.model";

export interface IUser {
    _id?: string;
    email: string;
    password: string;
    organization: string | IOrganization;
    createdAt?: Date;
    updatedAt?: Date;
}