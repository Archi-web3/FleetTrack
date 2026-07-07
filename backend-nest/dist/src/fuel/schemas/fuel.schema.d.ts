import { Document, Schema as MongooseSchema } from 'mongoose';
export type FuelDocument = Fuel & Document;
export declare class Fuel {
    date: Date;
    vehicule: string;
    chauffeur: string;
    mileage: number;
    quantity: number;
    fuelType: string;
    source: string;
    fullTank: boolean;
    price: number;
    driverSignature: string;
    photos: any[];
    comments: string;
    calculatedConsumption: number;
    isOverConsumption: boolean;
    theoreticalConsumptionSnapshot: number;
}
export declare const FuelSchema: MongooseSchema<Fuel, import("mongoose").Model<Fuel, any, any, any, any, any, Fuel>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fuel, Document<unknown, {}, Fuel, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehicule?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chauffeur?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    mileage?: import("mongoose").SchemaDefinitionProperty<number, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fuelType?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    source?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fullTank?: import("mongoose").SchemaDefinitionProperty<boolean, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    price?: import("mongoose").SchemaDefinitionProperty<number, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driverSignature?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    photos?: import("mongoose").SchemaDefinitionProperty<any[], Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    comments?: import("mongoose").SchemaDefinitionProperty<string, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    calculatedConsumption?: import("mongoose").SchemaDefinitionProperty<number, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isOverConsumption?: import("mongoose").SchemaDefinitionProperty<boolean, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    theoreticalConsumptionSnapshot?: import("mongoose").SchemaDefinitionProperty<number, Fuel, Document<unknown, {}, Fuel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fuel & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Fuel>;
