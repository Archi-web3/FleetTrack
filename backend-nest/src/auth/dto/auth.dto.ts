export class RegisterDto {
  email!: string;
  nom!: string;
  prenom?: string;
  motDePasse!: string;
  profil!: string;
  pays?: string;
  base?: string;
}

export class LoginPayloadDto {
  email!: string;
  motDePasse!: string;
}
