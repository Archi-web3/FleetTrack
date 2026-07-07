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
var MouvementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouvementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mouvement_schema_1 = require("./schemas/mouvement.schema");
const mouvements_conflict_service_1 = require("./mouvements-conflict.service");
const mouvements_security_service_1 = require("./mouvements-security.service");
const mail_service_1 = require("../notifications/mail.service");
const lieu_schema_1 = require("../lieux/schemas/lieu.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let MouvementsService = MouvementsService_1 = class MouvementsService {
    mouvementModel;
    lieuModel;
    userModel;
    conflictService;
    securityService;
    mailService;
    logger = new common_1.Logger(MouvementsService_1.name);
    constructor(mouvementModel, lieuModel, userModel, conflictService, securityService, mailService) {
        this.mouvementModel = mouvementModel;
        this.lieuModel = lieuModel;
        this.userModel = userModel;
        this.conflictService = conflictService;
        this.securityService = securityService;
        this.mailService = mailService;
    }
    async findAll(query = {}) {
        return this.mouvementModel
            .find(query)
            .populate('stops.lieu', 'nom adresse coordonnees estSensible')
            .populate('demandeur', 'nom email prenom')
            .populate('vehicule', 'marque modele immatriculation')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('passagers', 'nom email prenom')
            .populate('securityApprovals.validator', 'nom prenom email')
            .exec();
    }
    async getPlanning(includePending) {
        const statusFilter = ['validé', 'pris en charge', 'en cours', 'terminé'];
        if (includePending) {
            statusFilter.push('en attente', 'en attente validation sécurité');
        }
        return this.mouvementModel
            .find({ statut: { $in: statusFilter } })
            .populate('stops.lieu', 'nom adresse coordonnees estSensible')
            .populate('demandeur', 'nom email prenom')
            .populate('vehicule', 'marque modele immatriculation')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('passagers', 'nom email prenom')
            .sort({ 'stops.0.dateDepart': 1 })
            .exec();
    }
    async getStatsByStatus() {
        return this.mouvementModel.aggregate([
            {
                $group: {
                    _id: '$statut',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    statut: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
    }
    async getStatsByVehicle() {
        return this.mouvementModel.aggregate([
            {
                $match: {
                    startMileage: { $exists: true, $ne: null },
                    endMileage: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: '$vehicule',
                    totalDistance: {
                        $sum: { $subtract: ['$endMileage', '$startMileage'] },
                    },
                    totalTrips: { $sum: 1 },
                },
            },
            { $sort: { totalDistance: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'vehicules',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vehiculeDetails',
                },
            },
            { $unwind: '$vehiculeDetails' },
            {
                $project: {
                    vehicule: '$vehiculeDetails.immatriculation',
                    marque: '$vehiculeDetails.marque',
                    modele: '$vehiculeDetails.modele',
                    totalDistance: 1,
                    totalTrips: 1,
                },
            },
        ]);
    }
    async findById(id) {
        return this.mouvementModel
            .findById(id)
            .populate('stops.lieu', 'nom adresse coordonnees estSensible')
            .populate('demandeur', 'nom email prenom')
            .populate('vehicule', 'marque modele immatriculation')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('passagers', 'nom email prenom')
            .exec();
    }
    async create(createDto, user, forceConflict = false) {
        this.logger.log(`🆕 [CREATE MOUVEMENT] Start...`);
        let dateDepart = createDto.dateDepart;
        let dateArrivee = createDto.dateArrivee;
        if (createDto.stops && createDto.stops.length > 0) {
            dateDepart = new Date(createDto.stops[0].dateDepart);
            dateArrivee = new Date(createDto.stops[createDto.stops.length - 1].dateArrivee);
        }
        if (dateDepart && dateArrivee && !forceConflict) {
            if (createDto.chauffeur) {
                const conflict = await this.conflictService.checkDriverConflict(createDto.chauffeur, dateDepart, dateArrivee);
                if (conflict) {
                    throw new common_1.ConflictException(`Conflit : Le chauffeur est déjà occupé sur cette période.`);
                }
            }
            if (createDto.vehicule) {
                const conflict = await this.conflictService.checkVehicleConflict(createDto.vehicule, dateDepart, dateArrivee);
                if (conflict) {
                    throw new common_1.ConflictException(`Conflit : Le véhicule est déjà utilisé sur cette période.`);
                }
            }
        }
        let statutInitial = 'en attente';
        let statutLogistiqueInitial = 'en attente';
        let statutSecuriteInitial = 'en attente';
        let maxSecurityLevel = 0;
        if (createDto.type === 'maintenance') {
            statutInitial = 'validé';
            statutLogistiqueInitial = 'non requis';
            statutSecuriteInitial = 'non requis';
        }
        else {
            const stopLieuIds = createDto.stops.map((stop) => stop.lieu);
            const lieuxImpliques = await this.lieuModel
                .find({ _id: { $in: stopLieuIds } })
                .exec();
            lieuxImpliques.forEach((lieu) => {
                const niveau = lieu.niveauSecurite || (lieu.estSensible ? 3 : 1);
                if (niveau > maxSecurityLevel)
                    maxSecurityLevel = niveau;
            });
            if (maxSecurityLevel === 0)
                statutSecuriteInitial = 'non requis';
        }
        let inferredBase = null;
        let inferredPays = null;
        if (createDto.type !== 'maintenance' &&
            createDto.stops &&
            createDto.stops.length > 0) {
            const firstStopLieu = await this.lieuModel
                .findById(createDto.stops[0].lieu)
                .exec();
            if (firstStopLieu) {
                inferredBase = firstStopLieu.base;
                inferredPays = firstStopLieu.pays;
            }
        }
        const finalBase = user.base || inferredBase;
        const finalPays = user.pays || inferredPays || createDto.pays;
        console.log('--- DEBUG SERVICE ---');
        console.log('inferredPays:', inferredPays);
        console.log('user.pays:', user.pays);
        console.log('createDto.pays:', createDto.pays);
        console.log('finalPays:', finalPays);
        if (!finalPays && createDto.type !== 'maintenance') {
            throw new common_1.BadRequestException("Impossible de déterminer le pays pour ce mouvement. Veuillez vérifier que votre profil ou le lieu de départ est bien rattaché à un pays.");
        }
        const mouvement = new this.mouvementModel({
            ...createDto,
            demandeur: createDto.demandeur || user._id || user.id,
            statut: statutInitial,
            statutLogistique: statutLogistiqueInitial,
            statutSecurite: statutSecuriteInitial,
            validationLevelRequired: maxSecurityLevel,
            base: finalBase,
            pays: finalPays,
        });
        if (mouvement.statutSecurite === 'en attente') {
            const { mode, validators } = await this.securityService.calculateValidators(mouvement.pays.toString(), mouvement.base ? mouvement.base.toString() : null, maxSecurityLevel);
            mouvement.securityValidationMode = mode;
            mouvement.securityApprovals = validators;
        }
        const savedMouvement = await mouvement.save();
        if (savedMouvement.statutLogistique === 'en attente') {
            const logisticiens = await this.userModel
                .find({
                profil: { $in: ['Superviseur', 'Admin'] },
                pays: savedMouvement.pays,
            })
                .exec();
            const emails = [];
            for (const log of logisticiens) {
                if (log.email)
                    emails.push(log.email);
            }
            if (emails.length > 0) {
                await this.mailService.sendTemplateEmail('req_created', await savedMouvement.populate([
                    { path: 'vehicule' },
                    { path: 'stops.lieu' },
                    { path: 'demandeur' },
                ]), emails);
            }
        }
        if (savedMouvement.statutSecurite === 'en attente') {
            const validatorIds = savedMouvement.securityApprovals.map((a) => a.validator);
            const valideursSecu = await this.userModel
                .find({ _id: { $in: validatorIds } })
                .exec();
            const emails = [];
            for (const valideur of valideursSecu) {
                if (valideur.email)
                    emails.push(valideur.email);
            }
            if (emails.length > 0) {
                await this.mailService.sendTemplateEmail('sec_validated', await savedMouvement.populate([
                    { path: 'vehicule' },
                    { path: 'stops.lieu' },
                    { path: 'demandeur' },
                ]), emails);
            }
        }
        return savedMouvement;
    }
    async update(id, updateDto) {
        const oldMouvement = await this.mouvementModel.findById(id).exec();
        const updated = await this.mouvementModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .populate([{ path: 'demandeur' }, { path: 'vehicule' }, { path: 'stops.lieu' }])
            .exec();
        if (!updated) {
            throw new common_1.ConflictException('Mouvement non trouvé');
        }
        if (oldMouvement && oldMouvement.statut !== updated.statut) {
            const demandeurEmail = updated.demandeur?.email;
            if (demandeurEmail) {
                if (updated.statut === 'validé') {
                    await this.mailService.sendTemplateEmail('assigned', updated, [demandeurEmail]);
                }
                else if (updated.statut === 'refusé' || updated.statut === 'annulé') {
                    await this.mailService.sendTemplateEmail('cancelled', updated, [demandeurEmail]);
                }
            }
        }
        if (oldMouvement && oldMouvement.statutLogistique !== updated.statutLogistique && updated.statutLogistique === 'validé') {
            if (updated.statutSecurite === 'en attente') {
                const validatorIds = updated.securityApprovals.map((a) => a.validator);
                const valideursSecu = await this.userModel.find({ _id: { $in: validatorIds } }).exec();
                const emails = valideursSecu.map(v => v.email).filter(e => e);
                if (emails.length > 0) {
                    await this.mailService.sendTemplateEmail('log_validated', updated, emails);
                }
            }
        }
        return updated;
    }
    async validateSecurity(id, user) {
        const mouvement = await this.mouvementModel.findById(id).exec();
        if (!mouvement)
            throw new common_1.ConflictException('Mouvement non trouvé');
        if (!mouvement.securityApprovals ||
            mouvement.securityApprovals.length === 0) {
            return mouvement;
        }
        const securityApprovals = mouvement.securityApprovals;
        const userId = user._id || user.id;
        const userIdStr = userId.toString();
        const approvalIndex = securityApprovals.findIndex((a) => a.validator.toString() === userIdStr);
        if (approvalIndex === -1) {
            throw new common_1.ConflictException("Vous n'êtes pas autorisé à valider ce mouvement");
        }
        securityApprovals[approvalIndex].status = 'approved';
        securityApprovals[approvalIndex].approvalDate = new Date();
        const allApproved = securityApprovals
            .filter((a) => !a.isBackup)
            .every((a) => a.status === 'approved');
        let oldStatut = mouvement.statut;
        if (allApproved) {
            mouvement.statutSecurite = 'validé';
            if (mouvement.statutLogistique === 'non requis' ||
                mouvement.statutLogistique === 'validé') {
                mouvement.statut = 'validé';
            }
            else {
                mouvement.statut = 'en attente validation logistique';
            }
        }
        const updated = await mouvement.save();
        const populatedMouvement = await this.mouvementModel.findById(updated._id).populate([{ path: 'demandeur' }, { path: 'vehicule' }, { path: 'stops.lieu' }]).exec();
        const demandeurEmail = populatedMouvement?.demandeur?.email;
        if (demandeurEmail) {
            if (allApproved && mouvement.statutSecurite === 'validé') {
                await this.mailService.sendTemplateEmail('sec_validated', populatedMouvement, [demandeurEmail]);
            }
            if (oldStatut !== updated.statut && updated.statut === 'validé') {
                await this.mailService.sendTemplateEmail('assigned', populatedMouvement, [demandeurEmail]);
            }
        }
        return updated;
    }
    async cleanGhosts() {
        const mouvementsGroupes = await this.mouvementModel
            .find({ statut: 'regroupé' })
            .populate('parentMouvement')
            .exec();
        const ghostsToDelete = mouvementsGroupes.filter((m) => !m.parentMouvement);
        if (ghostsToDelete.length > 0) {
            const ids = ghostsToDelete.map((m) => m._id);
            await this.mouvementModel.deleteMany({ _id: { $in: ids } }).exec();
            return {
                message: `${ghostsToDelete.length} mouvements fantômes nettoyés.`,
            };
        }
        return { message: 'Aucun fantôme trouvé.' };
    }
    async fixCountries() {
        return { message: 'Not implemented' };
    }
    async getSuggestions(_id) {
        return [];
    }
    async remove(id) {
        return this.mouvementModel.findByIdAndDelete(id).exec();
    }
};
exports.MouvementsService = MouvementsService;
exports.MouvementsService = MouvementsService = MouvementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __param(1, (0, mongoose_1.InjectModel)(lieu_schema_1.Lieu.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mouvements_conflict_service_1.MouvementsConflictService,
        mouvements_security_service_1.MouvementsSecurityService,
        mail_service_1.MailService])
], MouvementsService);
//# sourceMappingURL=mouvements.service.js.map