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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityConfigSchema = exports.SecurityConfig = exports.SecurityRuleSchema = exports.SecurityRule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SecurityRule = class SecurityRule {
    level;
    mandatoryValidators;
    requireUnanimity;
    quorum;
    includeLowerLevels;
};
exports.SecurityRule = SecurityRule;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], SecurityRule.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: 'User' }]),
    __metadata("design:type", Array)
], SecurityRule.prototype, "mandatoryValidators", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SecurityRule.prototype, "requireUnanimity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], SecurityRule.prototype, "quorum", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SecurityRule.prototype, "includeLowerLevels", void 0);
exports.SecurityRule = SecurityRule = __decorate([
    (0, mongoose_1.Schema)()
], SecurityRule);
exports.SecurityRuleSchema = mongoose_1.SchemaFactory.createForClass(SecurityRule);
let SecurityConfig = class SecurityConfig {
    pays;
    base;
    rules;
    updatedBy;
};
exports.SecurityConfig = SecurityConfig;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pays', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityConfig.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Base' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityConfig.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.SecurityRuleSchema] }),
    __metadata("design:type", Array)
], SecurityConfig.prototype, "rules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityConfig.prototype, "updatedBy", void 0);
exports.SecurityConfig = SecurityConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SecurityConfig);
exports.SecurityConfigSchema = mongoose_1.SchemaFactory.createForClass(SecurityConfig);
exports.SecurityConfigSchema.index({ pays: 1, base: 1 }, { unique: true });
//# sourceMappingURL=security-config.schema.js.map