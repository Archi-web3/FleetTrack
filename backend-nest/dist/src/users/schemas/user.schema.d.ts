import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
export declare class Utilisateur {
    nom: string;
    email: string;
    motDePasse: string;
    profil: string;
    role: string;
    pays: string;
    base: string;
    numeroEmploye: string;
    niveauValidationSecu: number;
    autoManageSecurity: boolean;
    prenom: string;
    telephone: string;
    permis: string;
    disponible: boolean;
    formationEcoConduite: {
        effectuee?: boolean;
        date?: Date;
    };
    vehiculeAttitre: string;
    documents: any[];
    projet: string;
}
export declare const UtilisateurSchema: MongooseSchema<Utilisateur, import("mongoose").Model<Utilisateur, any, any, any, any, any, Utilisateur>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nom?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    motDePasse?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    profil?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    role?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    pays?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    base?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    numeroEmploye?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    niveauValidationSecu?: import("mongoose").SchemaDefinitionProperty<number, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    autoManageSecurity?: import("mongoose").SchemaDefinitionProperty<boolean, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    prenom?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    telephone?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    permis?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    disponible?: import("mongoose").SchemaDefinitionProperty<boolean, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    formationEcoConduite?: import("mongoose").SchemaDefinitionProperty<{
        effectuee?: boolean;
        date?: Date;
    }, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    vehiculeAttitre?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    documents?: import("mongoose").SchemaDefinitionProperty<any[], Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    projet?: import("mongoose").SchemaDefinitionProperty<string, Utilisateur, import("mongoose").Document<unknown, {}, Utilisateur, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Utilisateur & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Utilisateur>;
export type UtilisateurDocument = HydratedDocument<Utilisateur>;
export type UserDocument = UtilisateurDocument;
export { Utilisateur as User, UtilisateurSchema as UserSchema };
