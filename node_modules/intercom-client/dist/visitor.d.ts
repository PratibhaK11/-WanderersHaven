import { Client, ContactObject } from '.';
import { Role } from './common/common.types';
import { VisitorObject } from './visitor/visitor.types';
export default class Visitor {
    private readonly client;
    readonly baseUrl = "visitors";
    constructor(client: Client);
    find({ id, userId }: FindVisitorByIdData): Promise<VisitorObject>;
    update({ id, userId, name, customAttributes }: UpdateVisitorData): Promise<VisitorObject>;
    delete({ id }: DeleteVisitorByIdData): Promise<VisitorObject>;
    mergeToContact({ visitor, user, type }: MergeVisitorToContactData): Promise<ContactObject>;
}
export type IdentificationForVisitor = {
    id: string;
    userId?: never;
} | {
    id?: never;
    userId: string;
};
type FindVisitorByIdData = IdentificationForVisitor;
type UpdateVisitorData = IdentificationForVisitor & {
    name?: string;
    customAttributes?: VisitorObject['custom_attributes'];
};
type DeleteVisitorByIdData = {
    id: string;
};
export type MergeVisitorToContactData = {
    visitor: VisitorObjectForMerge;
    user: ContactObjectForMerge;
    type: Role;
};
export type VisitorObjectForMerge = {
    id: string;
    userId?: never;
    email?: never;
} | {
    id?: never;
    userId: string;
    email?: never;
} | {
    id?: never;
    userId?: never;
    email: string;
};
export type ContactObjectForMerge = IdentificationForVisitor & {
    email?: string;
};
export {};
//# sourceMappingURL=visitor.d.ts.map