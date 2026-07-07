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
exports.AlertSchema = exports.Alert = exports.AlertDeletedBy = exports.AlertReadBy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AlertReadBy = class AlertReadBy {
    vehicleId;
    readAt;
    user;
};
exports.AlertReadBy = AlertReadBy;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AlertReadBy.prototype, "vehicleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AlertReadBy.prototype, "readAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AlertReadBy.prototype, "user", void 0);
exports.AlertReadBy = AlertReadBy = __decorate([
    (0, mongoose_1.Schema)()
], AlertReadBy);
const AlertReadBySchema = mongoose_1.SchemaFactory.createForClass(AlertReadBy);
let AlertDeletedBy = class AlertDeletedBy {
    vehicleId;
    deletedAt;
};
exports.AlertDeletedBy = AlertDeletedBy;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AlertDeletedBy.prototype, "vehicleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AlertDeletedBy.prototype, "deletedAt", void 0);
exports.AlertDeletedBy = AlertDeletedBy = __decorate([
    (0, mongoose_1.Schema)()
], AlertDeletedBy);
const AlertDeletedBySchema = mongoose_1.SchemaFactory.createForClass(AlertDeletedBy);
let Alert = class Alert {
    title;
    message;
    severity;
    targetType;
    targetVehicleId;
    createdBy;
    active;
    readBy;
    deletedBy;
    createdAt;
};
exports.Alert = Alert;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Alert.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Alert.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['info', 'warning', 'danger'], default: 'info' }),
    __metadata("design:type", String)
], Alert.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['all', 'vehicle'], required: true }),
    __metadata("design:type", String)
], Alert.prototype, "targetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Alert.prototype, "targetVehicleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Alert.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Alert.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AlertReadBySchema] }),
    __metadata("design:type", Array)
], Alert.prototype, "readBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AlertDeletedBySchema] }),
    __metadata("design:type", Array)
], Alert.prototype, "deletedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now, expires: '7d' }),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
exports.Alert = Alert = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Alert);
exports.AlertSchema = mongoose_1.SchemaFactory.createForClass(Alert);
//# sourceMappingURL=alert.schema.js.map