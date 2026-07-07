import { Document } from 'mongoose';
export type EnvironmentDataDocument = EnvironmentData & Document;
export declare class EnvironmentData {
    year: number;
    month: number;
    base: string;
    fleet_km_total: number;
    fleet_liters_total: number;
    fleet_liters_ac: number;
    fleet_liters_loc: number;
    fleet_usage_admin_percent: number;
    energy_gen_hours: number;
    energy_gen_liters: number;
    energy_grid_kwh: number;
    driver_nb_projects: number;
    driver_nb_sites: number;
    driver_staff_fte: number;
    driver_financial_volume: number;
    driver_km_passengers: number;
    driver_km_cargo: number;
    driver_tonnage: number;
    metrics_iap_score: number;
    metrics_co2_total: number;
    metrics_co2_per_iap: number;
    metrics_fleet_l100: number;
    metrics_gen_lh: number;
}
export declare const EnvironmentDataSchema: import("mongoose").Schema<EnvironmentData, import("mongoose").Model<EnvironmentData, any, any, any, any, any, EnvironmentData>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EnvironmentData, Document<unknown, {}, EnvironmentData, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    year?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    month?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fleet_km_total?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fleet_liters_total?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fleet_liters_ac?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fleet_liters_loc?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fleet_usage_admin_percent?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    energy_gen_hours?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    energy_gen_liters?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    energy_grid_kwh?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_nb_projects?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_nb_sites?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_staff_fte?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_financial_volume?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_km_passengers?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_km_cargo?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driver_tonnage?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metrics_iap_score?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metrics_co2_total?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metrics_co2_per_iap?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metrics_fleet_l100?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    metrics_gen_lh?: import("mongoose").SchemaDefinitionProperty<number, EnvironmentData, Document<unknown, {}, EnvironmentData, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EnvironmentData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, EnvironmentData>;
