export class MaintenanceConfigDto {
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

export class ValidateTaskDto {
  checklistId!: string;
  tacheId!: string;
  validee!: boolean;
  commentaire?: string;
}

export class CompleteServiceDto {
  serviceId!: string;
  signature!: string;
}

export class UpdateTasksDto {
  taches!: any[];
}
