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
exports.AxeSchema = exports.Axe = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Axe = class Axe {
    nom;
    depart;
    arrivee;
    niveauSecurite;
    commentaire;
    actif;
    pays;
    base;
};
exports.Axe = Axe;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Axe.prototype, "nom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Lieu', required: true }),
    __metadata("design:type", String)
], Axe.prototype, "depart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Lieu', required: true }),
    __metadata("design:type", String)
], Axe.prototype, "arrivee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: [1, 2, 3, 4, 5], default: 1 }),
    __metadata("design:type", Number)
], Axe.prototype, "niveauSecurite", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Axe.prototype, "commentaire", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Axe.prototype, "actif", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Pays', required: true }),
    __metadata("design:type", String)
], Axe.prototype, "pays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Base', required: false }),
    __metadata("design:type", String)
], Axe.prototype, "base", void 0);
exports.Axe = Axe = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Axe);
exports.AxeSchema = mongoose_1.SchemaFactory.createForClass(Axe);
//# sourceMappingURL=axe.schema.js.map