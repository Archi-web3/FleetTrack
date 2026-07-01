"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MouvementsSecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouvementsSecurityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const security_config_schema_1 = require("./schemas/security-config.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let MouvementsSecurityService = MouvementsSecurityService_1 = class MouvementsSecurityService {
    securityConfigModel;
    userModel;
    logger = new common_1.Logger(MouvementsSecurityService_1.name);
    constructor(securityConfigModel, userModel) {
        this.securityConfigModel = securityConfigModel;
        this.userModel = userModel;
    }
    async calculateValidators(paysId, baseId, maxSecurityLevel) {
        if (maxSecurityLevel === 0) {
            return { mode: 'none', validators: [] };
        }
        try {
            let config = await this.securityConfigModel
                .findOne({ pays: paysId, base: baseId })
                .exec();
            let allValidators = [];
            const extractValidators = (cfg) => {
                const vals = [];
                if (cfg && cfg.rules) {
                    const rule = cfg.rules.find((r) => r.level === maxSecurityLevel);
                    if (rule &&
                        rule.mandatoryValidators &&
                        rule.mandatoryValidators.length > 0) {
                        vals.push(...rule.mandatoryValidators.map((id) => id.toString()));
                        if (rule.includeLowerLevels) {
                            for (let i = 1; i < maxSecurityLevel; i++) {
                                const lowerRule = cfg.rules.find((r) => r.level === i);
                                if (lowerRule && lowerRule.mandatoryValidators) {
                                    vals.push(...lowerRule.mandatoryValidators.map((id) => id.toString()));
                                }
                            }
                        }
                    }
                }
                return vals;
            };
            allValidators = extractValidators(config);
            if (allValidators.length === 0 && baseId) {
                config = await this.securityConfigModel
                    .findOne({ pays: paysId, base: null })
                    .exec();
                allValidators = extractValidators(config);
            }
            allValidators = [...new Set(allValidators)];
            if (allValidators.length > 0) {
                this.logger.log(`🛡️ Using matrix validators for level ${maxSecurityLevel}`);
                return {
                    mode: 'matrix',
                    validators: allValidators.map((uid) => ({
                        validator: new mongoose_2.Types.ObjectId(uid),
                        status: 'pending',
                        isBackup: false,
                    })),
                };
            }
            else {
                this.logger.warn(`⚠️ FALLBACK TRIGGERED! No valid matrix config found for level ${maxSecurityLevel} and pays ${paysId}`);
                const validatorsToNotify = await this.userModel
                    .find({
                    niveauValidationSecu: { $gte: maxSecurityLevel },
                    pays: paysId,
                })
                    .exec();
                return {
                    mode: 'fallback',
                    validators: validatorsToNotify.map((u) => ({
                        validator: u._id,
                        status: 'pending',
                        isBackup: Number(u.niveauValidationSecu) > maxSecurityLevel,
                    })),
                };
            }
        }
        catch (e) {
            const err = e;
            this.logger.error('❌ Erreur lors du calcul des validateurs sécurité:', err.stack);
            return { mode: 'error', validators: [] };
        }
    }
};
exports.MouvementsSecurityService = MouvementsSecurityService;
exports.MouvementsSecurityService = MouvementsSecurityService = MouvementsSecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(security_config_schema_1.SecurityConfig.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MouvementsSecurityService);
//# sourceMappingURL=mouvements-security.service.js.map