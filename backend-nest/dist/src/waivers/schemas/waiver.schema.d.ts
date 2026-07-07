import { Document, Types } from 'mongoose';
export type WaiverDocument = Waiver & Document;
export declare class Waiver {
    visitorName: string;
    signatureUrl: string;
    vehicleId: Types.ObjectId;
    tripId: Types.ObjectId;
    signedAt: Date;
    legalTextVersion: string;
}
export declare const WaiverSchema: import("mongoose").Schema<Waiver, import("mongoose").Model<Waiver, any, any, any, any, any, Waiver>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Waiver, Document<unknown, {}, Waiver, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    visitorName?: import("mongoose").SchemaDefinitionProperty<string, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    signatureUrl?: import("mongoose").SchemaDefinitionProperty<string, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehicleId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    tripId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    signedAt?: import("mongoose").SchemaDefinitionProperty<Date, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    legalTextVersion?: import("mongoose").SchemaDefinitionProperty<string, Waiver, Document<unknown, {}, Waiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Waiver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Waiver>;
