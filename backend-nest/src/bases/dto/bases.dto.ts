export class CreateBaseDto {
  nom!: string;
  pays?: string;
  [key: string]: any;
}

export class UpdateBaseDto {
  nom?: string;
  pays?: string;
  [key: string]: any;
}
