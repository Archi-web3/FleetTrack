import { Document, Schema as MongooseSchema } from 'mongoose';
export type BaseDocument = Base & Document;
export declare class Base {
    nom: string;
    code: string;
    pays: string;
    chef_de_base: string;
    localisation: {
        lat: number;
        lng: number;
    };
}
export declare const BaseSchema: MongooseSchema<Base, import("mongoose").Model<Base, any, any, any, any, any, Base>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Base, Document<unknown, {}, Base, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Base, Document<unknown, {}, Base, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    code?: import("mongoose").SchemaDefinitionProperty<string, Base, Document<unknown, {}, Base, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Base, Document<unknown, {}, Base, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chef_de_base?: import("mongoose").SchemaDefinitionProperty<string, Base, Document<unknown, {}, Base, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    localisation?: import("mongoose").SchemaDefinitionProperty<{
        lat: number;
        lng: number;
    }, Base, Document<unknown, {}, Base, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Base & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Base>;
