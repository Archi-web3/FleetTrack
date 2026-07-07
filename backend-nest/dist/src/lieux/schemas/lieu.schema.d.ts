import { Document, Schema as MongooseSchema } from 'mongoose';
export type LieuDocument = Lieu & Document;
export declare class Lieu {
    nom: string;
    adresse: string;
    coordonnees: {
        latitude: number;
        longitude: number;
    };
    estSensible: boolean;
    niveauSecurite: number;
    pays: string;
    base: string;
}
export declare const LieuSchema: MongooseSchema<Lieu, import("mongoose").Model<Lieu, any, any, any, any, any, Lieu>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lieu, Document<unknown, {}, Lieu, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    adresse?: import("mongoose").SchemaDefinitionProperty<string, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    coordonnees?: import("mongoose").SchemaDefinitionProperty<{
        latitude: number;
        longitude: number;
    }, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    estSensible?: import("mongoose").SchemaDefinitionProperty<boolean, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    niveauSecurite?: import("mongoose").SchemaDefinitionProperty<number, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Lieu, Document<unknown, {}, Lieu, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lieu & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Lieu>;
