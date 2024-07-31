import { Client } from '.';
import { GenericDeletedResponse, OperationById, Paginated } from './common/common.types';
import { CollectionObject, GroupTranslatedContentObject, SectionObject } from './helpCenter/helpCenter.types';
export default class HelpCenter {
    readonly collections: Collection;
    readonly sections: Section;
    constructor(client: Client);
}
declare class Collection {
    private readonly client;
    readonly baseUrl = "help_center/collections";
    constructor(client: Client);
    create({ name, description, translatedContent }: CreateCollectionData): Promise<CollectionObject>;
    find({ id }: CollectionFindByIdData): Promise<CollectionObject>;
    update({ id, name, description, translatedContent }: UpdateCollectionData): Promise<CollectionObject>;
    delete({ id }: CollectionDeleteByIdData): Promise<CollectionDeleteByIdResponse>;
    list({ page, perPage: per_page }: CollectionListData): Promise<CollectionListResponse>;
}
interface CreateCollectionData {
    name: string;
    description?: string;
    translatedContent?: Omit<GroupTranslatedContentObject, 'type'>;
}
type CollectionFindByIdData = OperationById;
type UpdateCollectionData = Partial<CreateCollectionData> & OperationById;
type CollectionDeleteByIdData = OperationById;
type CollectionDeleteByIdResponse = GenericDeletedResponse<'collection'>;
type CollectionListData = {
    page?: number;
    perPage?: number;
};
type CollectionListResponse = Paginated<CollectionObject>;
declare class Section {
    private readonly client;
    readonly baseUrl = "help_center/sections";
    constructor(client: Client);
    create({ name, parentId, translatedContent }: CreateSectionData): Promise<SectionObject>;
    find({ id }: SectionFindByIdData): Promise<SectionObject>;
    update({ id, name, parentId, translatedContent }: UpdateSectionData): Promise<SectionObject>;
    delete({ id }: SectionDeleteByIdData): Promise<SectionDeleteByIdResponse>;
    list({ page, perPage: per_page }: SectionListData): Promise<SectionListResponse>;
}
interface CreateSectionData {
    name: string;
    parentId: string;
    translatedContent?: Omit<GroupTranslatedContentObject, 'type'>;
}
type SectionFindByIdData = OperationById;
type UpdateSectionData = Partial<CreateSectionData> & OperationById;
type SectionDeleteByIdData = OperationById;
type SectionDeleteByIdResponse = GenericDeletedResponse<'section'>;
type SectionListData = {
    page?: number;
    perPage?: number;
};
type SectionListResponse = Paginated<SectionObject>;
export {};
//# sourceMappingURL=helpCenter.d.ts.map