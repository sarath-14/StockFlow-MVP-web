import { IOrganization } from "./orgaization.model";
import { IUser } from "./user.model";

export interface IProduct extends Document {
    _id?: string;
    organizationId: string | IOrganization;
    name: string;
    sku: string;
    quantity: number;
    description?: string;
    cost?: number;
    sellingPrice?: number;
    threshold?: number;
    updatedBy: string | IUser;
    createdAt?: Date;
    updatedAt?: Date;
}
