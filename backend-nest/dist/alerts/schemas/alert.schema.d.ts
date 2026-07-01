import { Document, Types } from 'mongoose';
export type AlertDocument = Alert & Document;
export declare class AlertReadBy {
    vehicleId: string;
    readAt: Date;
    user: string;
}
export declare class AlertDeletedBy {
    vehicleId: string;
    deletedAt: Date;
}
export declare class Alert {
    title: string;
    message: string;
    severity: string;
    targetType: string;
    targetVehicleId: string;
    createdBy: Types.ObjectId;
    active: boolean;
    readBy: AlertReadBy[];
    deletedBy: AlertDeletedBy[];
    createdAt: Date;
}
export declare const AlertSchema: import("mongoose").Schema<Alert, import("mongoose").Model<Alert, any, any, any, any, any, Alert>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Alert, Document<unknown, {}, Alert, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    message?: import("mongoose").SchemaDefinitionProperty<string, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    severity?: import("mongoose").SchemaDefinitionProperty<string, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    targetType?: import("mongoose").SchemaDefinitionProperty<string, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    targetVehicleId?: import("mongoose").SchemaDefinitionProperty<string, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    active?: import("mongoose").SchemaDefinitionProperty<boolean, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    readBy?: import("mongoose").SchemaDefinitionProperty<AlertReadBy[], Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    deletedBy?: import("mongoose").SchemaDefinitionProperty<AlertDeletedBy[], Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, Alert, Document<unknown, {}, Alert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Alert & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Alert>;
