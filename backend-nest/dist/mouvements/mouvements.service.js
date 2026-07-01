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
            for (const log of logisticiens) {
                if (log.email)
                    await this.mailService.sendValidationRequest(log.email, await savedMouvement.populate([
                        { path: 'vehicule' },
                        { path: 'stops.lieu' },
                        { path: 'demandeur' },
                    ]));
            }
        }
        if (savedMouvement.statutSecurite === 'en attente') {
            const validatorIds = savedMouvement.securityApprovals.map((a) => a.validator);
            const valideursSecu = await this.userModel
                .find({ _id: { $in: validatorIds } })
                .exec();
            for (const valideur of valideursSecu) {
                if (valideur.email)
                    await this.mailService.sendValidationRequest(valideur.email, await savedMouvement.populate([
                        { path: 'vehicule' },
                        { path: 'stops.lieu' },
                        { path: 'demandeur' },
                    ]));
            }
        }
        return savedMouvement;
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