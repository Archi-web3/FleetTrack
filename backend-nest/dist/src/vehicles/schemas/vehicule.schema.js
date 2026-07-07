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
exports.VehiculeSchema = exports.Vehicule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Vehicule = class Vehicule {
    immatriculation;
    marque;
    modele;
    acfCode;
    base;
    pays;
    typePropriete;
    locationDetails;
    achatDetails;
    category;
    type;
    distanceUnit;
    resourcesCode;
    nickname;
    permanentlyAssigned;
    assignedDriverId;
    usageType;
    bcfSpoNumber;
    technicalInspectionDueDate;
    unloggedKilometers;
    year;
    startDate;
    kilometrage;
    kilometrageInitial;
    derniereMiseAJourKm;
    capacitePassagers;
    enService;
    enableGpsTracking;
    fuelType;
    statut;
    archivedAt;
    emissionsCO2;
    consommation;
    purchaseValue;
    depreciationMonths;
    insuranceCost;
    insuranceEndDate;
    rentalCost;
    driverIncluded;
    pushSubscription;
    assurance;
    equipements;
    remarks;
};
exports.Vehicule = Vehicule;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Vehicule.prototype, "immatriculation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicule.prototype, "marque", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicule.prototype, "modele", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "acfCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Base' }),
    __metadata("design:type", String)
], Vehicule.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Pays' }),
    __metadata("design:type", String)
], Vehicule.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['ACF', 'Location'], default: 'ACF' }),
    __metadata("design:type", String)
], Vehicule.prototype, "typePropriete", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Vehicule.prototype, "locationDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Vehicule.prototype, "achatDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Voiture', 'Camion', 'Moto'], default: 'Voiture' }),
    __metadata("design:type", String)
], Vehicule.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Kilometers', 'Miles'], default: 'Kilometers' }),
    __metadata("design:type", String)
], Vehicule.prototype, "distanceUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "resourcesCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Vehicule.prototype, "permanentlyAssigned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Chauffeur' }),
    __metadata("design:type", String)
], Vehicule.prototype, "assignedDriverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Support only', 'Activity only', 'Mixed'] }),
    __metadata("design:type", String)
], Vehicule.prototype, "usageType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "bcfSpoNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Vehicule.prototype, "technicalInspectionDueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Vehicule.prototype, "unloggedKilometers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicule.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Vehicule.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Vehicule.prototype, "kilometrage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Vehicule.prototype, "kilometrageInitial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Vehicule.prototype, "derniereMiseAJourKm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], Vehicule.prototype, "capacitePassagers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Vehicule.prototype, "enService", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Vehicule.prototype, "enableGpsTracking", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'],
        default: 'Diesel',
    }),
    __metadata("design:type", String)
], Vehicule.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['En Service', 'Hors Service', 'Vendu', 'Archivé', 'Restitué'],
        default: 'En Service',
    }),
    __metadata("design:type", String)
], Vehicule.prototype, "statut", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Vehicule.prototype, "archivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Vehicule.prototype, "emissionsCO2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Vehicule.prototype, "consommation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicule.prototype, "purchaseValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicule.prototype, "depreciationMonths", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicule.prototype, "insuranceCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Vehicule.prototype, "insuranceEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicule.prototype, "rentalCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Vehicule.prototype, "driverIncluded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], Vehicule.prototype, "pushSubscription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Vehicule.prototype, "assurance", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            code: Number,
            name: String,
            isPresent: { type: Boolean, default: false },
            lastChecked: Date,
            comment: String,
        },
    ]),
    __metadata("design:type", Array)
], Vehicule.prototype, "equipements", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicule.prototype, "remarks", void 0);
exports.Vehicule = Vehicule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Vehicule);
exports.VehiculeSchema = mongoose_1.SchemaFactory.createForClass(Vehicule);
exports.VehiculeSchema.pre('save', async function (next) {
    if (!this.acfCode) {
        try {
            const Denomination = 'MOB';
            const model = this
                .constructor;
            const lastVehicule = await model
                .findOne({
                pays: this.pays,
                acfCode: { $regex: new RegExp(`^${Denomination}-\\d+$`) },
            })
                .sort({ acfCode: -1 })
                .limit(1);
            let nextNum = 1;
            if (lastVehicule && lastVehicule.acfCode) {
                const parts = lastVehicule.acfCode.split('-');
                if (parts.length === 2) {
                    const numPart = parseInt(parts[1], 10);
                    if (!isNaN(numPart)) {
                        nextNum = numPart + 1;
                    }
                }
            }
            this.acfCode = `${Denomination}-${nextNum.toString().padStart(3, '0')}`;
        }
        catch (err) {
            return next(err);
        }
    }
    next();
});
//# sourceMappingURL=vehicule.schema.js.map