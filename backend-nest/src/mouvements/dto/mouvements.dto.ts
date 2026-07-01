export class CreateMouvementDto {
  dateDepart?: Date;
  dateArrivee?: Date;
  stops?: Record<string, any>[];
  chauffeur?: string;
  vehicule?: string;
  type?: string;
  demandeur?: string;
  pays?: string;
}

export class UserPayloadDto {
  _id?: string;
  id?: string;
  nom?: string;
  prenom?: string;
  base?: string;
  pays?: string;
  profil?: string;
  role?: string | { name: string };
  [key: string]: any;
}

export class MouvementQueryDto {
  [key: string]: any;
}
