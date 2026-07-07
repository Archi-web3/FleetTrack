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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const security_config_schema_1 = require("../mouvements/schemas/security-config.schema");
let SecurityConfigService = class SecurityConfigService {
    securityConfigModel;
    constructor(securityConfigModel) {
        this.securityConfigModel = securityConfigModel;
    }
    async getConfig(paysId, baseId) {
        if (!paysId) {
            throw new Error('PaysId est requis');
        }
        const query = { pays: paysId };
        if (baseId && baseId !== 'null') {
            query['base'] = baseId;
        }
        else {
            query['base'] = null;
        }
        const config = await this.securityConfigModel.findOne(query).exec();
        if (!config) {
            return {
                pays: paysId,
                base: (baseId !== 'null' ? baseId : null),
                rules: [],
            };
        }
        return config;
    }
    async saveConfig(paysId, baseId, data, userId) {
        if (!paysId) {
            throw new Error('PaysId est requis');
        }
        const query = { pays: paysId };
        if (baseId && baseId !== 'null') {
            query['base'] = baseId;
        }
        else {
            query['base'] = null;
        }
        const updateData = {
            ...data,
            pays: paysId,
            updatedBy: userId,
        };
        if (baseId && baseId !== 'null') {
            updateData['base'] = baseId;
        }
        else {
            updateData['base'] = null;
        }
        const config = await this.securityConfigModel
            .findOneAndUpdate(query, updateData, { new: true, upsert: true })
            .exec();
        return config;
    }
};
exports.SecurityConfigService = SecurityConfigService;
exports.SecurityConfigService = SecurityConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(security_config_schema_1.SecurityConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SecurityConfigService);
//# sourceMappingURL=security-config.service.js.map