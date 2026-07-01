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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
let AuditLogsService = class AuditLogsService {
    auditLogModel;
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async logAction(req, action, category, target, details) {
        try {
            const logEntry = {
                action,
                category,
                target,
                details,
                timestamp: new Date(),
            };
            if (req) {
                const reqObj = req;
                logEntry.ip = reqObj.ip || reqObj.connection?.remoteAddress;
                const user = req.user || reqObj.utilisateur;
                if (user) {
                    logEntry.actor = {
                        userId: user._id || user.id || 'Unknown',
                        nom: user.nom || 'Unknown',
                        role: String((typeof user.role === 'object' && user.role !== null
                            ? user.role.name
                            : user.role) ||
                            user.profil ||
                            'Unknown'),
                    };
                    if (user.pays) {
                        logEntry.pays =
                            typeof user.pays === 'object' && user.pays !== null
                                ? user.pays._id
                                : user.pays;
                    }
                }
            }
            const newLog = new this.auditLogModel(logEntry);
            await newLog.save();
        }
        catch (err) {
            console.error("Erreur lors de l'enregistrement de l'audit:", err);
        }
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map