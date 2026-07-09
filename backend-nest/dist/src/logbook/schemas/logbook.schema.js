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
exports.GenerateurLogbookSchema = exports.GenerateurLogbook = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let GenerateurLogbook = class GenerateurLogbook {
    generateur;
    utilisateur;
    dateReleve;
    heureDebut;
    heureFin;
    carburantAjoute;
    observations;
};
exports.GenerateurLogbook = GenerateurLogbook;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Generateur',
        required: true,
    }),
    __metadata("design:type", String)
], GenerateurLogbook.prototype, "generateur", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true,
    }),
    __metadata("design:type", String)
], GenerateurLogbook.prototype, "utilisateur", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], GenerateurLogbook.prototype, "dateReleve", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GenerateurLogbook.prototype, "heureDebut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GenerateurLogbook.prototype, "heureFin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], GenerateurLogbook.prototype, "carburantAjoute", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GenerateurLogbook.prototype, "observations", void 0);
exports.GenerateurLogbook = GenerateurLogbook = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GenerateurLogbook);
exports.GenerateurLogbookSchema = mongoose_1.SchemaFactory.createForClass(GenerateurLogbook);
exports.GenerateurLogbookSchema.virtual('dureeSession').get(function () {
    return this.heureFin - this.heureDebut;
});
exports.GenerateurLogbookSchema.virtual('consommationLpH').get(function () {
    const duree = this.heureFin - this.heureDebut;
    if (duree > 0 && this.carburantAjoute > 0) {
        return this.carburantAjoute / duree;
    }
    return 0;
});
//# sourceMappingURL=logbook.schema.js.map