import { Document, Types } from 'mongoose';
export type WeeklyChecklistDocument = WeeklyChecklist & Document;
export declare class WeeklyTask {
    numero: string;
    categorie: string;
    description: string;
    numeroTacheManuel: string;
    validee: boolean;
    dateValidation: Date;
    commentaire: string;
}
export declare class WeeklyChecklist {
    vehicule: Types.ObjectId;
    semaine: number;
    annee: number;
    chauffeur: Types.ObjectId;
    taches: WeeklyTask[];
    completee: boolean;
    tauxCompletion: number;
    dateCreation: Date;
    dateCompletion: Date;
}
export declare const WeeklyChecklistSchema: import("mongoose").Schema<WeeklyChecklist, import("mongoose").Model<WeeklyChecklist, any, any, any, any, any, WeeklyChecklist>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    vehicule?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    semaine?: import("mongoose").SchemaDefinitionProperty<number, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    annee?: import("mongoose").SchemaDefinitionProperty<number, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chauffeur?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    taches?: import("mongoose").SchemaDefinitionProperty<WeeklyTask[], WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    completee?: import("mongoose").SchemaDefinitionProperty<boolean, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    tauxCompletion?: import("mongoose").SchemaDefinitionProperty<number, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCreation?: import("mongoose").SchemaDefinitionProperty<Date, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCompletion?: import("mongoose").SchemaDefinitionProperty<Date, WeeklyChecklist, Document<unknown, {}, WeeklyChecklist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeeklyChecklist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, WeeklyChecklist>;
