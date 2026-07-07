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
exports.MaintenanceSchema = exports.Maintenance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Maintenance = class Maintenance {
    date;
    vehicule;
    type;
    mileage;
    garage;
    mechanic;
    tasks;
    parts;
    cost;
    invoicePhoto;
    mechanicSignature;
    nextMaintenanceMileage;
    comments;
};
exports.Maintenance = Maintenance;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Maintenance.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true,
    }),
    __metadata("design:type", String)
], Maintenance.prototype, "vehicule", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Preventive', 'Curative', 'Contrôle Technique', 'Autre'],
        required: true,
    }),
    __metadata("design:type", String)
], Maintenance.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Maintenance.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Maintenance.prototype, "garage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Maintenance.prototype, "mechanic", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            name: String,
            status: {
                type: String,
                enum: ['OK', 'Not OK', 'Fixed', 'Pending'],
                default: 'OK',
            },
            comments: String,
        },
    ]),
    __metadata("design:type", Array)
], Maintenance.prototype, "tasks", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            name: String,
            quantity: Number,
            reference: String,
            price: Number,
        },
    ]),
    __metadata("design:type", Array)
], Maintenance.prototype, "parts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "cost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Maintenance.prototype, "invoicePhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Maintenance.prototype, "mechanicSignature", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "nextMaintenanceMileage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Maintenance.prototype, "comments", void 0);
exports.Maintenance = Maintenance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Maintenance);
exports.MaintenanceSchema = mongoose_1.SchemaFactory.createForClass(Maintenance);
//# sourceMappingURL=maintenance.schema.js.map