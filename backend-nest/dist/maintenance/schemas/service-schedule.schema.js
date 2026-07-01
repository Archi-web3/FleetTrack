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
exports.ServiceScheduleSchema = exports.ServiceSchedule = exports.ServiceTask = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ServiceTask = class ServiceTask {
    description;
    numeroTacheManuel;
    validee;
    dateValidation;
    validePar;
    commentaire;
};
exports.ServiceTask = ServiceTask;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ServiceTask.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ServiceTask.prototype, "numeroTacheManuel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ServiceTask.prototype, "validee", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ServiceTask.prototype, "dateValidation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ServiceTask.prototype, "validePar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ServiceTask.prototype, "commentaire", void 0);
exports.ServiceTask = ServiceTask = __decorate([
    (0, mongoose_1.Schema)()
], ServiceTask);
const ServiceTaskSchema = mongoose_1.SchemaFactory.createForClass(ServiceTask);
let ServiceSchedule = class ServiceSchedule {
    vehicule;
    typeService;
    kilometragePrevu;
    kilometrageActuel;
    statut;
    dateAlerte;
    taches;
    signature;
    dateCreation;
    dateCompletion;
    prochainService;
};
exports.ServiceSchedule = ServiceSchedule;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicule', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ServiceSchedule.prototype, "vehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceSchedule.prototype, "typeService", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ServiceSchedule.prototype, "kilometragePrevu", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ServiceSchedule.prototype, "kilometrageActuel", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['À venir', 'Dû', 'En retard', 'Complété'],
        default: 'À venir',
    }),
    __metadata("design:type", String)
], ServiceSchedule.prototype, "statut", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ServiceSchedule.prototype, "dateAlerte", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ServiceTaskSchema] }),
    __metadata("design:type", Array)
], ServiceSchedule.prototype, "taches", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ServiceSchedule.prototype, "signature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ServiceSchedule.prototype, "dateCreation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ServiceSchedule.prototype, "dateCompletion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ServiceSchedule.prototype, "prochainService", void 0);
exports.ServiceSchedule = ServiceSchedule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ServiceSchedule);
exports.ServiceScheduleSchema = mongoose_1.SchemaFactory.createForClass(ServiceSchedule);
exports.ServiceScheduleSchema.index({ vehicule: 1, statut: 1 });
exports.ServiceScheduleSchema.index({ kilometragePrevu: 1 });
//# sourceMappingURL=service-schedule.schema.js.map