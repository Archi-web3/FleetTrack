import { Document } from 'mongoose';
export type ChauffeurDocument = Chauffeur & Document;
export declare class Chauffeur {
    nom: string;
    prenom: string;
    telephone: string;
    permis: string;
    disponible: boolean;
    schedules: any[];
}
export declare const ChauffeurSchema: import("mongoose").Schema<Chauffeur, import("mongoose").Model<Chauffeur, any, any, any, any, any, Chauffeur>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chauffeur, Document<unknown, {}, Chauffeur, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    prenom?: import("mongoose").SchemaDefinitionProperty<string, Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    telephone?: import("mongoose").SchemaDefinitionProperty<string, Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permis?: import("mongoose").SchemaDefinitionProperty<string, Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    disponible?: import("mongoose").SchemaDefinitionProperty<boolean, Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    schedules?: import("mongoose").SchemaDefinitionProperty<any[], Chauffeur, Document<unknown, {}, Chauffeur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chauffeur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Chauffeur>;
