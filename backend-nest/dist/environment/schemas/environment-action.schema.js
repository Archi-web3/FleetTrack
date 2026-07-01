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
exports.EnvironmentActionSchema = exports.EnvironmentAction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let EnvironmentAction = class EnvironmentAction {
    year;
    base;
    quarter;
    category;
    action;
    status;
    impact_estimated;
    comments;
};
exports.EnvironmentAction = EnvironmentAction;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], EnvironmentAction.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['T1', 'T2', 'T3', 'T4'] }),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "quarter", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            'Pooling',
            'Planification',
            'Choix Véhicule',
            'Eco-conduite',
            'Maintenance',
            'Substitution',
            'Géolocalisation',
            'Stock Carburant',
            'Générateurs',
            'Politique Transport',
            'Autre',
        ],
    }),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Non commencé', 'En cours', 'Fait', 'Reporté'],
        default: 'Non commencé',
    }),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "impact_estimated", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EnvironmentAction.prototype, "comments", void 0);
exports.EnvironmentAction = EnvironmentAction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EnvironmentAction);
exports.EnvironmentActionSchema = mongoose_1.SchemaFactory.createForClass(EnvironmentAction);
//# sourceMappingURL=environment-action.schema.js.map