import { Document, Schema as MongooseSchema } from 'mongoose';
export type AuditLogDocument = AuditLog & Document;
export declare class AuditLog {
    actor: {
        userId: string;
        nom: string;
        role: string;
    };
    pays: string;
    action: string;
    category: string;
    target: string;
    details: any;
    ip: string;
    timestamp: Date;
}
export declare const AuditLogSchema: MongooseSchema<AuditLog, import("mongoose").Model<AuditLog, any, any, any, any, any, AuditLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuditLog, Document<unknown, {}, AuditLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    actor?: import("mongoose").SchemaDefinitionProperty<{
        userId: string;
        nom: string;
        role: string;
    }, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    action?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    category?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    target?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    details?: import("mongoose").SchemaDefinitionProperty<any, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    ip?: import("mongoose").SchemaDefinitionProperty<string, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    timestamp?: import("mongoose").SchemaDefinitionProperty<Date, AuditLog, Document<unknown, {}, AuditLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuditLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, AuditLog>;
