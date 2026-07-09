import { Document } from 'mongoose';
export type MaintenanceConfigDocument = MaintenanceConfig & Document;
export declare class MaintenanceConfig {
    typeVehicule: string;
    conditionsRoute: string;
    intervalleService: number;
    actif: boolean;
    sequenceMode: string;
    customSequence: string[];
    remarques: string;
}
export declare const MaintenanceConfigSchema: import("mongoose").Schema<MaintenanceConfig, import("mongoose").Model<MaintenanceConfig, any, any, any, any, any, MaintenanceConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    typeVehicule?: import("mongoose").SchemaDefinitionProperty<string, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    conditionsRoute?: import("mongoose").SchemaDefinitionProperty<string, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    intervalleService?: import("mongoose").SchemaDefinitionProperty<number, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    actif?: import("mongoose").SchemaDefinitionProperty<boolean, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    sequenceMode?: import("mongoose").SchemaDefinitionProperty<string, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    customSequence?: import("mongoose").SchemaDefinitionProperty<string[], MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    remarques?: import("mongoose").SchemaDefinitionProperty<string, MaintenanceConfig, Document<unknown, {}, MaintenanceConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MaintenanceConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, MaintenanceConfig>;
