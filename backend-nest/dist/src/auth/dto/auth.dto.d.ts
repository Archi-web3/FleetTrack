export declare class RegisterDto {
    email: string;
    nom: string;
    prenom?: string;
    motDePasse: string;
    profil: string;
    pays?: string;
    base?: string;
}
export declare class LoginPayloadDto {
    email: string;
    motDePasse: string;
}
