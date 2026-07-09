import { Document } from 'mongoose';
export type EnvironmentActionDocument = EnvironmentAction & Document;
export declare class EnvironmentAction {
    year: number;
    base: string;
    quarter: string;
    category: string;
    action: string;
    status: string;
    impact_estimated: string;
    comments: string;
}
export declare const EnvironmentActionSchema: import("mongoose").Schema<EnvironmentAction, import("mongoose").Model<EnvironmentAction, any, any, any, any, any, EnvironmentAction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    year?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    quarter?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    category?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    action?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    impact_estimated?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    comments?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentAction, Document<unknown, {}, EnvironmentAction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentAction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, EnvironmentAction>;
