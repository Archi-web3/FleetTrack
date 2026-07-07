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
exports.MouvementsConflictService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mouvement_schema_1 = require("./schemas/mouvement.schema");
let MouvementsConflictService = class MouvementsConflictService {
    mouvementModel;
    constructor(mouvementModel) {
        this.mouvementModel = mouvementModel;
    }
    async checkDriverConflict(chauffeurId, dateDepart, dateArrivee, excludeMouvementId = null) {
        if (!chauffeurId || !dateDepart || !dateArrivee)
            return null;
        const query = {
            chauffeur: chauffeurId,
            statut: {
                $in: [
                    'en attente',
                    'en attente validation sécurité',
                    'validé',
                    'pris en charge',
                    'en cours',
                ],
            },
            dateDepart: { $lt: dateArrivee },
            dateArrivee: { $gt: dateDepart },
        };
        if (excludeMouvementId) {
            query._id = { $ne: excludeMouvementId };
        }
        return this.mouvementModel
            .findOne(query)
            .populate('stops.lieu')
            .populate('demandeur', 'nom prenom')
            .exec();
    }
    async checkVehicleConflict(vehiculeId, dateDepart, dateArrivee, excludeMouvementId = null) {
        if (!vehiculeId || !dateDepart || !dateArrivee)
            return null;
        const query = {
            vehicule: vehiculeId,
            statut: {
                $in: [
                    'en attente',
                    'en attente validation sécurité',
                    'validé',
                    'pris en charge',
                    'en cours',
                ],
            },
            dateDepart: { $lt: dateArrivee },
            dateArrivee: { $gt: dateDepart },
        };
        if (excludeMouvementId) {
            query._id = { $ne: excludeMouvementId };
        }
        return this.mouvementModel
            .findOne(query)
            .populate('stops.lieu')
            .populate('demandeur', 'nom prenom')
            .exec();
    }
};
exports.MouvementsConflictService = MouvementsConflictService;
exports.MouvementsConflictService = MouvementsConflictService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MouvementsConflictService);
//# sourceMappingURL=mouvements-conflict.service.js.map