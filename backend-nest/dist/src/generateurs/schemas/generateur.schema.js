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
exports.GenerateurSchema = exports.Generateur = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Generateur = class Generateur {
    marque;
    modele;
    puissanceKVA;
    numeroSerie;
    numeroMoteur;
    acfCode;
    categorie;
    proprietaire;
    typeCarburant;
    anneeFabrication;
    anneePremiereUtilisation;
    coutAssuranceAnnuel;
    dateCommencement;
    base;
    pays;
    siteInstallation;
    statut;
    heuresInitiales;
    heuresFonctionnement;
    consommationTheorique;
    dateAcquisition;
    valeurAchat;
    notes;
    remarques;
};
exports.Generateur = Generateur;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Generateur.prototype, "marque", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Generateur.prototype, "modele", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Generateur.prototype, "puissanceKVA", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Generateur.prototype, "numeroSerie", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "numeroMoteur", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "acfCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "categorie", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "proprietaire", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Diesel', 'Essence', 'Autre'], default: 'Diesel' }),
    __metadata("design:type", String)
], Generateur.prototype, "typeCarburant", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Generateur.prototype, "anneeFabrication", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Generateur.prototype, "anneePremiereUtilisation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Generateur.prototype, "coutAssuranceAnnuel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Generateur.prototype, "dateCommencement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Base', required: true }),
    __metadata("design:type", String)
], Generateur.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Pays' }),
    __metadata("design:type", String)
], Generateur.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "siteInstallation", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Actif', 'En maintenance', 'En panne', 'Hors service'],
        default: 'Actif',
    }),
    __metadata("design:type", String)
], Generateur.prototype, "statut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Generateur.prototype, "heuresInitiales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Generateur.prototype, "heuresFonctionnement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Generateur.prototype, "consommationTheorique", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Generateur.prototype, "dateAcquisition", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Generateur.prototype, "valeurAchat", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Generateur.prototype, "remarques", void 0);
exports.Generateur = Generateur = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Generateur);
exports.GenerateurSchema = mongoose_1.SchemaFactory.createForClass(Generateur);
//# sourceMappingURL=generateur.schema.js.map