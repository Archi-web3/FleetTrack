export declare class SecurityRuleDto {
    level: number;
    mandatoryValidators?: string[];
    requireUnanimity?: boolean;
    quorum?: number;
    includeLowerLevels?: boolean;
}
export declare class UpdateSecurityConfigDto {
    base?: string | null;
    rules: SecurityRuleDto[];
}
