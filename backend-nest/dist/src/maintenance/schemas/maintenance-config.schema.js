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
exports.MaintenanceConfigSchema = exports.MaintenanceConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MaintenanceConfig = class MaintenanceConfig {
    typeVehicule;
    conditionsRoute;
    intervalleService;
    actif;
    sequenceMode;
    customSequence;
    remarques;
};
exports.MaintenanceConfig = MaintenanceConfig;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MaintenanceConfig.prototype, "typeVehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            '100% piste difficile',
            'Mixte route + piste',
            'Route goudronnée',
            'Route mixte/urbaine',
        ],
    }),
    __metadata("design:type", String)
], MaintenanceConfig.prototype, "conditionsRoute", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], MaintenanceConfig.prototype, "intervalleService", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], MaintenanceConfig.prototype, "actif", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Predefined', 'Custom'], default: 'Predefined' }),
    __metadata("design:type", String)
], MaintenanceConfig.prototype, "sequenceMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: ['A', 'B', 'A', 'C'] }),
    __metadata("design:type", Array)
], MaintenanceConfig.prototype, "customSequence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MaintenanceConfig.prototype, "remarques", void 0);
exports.MaintenanceConfig = MaintenanceConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MaintenanceConfig);
exports.MaintenanceConfigSchema = mongoose_1.SchemaFactory.createForClass(MaintenanceConfig);
//# sourceMappingURL=maintenance-config.schema.js.map