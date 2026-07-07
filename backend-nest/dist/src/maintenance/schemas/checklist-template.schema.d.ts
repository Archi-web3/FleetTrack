import { Document } from 'mongoose';
export type ChecklistTemplateDocument = ChecklistTemplate & Document;
export declare class ChecklistTask {
    numero: string;
    categorie: string;
    description: string;
    description_en: string;
    numeroTacheManuel: string;
    obligatoire: boolean;
}
export declare class ChecklistTemplate {
    nom: string;
    nom_en: string;
    type: string;
    typeVehicule: string;
    coutParDefaut: number;
    taches: ChecklistTask[];
    actif: boolean;
}
export declare const ChecklistTemplateSchema: import("mongoose").Schema<ChecklistTemplate, import("mongoose").Model<ChecklistTemplate, any, any, any, any, any, ChecklistTemplate>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    nom_en?: import("mongoose").SchemaDefinitionProperty<string, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    type?: import("mongoose").SchemaDefinitionProperty<string, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    typeVehicule?: import("mongoose").SchemaDefinitionProperty<string, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    coutParDefaut?: import("mongoose").SchemaDefinitionProperty<number, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    taches?: import("mongoose").SchemaDefinitionProperty<ChecklistTask[], ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    actif?: import("mongoose").SchemaDefinitionProperty<boolean, ChecklistTemplate, Document<unknown, {}, ChecklistTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChecklistTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, ChecklistTemplate>;
