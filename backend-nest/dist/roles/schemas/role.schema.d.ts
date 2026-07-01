import { Document } from 'mongoose';
export type RoleDocument = Role & Document;
export declare class Role {
    name: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
}
export declare const RoleSchema: import("mongoose").Schema<Role, import("mongoose").Model<Role, any, any, any, any, any, Role>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, Document<unknown, {}, Role, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Role & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permissions?: import("mongoose").SchemaDefinitionProperty<string[], Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isSystemRole?: import("mongoose").SchemaDefinitionProperty<boolean, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Role>;
