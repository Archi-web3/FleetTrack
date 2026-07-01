export class CreateLieuDto {
  nom!: string;
  adresse?: string;
  coordonnees?: any;
  estSensible?: boolean;
  niveauSecurite?: number;
  base?: string;
  pays?: string;
  [key: string]: any;
}

export class UpdateLieuDto extends CreateLieuDto {}
