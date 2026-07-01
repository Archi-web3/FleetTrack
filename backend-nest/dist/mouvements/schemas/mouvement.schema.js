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
exports.MouvementSchema = exports.Mouvement = exports.Stop = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Stop = class Stop {
    lieu;
    dateArrivee;
    dateDepart;
    originMouvement;
};
exports.Stop = Stop;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Lieu' }),
    __metadata("design:type", String)
], Stop.prototype, "lieu", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Stop.prototype, "dateArrivee", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Stop.prototype, "dateDepart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Mouvement' }),
    __metadata("design:type", String)
], Stop.prototype, "originMouvement", void 0);
exports.Stop = Stop = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Stop);
const StopSchema = mongoose_1.SchemaFactory.createForClass(Stop);
let Mouvement = class Mouvement {
    stops;
    demandeur;
    vehicule;
    chauffeur;
    passagers;
    materiel;
    objectif;
    statut;
    statutLogistique;
    statutSecurite;
    motifRefus;
    parentMouvement;
    enfantsMouvements;
    base;
    pays;
    projet;
    projetsPassagers;
    modeTransport;
    type;
    maintenanceType;
    description;
    validationLevelRequired;
    validationHistory;
    securityApprovals;
    securityConsensusReached;
    securityValidationMode;
    projetsVentilation;
    isRoundTrip;
    isAdHoc;
    dateDepart;
    dateArrivee;
    takenInChargeAt;
    takenInChargeBy;
    realDepartureTime;
    realArrivalTime;
    startMileage;
    endMileage;
    gpsTrace;
    deviations;
    driverObservations;
    photos;
    isLocked;
    syncStatus;
};
exports.Mouvement = Mouvement;
__decorate([
    (0, mongoose_1.Prop)({
        type: [StopSchema],
        validate: {
            validator: function (v) {
                if (this.type === 'maintenance')
                    return true;
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Un mouvement standard doit avoir au moins une étape.',
        },
    }),
    __metadata("design:type", Array)
], Mouvement.prototype, "stops", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true,
    }),
    __metadata("design:type", String)
], Mouvement.prototype, "demandeur", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vehicule' }),
    __metadata("design:type", String)
], Mouvement.prototype, "vehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Utilisateur' }),
    __metadata("design:type", String)
], Mouvement.prototype, "chauffeur", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Utilisateur' }]),
    __metadata("design:type", Array)
], Mouvement.prototype, "passagers", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Mouvement.prototype, "materiel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Mouvement.prototype, "objectif", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: [
            'en attente',
            'validé',
            'pris en charge',
            'en cours',
            'terminé',
            'annulé',
            'refusé',
            'en attente validation sécurité',
            'regroupé',
            'regroupé-enfant',
        ],
        default: 'en attente',
    }),
    __metadata("design:type", String)
], Mouvement.prototype, "statut", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['en attente', 'validé', 'refusé', 'non requis'],
        default: 'en attente',
    }),
    __metadata("design:type", String)
], Mouvement.prototype, "statutLogistique", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['en attente', 'validé', 'refusé', 'non requis'],
        default: 'non requis',
    }),
    __metadata("design:type", String)
], Mouvement.prototype, "statutSecurite", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Mouvement.prototype, "motifRefus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Mouvement' }),
    __metadata("design:type", String)
], Mouvement.prototype, "parentMouvement", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Mouvement' }]),
    __metadata("design:type", Array)
], Mouvement.prototype, "enfantsMouvements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Base' }),
    __metadata("design:type", String)
], Mouvement.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Pays' }),
    __metadata("design:type", String)
], Mouvement.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Mouvement.prototype, "projet", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Mouvement.prototype, "projetsPassagers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Routier', 'Aérien', 'Maritime'], default: 'Routier' }),
    __metadata("design:type", String)
], Mouvement.prototype, "modeTransport", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['mission', 'maintenance'], default: 'mission' }),
    __metadata("design:type", String)
], Mouvement.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Check Hebdo', 'Service', 'Réparation', 'Autre'] }),
    __metadata("design:type", String)
], Mouvement.prototype, "maintenanceType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Mouvement.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Mouvement.prototype, "validationLevelRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            validatedBy: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Utilisateur' },
            validatedAt: { type: Date, default: Date.now },
            level: Number,
            status: String,
        },
    ]),
    __metadata("design:type", Array)
], Mouvement.prototype, "validationHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            validator: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Utilisateur' },
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending',
            },
            approvedAt: Date,
            comment: String,
            isBackup: { type: Boolean, default: false },
        },
    ]),
    __metadata("design:type", Array)
], Mouvement.prototype, "securityApprovals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Mouvement.prototype, "securityConsensusReached", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['matrix', 'fallback'], default: 'matrix' }),
    __metadata("design:type", String)
], Mouvement.prototype, "securityValidationMode", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            projet: String,
            percentage: Number,
        },
    ]),
    __metadata("design:type", Array)
], Mouvement.prototype, "projetsVentilation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Mouvement.prototype, "isRoundTrip", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Mouvement.prototype, "isAdHoc", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Mouvement.prototype, "dateDepart", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Mouvement.prototype, "dateArrivee", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Mouvement.prototype, "takenInChargeAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Chauffeur' }),
    __metadata("design:type", String)
], Mouvement.prototype, "takenInChargeBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Mouvement.prototype, "realDepartureTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Mouvement.prototype, "realArrivalTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Mouvement.prototype, "startMileage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Mouvement.prototype, "endMileage", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            lat: Number,
            lng: Number,
            timestamp: Date,
            speed: Number,
        },
    ]),
    __metadata("design:type", Array)
], Mouvement.prototype, "gpsTrace", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            type: { type: String, enum: ['time', 'distance', 'route'] },
            value: Number,
            description: String,
        },
    ]),
    __metadata("design:type", Array)
], Mouvement.prototype, "deviations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Mouvement.prototype, "driverObservations", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.Mixed }]),
    __metadata("design:type", Array)
], Mouvement.prototype, "photos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Mouvement.prototype, "isLocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'synced', 'error'], default: 'pending' }),
    __metadata("design:type", String)
], Mouvement.prototype, "syncStatus", void 0);
exports.Mouvement = Mouvement = __decorate([
    (0, mongoose_1.Schema)()
], Mouvement);
exports.MouvementSchema = mongoose_1.SchemaFactory.createForClass(Mouvement);
exports.MouvementSchema.pre('save', function (next) {
    if (this.stops && this.stops.length > 0) {
        this.dateDepart = this.stops[0].dateDepart;
        this.dateArrivee = this.stops[this.stops.length - 1].dateArrivee;
    }
    next();
});
//# sourceMappingURL=mouvement.schema.js.map