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
exports.WaiverSchema = exports.Waiver = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Waiver = class Waiver {
    visitorName;
    signatureUrl;
    vehicleId;
    tripId;
    signedAt;
    legalTextVersion;
};
exports.Waiver = Waiver;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Waiver.prototype, "visitorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Waiver.prototype, "signatureUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicule', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Waiver.prototype, "vehicleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Mouvement' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Waiver.prototype, "tripId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Waiver.prototype, "signedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'v1.0' }),
    __metadata("design:type", String)
], Waiver.prototype, "legalTextVersion", void 0);
exports.Waiver = Waiver = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Waiver);
exports.WaiverSchema = mongoose_1.SchemaFactory.createForClass(Waiver);
//# sourceMappingURL=waiver.schema.js.map