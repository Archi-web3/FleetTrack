import { Document, Types } from 'mongoose';
export type SecurityConfigDocument = SecurityConfig & Document;
export declare class SecurityRule {
    level: number;
    mandatoryValidators: Types.ObjectId[];
    requireUnanimity: boolean;
    quorum: number;
    includeLowerLevels: boolean;
}
export declare const SecurityRuleSchema: import("mongoose").Schema<SecurityRule, import("mongoose").Model<SecurityRule, any, any, any, any, any, SecurityRule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SecurityRule, Document<unknown, {}, SecurityRule, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    level?: import("mongoose").SchemaDefinitionProperty<number, SecurityRule, Document<unknown, {}, SecurityRule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mandatoryValidators?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], SecurityRule, Document<unknown, {}, SecurityRule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    requireUnanimity?: import("mongoose").SchemaDefinitionProperty<boolean, SecurityRule, Document<unknown, {}, SecurityRule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    quorum?: import("mongoose").SchemaDefinitionProperty<number, SecurityRule, Document<unknown, {}, SecurityRule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    includeLowerLevels?: import("mongoose").SchemaDefinitionProperty<boolean, SecurityRule, Document<unknown, {}, SecurityRule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, SecurityRule>;
export declare class SecurityConfig {
    pays: Types.ObjectId;
    base: Types.ObjectId;
    rules: SecurityRule[];
    updatedBy: Types.ObjectId;
}
export declare const SecurityConfigSchema: import("mongoose").Schema<SecurityConfig, import("mongoose").Model<SecurityConfig, any, any, any, any, any, SecurityConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SecurityConfig, Document<unknown, {}, SecurityConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SecurityConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    pays?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityConfig, Document<unknown, {}, SecurityConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityConfig, Document<unknown, {}, SecurityConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    rules?: import("mongoose").SchemaDefinitionProperty<SecurityRule[], SecurityConfig, Document<unknown, {}, SecurityConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    updatedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityConfig, Document<unknown, {}, SecurityConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, SecurityConfig>;
