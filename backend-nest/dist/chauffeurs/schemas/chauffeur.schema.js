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
exports.ChauffeurSchema = exports.Chauffeur = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Chauffeur = class Chauffeur {
    nom;
    prenom;
    telephone;
    permis;
    disponible;
    schedules;
};
exports.Chauffeur = Chauffeur;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Chauffeur.prototype, "nom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Chauffeur.prototype, "prenom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Chauffeur.prototype, "telephone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Chauffeur.prototype, "permis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Chauffeur.prototype, "disponible", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            status: {
                type: String,
                enum: ['On Duty', 'Off Duty', 'Sick', 'Vacation', 'Other'],
                required: true,
            },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            notes: String,
        },
    ]),
    __metadata("design:type", Array)
], Chauffeur.prototype, "schedules", void 0);
exports.Chauffeur = Chauffeur = __decorate([
    (0, mongoose_1.Schema)()
], Chauffeur);
exports.ChauffeurSchema = mongoose_1.SchemaFactory.createForClass(Chauffeur);
//# sourceMappingURL=chauffeur.schema.js.map