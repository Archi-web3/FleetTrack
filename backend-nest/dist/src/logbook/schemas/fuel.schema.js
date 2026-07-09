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
exports.FuelSchema = exports.Fuel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Fuel = class Fuel {
    date;
    vehicule;
    chauffeur;
    mileage;
    quantity;
    fuelType;
    source;
    fullTank;
    price;
    driverSignature;
    photos;
    comments;
    calculatedConsumption;
    isOverConsumption;
    theoreticalConsumptionSnapshot;
};
exports.Fuel = Fuel;
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now, required: true }),
    __metadata("design:type", Date)
], Fuel.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicule', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Fuel.prototype, "vehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Fuel.prototype, "chauffeur", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Fuel.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Fuel.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'],
        required: true,
    }),
    __metadata("design:type", String)
], Fuel.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Station Service', 'Stock ACF', 'Autre'],
        default: 'Station Service',
    }),
    __metadata("design:type", String)
], Fuel.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Fuel.prototype, "fullTank", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Fuel.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Fuel.prototype, "driverSignature", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.Mixed }]),
    __metadata("design:type", Array)
], Fuel.prototype, "photos", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Fuel.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Fuel.prototype, "calculatedConsumption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Fuel.prototype, "isOverConsumption", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Fuel.prototype, "theoreticalConsumptionSnapshot", void 0);
exports.Fuel = Fuel = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Fuel);
exports.FuelSchema = mongoose_1.SchemaFactory.createForClass(Fuel);
//# sourceMappingURL=fuel.schema.js.map