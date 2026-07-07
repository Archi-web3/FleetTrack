export declare class CreateUserDto {
    email: string;
    motDePasse: string;
    nom: string;
    prenom?: string;
    profil?: string;
    role?: string;
    pays?: string;
    base?: string;
    [key: string]: any;
}
export declare class UpdateUserDto {
    email?: string;
    motDePasse?: string;
    nom?: string;
    prenom?: string;
    profil?: string;
    role?: string;
    pays?: string;
    base?: string;
    [key: string]: any;
}
