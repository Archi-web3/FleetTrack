import { Schema as MongooseSchema } from 'mongoose';
export declare class Vehicule {
    immatriculation: string;
    marque: string;
    modele: string;
    acfCode: string;
    base: string;
    pays: string;
    typePropriete: string;
    locationDetails: {
        nomLoueur?: string;
        dateDebut?: Date;
        dateFin?: Date;
    };
    achatDetails: {
        dateAchat?: Date;
        valeurAchat?: number;
    };
    category: string;
    type: string;
    distanceUnit: string;
    resourcesCode: string;
    nickname: string;
    permanentlyAssigned: boolean;
    assignedDriverId: string;
    usageType: string;
    bcfSpoNumber: string;
    technicalInspectionDueDate: Date;
    unloggedKilometers: number;
    year: number;
    startDate: Date;
    kilometrage: number;
    kilometrageInitial: number;
    derniereMiseAJourKm: Date;
    capacitePassagers: number;
    enService: boolean;
    enableGpsTracking: boolean;
    fuelType: string;
    statut: string;
    archivedAt: Date;
    emissionsCO2: {
        valeur?: number;
        source?: string;
    };
    consommation: {
        valeur?: number;
        source?: string;
        dateTest?: Date;
    };
    purchaseValue: number;
    depreciationMonths: number;
    insuranceCost: number;
    insuranceEndDate: Date;
    rentalCost: number;
    driverIncluded: boolean;
    pushSubscription: any;
    assurance: {
        isAvailable?: boolean;
        contractNumber?: string;
        nomAssureur?: string;
        dateFin?: Date;
        certificatUrl?: string;
    };
    equipements: any[];
    remarks: string;
}
export declare const VehiculeSchema: MongooseSchema<Vehicule, import("mongoose").Model<Vehicule, any, any, any, any, any, Vehicule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    immatriculation?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    marque?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    modele?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    acfCode?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    typePropriete?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    locationDetails?: import("mongoose").SchemaDefinitionProperty<{
        nomLoueur?: string;
        dateDebut?: Date;
        dateFin?: Date;
    }, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    achatDetails?: import("mongoose").SchemaDefinitionProperty<{
        dateAchat?: Date;
        valeurAchat?: number;
    }, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    category?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    type?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    distanceUnit?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    resourcesCode?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    nickname?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permanentlyAssigned?: import("mongoose").SchemaDefinitionProperty<boolean, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    assignedDriverId?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    usageType?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    bcfSpoNumber?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    technicalInspectionDueDate?: import("mongoose").SchemaDefinitionProperty<Date, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    unloggedKilometers?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    year?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometrage?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    kilometrageInitial?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    derniereMiseAJourKm?: import("mongoose").SchemaDefinitionProperty<Date, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    capacitePassagers?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enService?: import("mongoose").SchemaDefinitionProperty<boolean, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enableGpsTracking?: import("mongoose").SchemaDefinitionProperty<boolean, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    fuelType?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statut?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    archivedAt?: import("mongoose").SchemaDefinitionProperty<Date, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    emissionsCO2?: import("mongoose").SchemaDefinitionProperty<{
        valeur?: number;
        source?: string;
    }, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    consommation?: import("mongoose").SchemaDefinitionProperty<{
        valeur?: number;
        source?: string;
        dateTest?: Date;
    }, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    purchaseValue?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    depreciationMonths?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    insuranceCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    insuranceEndDate?: import("mongoose").SchemaDefinitionProperty<Date, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    rentalCost?: import("mongoose").SchemaDefinitionProperty<number, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driverIncluded?: import("mongoose").SchemaDefinitionProperty<boolean, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pushSubscription?: import("mongoose").SchemaDefinitionProperty<any, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    assurance?: import("mongoose").SchemaDefinitionProperty<{
        isAvailable?: boolean;
        contractNumber?: string;
        nomAssureur?: string;
        dateFin?: Date;
        certificatUrl?: string;
    }, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    equipements?: import("mongoose").SchemaDefinitionProperty<any[], Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    remarks?: import("mongoose").SchemaDefinitionProperty<string, Vehicule, import("mongoose").Document<unknown, {}, Vehicule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Vehicule>;
export type VehiculeDocument = import('mongoose').HydratedDocument<Vehicule>;
