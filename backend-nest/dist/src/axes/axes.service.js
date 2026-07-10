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
exports.AxesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axe_schema_1 = require("./schemas/axe.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let AxesService = class AxesService {
    axeModel;
    auditLogsService;
    constructor(axeModel, auditLogsService) {
        this.axeModel = axeModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createAxeDto, req) {
        const createdAxe = new this.axeModel(createAxeDto);
        const result = await createdAxe.save();
        await this.auditLogsService.logAction(req, 'CREATE_AXE', 'Axe', result._id.toString(), result.toObject());
        return result.populate(['depart', 'arrivee', 'pays', 'base']);
    }
    async findAll(context) {
        const filter = {};
        if (context.paysIds && context.paysIds.length > 0) {
            filter.pays = { $in: context.paysIds };
        }
        if (context.baseIds && context.baseIds.length > 0) {
            filter.base = { $in: context.baseIds };
        }
        return this.axeModel.find(filter).populate(['depart', 'arrivee', 'pays', 'base']).exec();
    }
    async findOne(id) {
        const axe = await this.axeModel.findById(id).populate(['depart', 'arrivee', 'pays', 'base']).exec();
        if (!axe) {
            throw new common_1.NotFoundException(`Axe with ID ${id} not found`);
        }
        return axe;
    }
    async update(id, updateAxeDto, req) {
        const existingAxe = await this.axeModel
            .findByIdAndUpdate(id, updateAxeDto, { new: true })
            .exec();
        if (!existingAxe) {
            throw new common_1.NotFoundException(`Axe with ID ${id} not found`);
        }
        await this.auditLogsService.logAction(req, 'UPDATE_AXE', 'Axe', id, existingAxe.toObject());
        return existingAxe.populate(['depart', 'arrivee', 'pays', 'base']);
    }
    async delete(id, req) {
        const deletedAxe = await this.axeModel.findByIdAndDelete(id).exec();
        if (!deletedAxe) {
            throw new common_1.NotFoundException(`Axe with ID ${id} not found`);
        }
        await this.auditLogsService.logAction(req, 'DELETE_AXE', 'Axe', id, deletedAxe.toObject());
    }
    async findAxeBetween(lieu1Id, lieu2Id) {
        const axe = await this.axeModel.findOne({
            actif: true,
            $or: [
                { depart: lieu1Id, arrivee: lieu2Id },
                { depart: lieu2Id, arrivee: lieu1Id },
            ]
        }).exec();
        return axe;
    }
};
exports.AxesService = AxesService;
exports.AxesService = AxesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(axe_schema_1.Axe.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], AxesService);
//# sourceMappingURL=axes.service.js.map