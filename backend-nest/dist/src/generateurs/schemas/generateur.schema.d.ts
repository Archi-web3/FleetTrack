import { Document, Schema as MongooseSchema } from 'mongoose';
export type GenerateurDocument = Generateur & Document;
export declare class Generateur {
    marque: string;
    modele: string;
    puissanceKVA: number;
    numeroSerie: string;
    numeroMoteur: string;
    acfCode: string;
    categorie: string;
    proprietaire: string;
    typeCarburant: string;
    anneeFabrication: number;
    anneePremiereUtilisation: number;
    coutAssuranceAnnuel: number;
    dateCommencement: Date;
    base: string;
    pays: string;
    siteInstallation: string;
    statut: string;
    heuresInitiales: number;
    heuresFonctionnement: number;
    consommationTheorique: number;
    dateAcquisition: Date;
    valeurAchat: number;
    notes: string;
    remarques: string;
}
export declare const GenerateurSchema: MongooseSchema<Generateur, import("mongoose").Model<Generateur, any, any, any, any, any, Generateur>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Generateur, Document<unknown, {}, Generateur, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    marque?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    modele?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    puissanceKVA?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    numeroSerie?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    numeroMoteur?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    acfCode?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    categorie?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    proprietaire?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    typeCarburant?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    anneeFabrication?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    anneePremiereUtilisation?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    coutAssuranceAnnuel?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateCommencement?: import("mongoose").SchemaDefinitionProperty<Date, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    siteInstallation?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    statut?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    heuresInitiales?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    heuresFonctionnement?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    consommationTheorique?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    dateAcquisition?: import("mongoose").SchemaDefinitionProperty<Date, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    valeurAchat?: import("mongoose").SchemaDefinitionProperty<number, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    remarques?: import("mongoose").SchemaDefinitionProperty<string, Generateur, Document<unknown, {}, Generateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Generateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Generateur>;
