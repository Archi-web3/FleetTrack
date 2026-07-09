import { Document, Schema as MongooseSchema } from 'mongoose';
export type ServiceScheduleDocument = ServiceSchedule & Document;
export declare class ServiceSchedule {
    vehicule: string;
    typeService: string;
    kilometragePrevu: number;
    kilometrageActuel: number;
    statut: string;
    dateAlerte: Date;
    taches: any[];
    signature: {
        superviseur: string;
        date: Date;
        signatureData: string;
    };
    dateCreation: Date;
    dateCompletion: Date;
    prochainService: {
        type: string;
        kilometrage: number;
    };
}
export declare const ServiceScheduleSchema: MongooseSchema<ServiceSchedule, import("mongoose").Model<ServiceSchedule, any, any, any, any, any, ServiceSchedule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    vehicule?: import("mongoose").SchemaDefinitionProperty<string, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    typeService?: import("mongoose").SchemaDefinitionProperty<string, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometragePrevu?: import("mongoose").SchemaDefinitionProperty<number, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometrageActuel?: import("mongoose").SchemaDefinitionProperty<number, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statut?: import("mongoose").SchemaDefinitionProperty<string, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateAlerte?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    taches?: import("mongoose").SchemaDefinitionProperty<any[], ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    signature?: import("mongoose").SchemaDefinitionProperty<{
        superviseur: string;
        date: Date;
        signatureData: string;
    }, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCreation?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCompletion?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    prochainService?: import("mongoose").SchemaDefinitionProperty<{
        type: string;
        kilometrage: number;
    }, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, ServiceSchedule>;
