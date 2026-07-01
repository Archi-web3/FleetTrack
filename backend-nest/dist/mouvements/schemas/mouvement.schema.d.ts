import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
export declare class Stop {
    lieu: string;
    dateArrivee: Date;
    dateDepart: Date;
    originMouvement: string;
}
export declare class Mouvement {
    stops: Stop[];
    demandeur: string;
    vehicule: string;
    chauffeur: string;
    passagers: string[];
    materiel: string[];
    objectif: string;
    statut: string;
    statutLogistique: string;
    statutSecurite: string;
    motifRefus: string;
    parentMouvement: string;
    enfantsMouvements: string[];
    base: string;
    pays: string;
    projet: string;
    projetsPassagers: string[];
    modeTransport: string;
    type: string;
    maintenanceType: string;
    description: string;
    validationLevelRequired: number;
    validationHistory: any[];
    securityApprovals: any[];
    securityConsensusReached: boolean;
    securityValidationMode: string;
    projetsVentilation: any[];
    isRoundTrip: boolean;
    isAdHoc: boolean;
    dateDepart: Date;
    dateArrivee: Date;
    takenInChargeAt: Date;
    takenInChargeBy: string;
    realDepartureTime: Date;
    realArrivalTime: Date;
    startMileage: number;
    endMileage: number;
    gpsTrace: any[];
    deviations: any[];
    driverObservations: string;
    photos: any[];
    isLocked: boolean;
    syncStatus: string;
}
export declare const MouvementSchema: MongooseSchema<Mouvement, import("mongoose").Model<Mouvement, any, any, any, any, any, Mouvement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    stops?: import("mongoose").SchemaDefinitionProperty<Stop[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    demandeur?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehicule?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    chauffeur?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    passagers?: import("mongoose").SchemaDefinitionProperty<string[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    materiel?: import("mongoose").SchemaDefinitionProperty<string[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    objectif?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statut?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statutLogistique?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statutSecurite?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    motifRefus?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    parentMouvement?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    enfantsMouvements?: import("mongoose").SchemaDefinitionProperty<string[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    projet?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    projetsPassagers?: import("mongoose").SchemaDefinitionProperty<string[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    modeTransport?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    type?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    maintenanceType?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    validationLevelRequired?: import("mongoose").SchemaDefinitionProperty<number, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    validationHistory?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    securityApprovals?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    securityConsensusReached?: import("mongoose").SchemaDefinitionProperty<boolean, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    securityValidationMode?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    projetsVentilation?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isRoundTrip?: import("mongoose").SchemaDefinitionProperty<boolean, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isAdHoc?: import("mongoose").SchemaDefinitionProperty<boolean, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateDepart?: import("mongoose").SchemaDefinitionProperty<Date, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateArrivee?: import("mongoose").SchemaDefinitionProperty<Date, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    takenInChargeAt?: import("mongoose").SchemaDefinitionProperty<Date, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    takenInChargeBy?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    realDepartureTime?: import("mongoose").SchemaDefinitionProperty<Date, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    realArrivalTime?: import("mongoose").SchemaDefinitionProperty<Date, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    startMileage?: import("mongoose").SchemaDefinitionProperty<number, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    endMileage?: import("mongoose").SchemaDefinitionProperty<number, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    gpsTrace?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    deviations?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    driverObservations?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    photos?: import("mongoose").SchemaDefinitionProperty<any[], Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isLocked?: import("mongoose").SchemaDefinitionProperty<boolean, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    syncStatus?: import("mongoose").SchemaDefinitionProperty<string, Mouvement, import("mongoose").Document<unknown, {}, Mouvement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Mouvement>;
export type MouvementDocument = HydratedDocument<Mouvement>;
