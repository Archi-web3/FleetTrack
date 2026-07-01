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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogbookController = void 0;
const common_1 = require("@nestjs/common");
const logbook_service_1 = require("./logbook.service");
const logbook_sync_service_1 = require("./logbook-sync.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const sync_payload_dto_1 = require("./dto/sync-payload.dto");
let LogbookController = class LogbookController {
    logbookService;
    logbookSyncService;
    constructor(logbookService, logbookSyncService) {
        this.logbookService = logbookService;
        this.logbookSyncService = logbookSyncService;
    }
    async getMyTrips(req) {
        return this.logbookService.getMyTrips(req.user.id || req.user._id);
    }
    async takeCharge(id, req) {
        return this.logbookService.takeCharge(id, req.user.id || req.user._id);
    }
    async syncData(payload) {
        return this.logbookSyncService.sync(payload);
    }
};
exports.LogbookController = LogbookController;
__decorate([
    (0, common_1.Get)('my-trips'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogbookController.prototype, "getMyTrips", null);
__decorate([
    (0, common_1.Post)('take-charge/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LogbookController.prototype, "takeCharge", null);
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_payload_dto_1.SyncPayloadDto]),
    __metadata("design:returntype", Promise)
], LogbookController.prototype, "syncData", null);
exports.LogbookController = LogbookController = __decorate([
    (0, common_1.Controller)('api/logbook'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [logbook_service_1.LogbookService,
        logbook_sync_service_1.LogbookSyncService])
], LogbookController);
//# sourceMappingURL=logbook.controller.js.map