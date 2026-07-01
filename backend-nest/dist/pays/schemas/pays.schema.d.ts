import { Document } from 'mongoose';
export type PaysDocument = Pays & Document;
export declare class Pays {
    nom: string;
    code: string;
    devise: string;
    parametres: {
        fuseauHoraire: string;
    };
}
export declare const PaysSchema: import("mongoose").Schema<Pays, import("mongoose").Model<Pays, any, any, any, any, any, Pays>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pays, Document<unknown, {}, Pays, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Pays & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Pays, Document<unknown, {}, Pays, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pays & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    code?: import("mongoose").SchemaDefinitionProperty<string, Pays, Document<unknown, {}, Pays, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pays & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    devise?: import("mongoose").SchemaDefinitionProperty<string, Pays, Document<unknown, {}, Pays, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pays & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    parametres?: import("mongoose").SchemaDefinitionProperty<{
        fuseauHoraire: string;
    }, Pays, Document<unknown, {}, Pays, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pays & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Pays>;
