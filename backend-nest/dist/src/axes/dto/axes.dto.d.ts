export declare class CreateAxeDto {
    nom: string;
    depart: string;
    arrivee: string;
    niveauSecurite: number;
    commentaire?: string;
    actif?: boolean;
    pays: string;
    base?: string;
}
export declare class UpdateAxeDto {
    nom?: string;
    depart?: string;
    arrivee?: string;
    niveauSecurite?: number;
    commentaire?: string;
    actif?: boolean;
    pays?: string;
    base?: string;
}
