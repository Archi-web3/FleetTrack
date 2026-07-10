import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateAxeDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  depart: string;

  @IsString()
  @IsNotEmpty()
  arrivee: string;

  @IsNumber()
  @IsNotEmpty()
  niveauSecurite: number;

  @IsString()
  @IsOptional()
  commentaire?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;

  @IsString()
  @IsNotEmpty()
  pays: string;

  @IsString()
  @IsOptional()
  base?: string;
}

export class UpdateAxeDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  depart?: string;

  @IsString()
  @IsOptional()
  arrivee?: string;

  @IsNumber()
  @IsOptional()
  niveauSecurite?: number;

  @IsString()
  @IsOptional()
  commentaire?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;

  @IsString()
  @IsOptional()
  pays?: string;

  @IsString()
  @IsOptional()
  base?: string;
}
