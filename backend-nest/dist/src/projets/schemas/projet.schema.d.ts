import { Document, Schema as MongooseSchema } from 'mongoose';
export type ProjetDocument = Projet & Document;
export declare class Projet {
    nom: string;
    code: string;
    description: string;
    pays: string;
    actif: boolean;
}
export declare const ProjetSchema: MongooseSchema<Projet, import("mongoose").Model<Projet, any, any, any, any, any, Projet>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Projet, Document<unknown, {}, Projet, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Projet, Document<unknown, {}, Projet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    code?: import("mongoose").SchemaDefinitionProperty<string, Projet, Document<unknown, {}, Projet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Projet, Document<unknown, {}, Projet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Projet, Document<unknown, {}, Projet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    actif?: import("mongoose").SchemaDefinitionProperty<boolean, Projet, Document<unknown, {}, Projet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Projet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Projet>;
