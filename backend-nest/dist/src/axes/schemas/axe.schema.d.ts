import { Document, Schema as MongooseSchema } from 'mongoose';
export type AxeDocument = Axe & Document;
export declare class Axe {
    nom: string;
    depart: string;
    arrivee: string;
    niveauSecurite: number;
    commentaire: string;
    actif: boolean;
    pays: string;
    base: string;
}
export declare const AxeSchema: MongooseSchema<Axe, import("mongoose").Model<Axe, any, any, any, any, any, Axe>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Axe, Document<unknown, {}, Axe, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    depart?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    arrivee?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    niveauSecurite?: import("mongoose").SchemaDefinitionProperty<number, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    commentaire?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    actif?: import("mongoose").SchemaDefinitionProperty<boolean, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Axe, Document<unknown, {}, Axe, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Axe & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Axe>;
