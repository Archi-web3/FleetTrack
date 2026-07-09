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
exports.ServiceScheduleSchema = exports.ServiceSchedule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
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
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true,
    }),
    __metadata("design:type", String)
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
    (0, mongoose_1.Prop)([
        {
            description: String,
            numeroTacheManuel: String,
            validee: { type: Boolean, default: false },
            dateValidation: Date,
            validePar: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Utilisateur' },
            commentaire: String,
        },
    ]),
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
//# sourceMappingURL=service-schedule.schema.js.map