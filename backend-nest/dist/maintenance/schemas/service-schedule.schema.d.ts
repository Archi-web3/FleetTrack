import { Document, Types } from 'mongoose';
export type ServiceScheduleDocument = ServiceSchedule & Document;
export declare class ServiceTask {
    description: string;
    numeroTacheManuel: string;
    validee: boolean;
    dateValidation: Date;
    validePar: Types.ObjectId;
    commentaire: string;
}
export declare class ServiceSchedule {
    vehicule: Types.ObjectId;
    typeService: string;
    kilometragePrevu: number;
    kilometrageActuel: number;
    statut: string;
    dateAlerte: Date;
    taches: ServiceTask[];
    signature: {
        superviseur: Types.ObjectId;
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
export declare const ServiceScheduleSchema: import("mongoose").Schema<ServiceSchedule, import("mongoose").Model<ServiceSchedule, any, any, any, any, any, ServiceSchedule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    vehicule?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    typeService?: import("mongoose").SchemaDefinitionProperty<string, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometragePrevu?: import("mongoose").SchemaDefinitionProperty<number, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometrageActuel?: import("mongoose").SchemaDefinitionProperty<number, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statut?: import("mongoose").SchemaDefinitionProperty<string, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateAlerte?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    taches?: import("mongoose").SchemaDefinitionProperty<ServiceTask[], ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    signature?: import("mongoose").SchemaDefinitionProperty<{
        superviseur: Types.ObjectId;
        date: Date;
        signatureData: string;
    }, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCreation?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCompletion?: import("mongoose").SchemaDefinitionProperty<Date, ServiceSchedule, Document<unknown, {}, ServiceSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ServiceSchedule & {
        _id: Types.ObjectId;
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
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, ServiceSchedule>;
