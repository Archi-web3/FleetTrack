import { Document, Schema as MongooseSchema } from 'mongoose';
export type MaintenanceDocument = Maintenance & Document;
export declare class Maintenance {
    date: Date;
    vehicule: string;
    type: string;
    mileage: number;
    garage: string;
    mechanic: string;
    tasks: any[];
    parts: any[];
    cost: number;
    invoicePhoto: string;
    mechanicSignature: string;
    nextMaintenanceMileage: number;
    comments: string;
}
export declare const MaintenanceSchema: MongooseSchema<Maintenance, import("mongoose").Model<Maintenance, any, any, any, any, any, Maintenance>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Maintenance, Document<unknown, {}, Maintenance, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehicule?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    type?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mileage?: import("mongoose").SchemaDefinitionProperty<number, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    garage?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mechanic?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    tasks?: import("mongoose").SchemaDefinitionProperty<any[], Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    parts?: import("mongoose").SchemaDefinitionProperty<any[], Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    cost?: import("mongoose").SchemaDefinitionProperty<number, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    invoicePhoto?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mechanicSignature?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    nextMaintenanceMileage?: import("mongoose").SchemaDefinitionProperty<number, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    comments?: import("mongoose").SchemaDefinitionProperty<string, Maintenance, Document<unknown, {}, Maintenance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Maintenance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Maintenance>;
