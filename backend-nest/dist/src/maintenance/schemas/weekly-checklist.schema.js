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
exports.WeeklyChecklistSchema = exports.WeeklyChecklist = exports.WeeklyTask = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WeeklyTask = class WeeklyTask {
    numero;
    categorie;
    description;
    numeroTacheManuel;
    validee;
    dateValidation;
    commentaire;
};
exports.WeeklyTask = WeeklyTask;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeeklyTask.prototype, "numero", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeeklyTask.prototype, "categorie", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeeklyTask.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeeklyTask.prototype, "numeroTacheManuel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WeeklyTask.prototype, "validee", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WeeklyTask.prototype, "dateValidation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeeklyTask.prototype, "commentaire", void 0);
exports.WeeklyTask = WeeklyTask = __decorate([
    (0, mongoose_1.Schema)()
], WeeklyTask);
const WeeklyTaskSchema = mongoose_1.SchemaFactory.createForClass(WeeklyTask);
let WeeklyChecklist = class WeeklyChecklist {
    vehicule;
    semaine;
    annee;
    chauffeur;
    taches;
    completee;
    tauxCompletion;
    dateCreation;
    dateCompletion;
};
exports.WeeklyChecklist = WeeklyChecklist;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicule', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WeeklyChecklist.prototype, "vehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 53 }),
    __metadata("design:type", Number)
], WeeklyChecklist.prototype, "semaine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeeklyChecklist.prototype, "annee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WeeklyChecklist.prototype, "chauffeur", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [WeeklyTaskSchema] }),
    __metadata("design:type", Array)
], WeeklyChecklist.prototype, "taches", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WeeklyChecklist.prototype, "completee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], WeeklyChecklist.prototype, "tauxCompletion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WeeklyChecklist.prototype, "dateCreation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WeeklyChecklist.prototype, "dateCompletion", void 0);
exports.WeeklyChecklist = WeeklyChecklist = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WeeklyChecklist);
exports.WeeklyChecklistSchema = mongoose_1.SchemaFactory.createForClass(WeeklyChecklist);
exports.WeeklyChecklistSchema.index({ vehicule: 1, semaine: 1, annee: 1 });
exports.WeeklyChecklistSchema.index({ chauffeur: 1, completee: 1 });
//# sourceMappingURL=weekly-checklist.schema.js.map