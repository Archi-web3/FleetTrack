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
exports.EnvironmentDataSchema = exports.EnvironmentData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let EnvironmentData = class EnvironmentData {
    year;
    month;
    base;
    fleet_km_total;
    fleet_liters_total;
    fleet_liters_ac;
    fleet_liters_loc;
    fleet_usage_admin_percent;
    energy_gen_hours;
    energy_gen_liters;
    energy_grid_kwh;
    driver_nb_projects;
    driver_nb_sites;
    driver_staff_fte;
    driver_financial_volume;
    driver_km_passengers;
    driver_km_cargo;
    driver_tonnage;
    metrics_iap_score;
    metrics_co2_total;
    metrics_co2_per_iap;
    metrics_fleet_l100;
    metrics_gen_lh;
};
exports.EnvironmentData = EnvironmentData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 12 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "month", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnvironmentData.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "fleet_km_total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "fleet_liters_total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "fleet_liters_ac", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "fleet_liters_loc", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "fleet_usage_admin_percent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "energy_gen_hours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "energy_gen_liters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "energy_grid_kwh", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_nb_projects", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_nb_sites", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_staff_fte", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_financial_volume", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_km_passengers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_km_cargo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "driver_tonnage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "metrics_iap_score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "metrics_co2_total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "metrics_co2_per_iap", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "metrics_fleet_l100", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnvironmentData.prototype, "metrics_gen_lh", void 0);
exports.EnvironmentData = EnvironmentData = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EnvironmentData);
exports.EnvironmentDataSchema = mongoose_1.SchemaFactory.createForClass(EnvironmentData);
exports.EnvironmentDataSchema.index({ year: 1, month: 1, base: 1 }, { unique: true });
//# sourceMappingURL=environment-data.schema.js.map