import {
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SecurityRuleDto {
  @IsNumber()
  level: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  mandatoryValidators?: string[];

  @IsBoolean()
  @IsOptional()
  requireUnanimity?: boolean;

  @IsNumber()
  @IsOptional()
  quorum?: number;

  @IsBoolean()
  @IsOptional()
  includeLowerLevels?: boolean;
}

export class UpdateSecurityConfigDto {
  @IsMongoId()
  @IsOptional()
  base?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecurityRuleDto)
  rules: SecurityRuleDto[];
}
