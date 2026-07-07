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
exports.ChecklistTemplateSchema = exports.ChecklistTemplate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ChecklistTemplate = class ChecklistTemplate {
    nom;
    nom_en;
    type;
    typeVehicule;
    coutParDefaut;
    taches;
    actif;
};
exports.ChecklistTemplate = ChecklistTemplate;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChecklistTemplate.prototype, "nom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ChecklistTemplate.prototype, "nom_en", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C'],
        required: true,
    }),
    __metadata("design:type", String)
], ChecklistTemplate.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Tous' }),
    __metadata("design:type", String)
], ChecklistTemplate.prototype, "typeVehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ChecklistTemplate.prototype, "coutParDefaut", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            numero: String,
            categorie: {
                type: String,
                enum: [
                    'Détection',
                    'Moteur',
                    'Roues/Pneus',
                    'Pneus',
                    'Batterie/Élec',
                    'Électricité',
                    'Éclairage',
                    'Sécurité/Documents',
                    'Sécurité',
                    'Communication',
                    'Nettoyage',
                    'Finalisation',
                    'Sous le Capot',
                    'Extérieur',
                    'Intérieur/Cabine',
                    'Test Routier',
                    'Autre',
                ],
            },
            description: { type: String, required: true },
            description_en: String,
            numeroTacheManuel: String,
            obligatoire: { type: Boolean, default: true },
        },
    ]),
    __metadata("design:type", Array)
], ChecklistTemplate.prototype, "taches", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ChecklistTemplate.prototype, "actif", void 0);
exports.ChecklistTemplate = ChecklistTemplate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChecklistTemplate);
exports.ChecklistTemplateSchema = mongoose_1.SchemaFactory.createForClass(ChecklistTemplate);
//# sourceMappingURL=checklist-template.schema.js.map