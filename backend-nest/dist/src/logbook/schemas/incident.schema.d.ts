import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type IncidentDocument = Incident & Document;
export declare class Incident {
    date: Date;
    vehicule: Types.ObjectId;
    chauffeur: Types.ObjectId;
    mouvement: Types.ObjectId;
    type: string;
    severity: string;
    description: string;
    location: {
        lat?: number;
        lng?: number;
        address?: string;
    };
    photos: any[];
    status: string;
    resolutionNotes: string;
    cost: number;
}
export declare const IncidentSchema: MongooseSchema<Incident, import("mongoose").Model<Incident, any, any, any, any, any, Incident>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Incident, Document<unknown, {}, Incident, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehicule?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chauffeur?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mouvement?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    type?: import("mongoose").SchemaDefinitionProperty<string, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    severity?: import("mongoose").SchemaDefinitionProperty<string, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    location?: import("mongoose").SchemaDefinitionProperty<{
        lat?: number;
        lng?: number;
        address?: string;
    }, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    photos?: import("mongoose").SchemaDefinitionProperty<any[], Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<string, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    resolutionNotes?: import("mongoose").SchemaDefinitionProperty<string, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    cost?: import("mongoose").SchemaDefinitionProperty<number, Incident, Document<unknown, {}, Incident, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Incident & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Incident>;
