export class CreateProjetDto {
  nom!: string;
  code!: string;
  description?: string;
  pays?: string;
  actif?: boolean;
}

export class UpdateProjetDto {
  nom?: string;
  code?: string;
  description?: string;
  pays?: string;
  actif?: boolean;
}
