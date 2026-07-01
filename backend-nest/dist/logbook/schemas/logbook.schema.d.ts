import { Document, Schema as MongooseSchema } from 'mongoose';
export type GenerateurLogbookDocument = GenerateurLogbook & Document;
export declare class GenerateurLogbook {
    generateur: string;
    utilisateur: string;
    dateReleve: Date;
    heureDebut: number;
    heureFin: number;
    carburantAjoute: number;
    observations: string;
}
export declare const GenerateurLogbookSchema: MongooseSchema<GenerateurLogbook, import("mongoose").Model<GenerateurLogbook, any, any, any, any, any, GenerateurLogbook>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    generateur?: import("mongoose").SchemaDefinitionProperty<string, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    utilisateur?: import("mongoose").SchemaDefinitionProperty<string, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateReleve?: import("mongoose").SchemaDefinitionProperty<Date, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    heureDebut?: import("mongoose").SchemaDefinitionProperty<number, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    heureFin?: import("mongoose").SchemaDefinitionProperty<number, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    carburantAjoute?: import("mongoose").SchemaDefinitionProperty<number, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    observations?: import("mongoose").SchemaDefinitionProperty<string, GenerateurLogbook, Document<unknown, {}, GenerateurLogbook, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GenerateurLogbook & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, GenerateurLogbook>;
