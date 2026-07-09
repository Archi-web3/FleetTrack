export declare class MaintenanceConfigDto {
    typeVehicule?: string;
    conditionsRoute?: string;
    intervalleService?: number;
    intervalleVidange?: {
        bonneQualite?: number;
        mauvaiseQualite?: number;
    };
    qualiteCarburant?: string;
    actif?: boolean;
}
export declare class ValidateTaskDto {
    checklistId: string;
    tacheId: string;
    validee: boolean;
    commentaire?: string;
}
export declare class CompleteServiceDto {
    serviceId: string;
    signature: string;
}
export declare class UpdateTasksDto {
    taches: any[];
}
