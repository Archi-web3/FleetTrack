import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mouvement, MouvementDocument } from './schemas/mouvement.schema';
import { MouvementsConflictService } from './mouvements-conflict.service';
import { MouvementsSecurityService } from './mouvements-security.service';
import { MailService } from '../notifications/mail.service';
import { Lieu, LieuDocument } from '../lieux/schemas/lieu.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  CreateMouvementDto,
  UserPayloadDto,
  MouvementQueryDto,
} from './dto/mouvements.dto';

@Injectable()
export class MouvementsService {
  private readonly logger = new Logger(MouvementsService.name);

  constructor(
    @InjectModel(Mouvement.name)
    private mouvementModel: Model<MouvementDocument>,
    @InjectModel(Lieu.name) private lieuModel: Model<LieuDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private conflictService: MouvementsConflictService,
    private securityService: MouvementsSecurityService,
    private mailService: MailService,
  ) {}

  async findAll(query: MouvementQueryDto = {}): Promise<Mouvement[]> {
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

  async findById(id: string): Promise<MouvementDocument | null> {
    return this.mouvementModel
      .findById(id)
      .populate('stops.lieu', 'nom adresse coordonnees estSensible')
      .populate('demandeur', 'nom email prenom')
      .populate('vehicule', 'marque modele immatriculation')
      .populate('chauffeur', 'nom prenom telephone')
      .populate('passagers', 'nom email prenom')
      .exec();
  }

  async create(
    createDto: CreateMouvementDto,
    user: UserPayloadDto,
    forceConflict: boolean = false,
  ): Promise<Mouvement> {
    this.logger.log(`🆕 [CREATE MOUVEMENT] Start...`);

    // 1. Calcul des dates
    let dateDepart = createDto.dateDepart;
    let dateArrivee = createDto.dateArrivee;
    if (createDto.stops && createDto.stops.length > 0) {
      dateDepart = new Date(
        createDto.stops[0].dateDepart as string | number | Date,
      );
      dateArrivee = new Date(
        createDto.stops[createDto.stops.length - 1].dateArrivee as
          | string
          | number
          | Date,
      );
    }

    // 2. Vérification Conflits
    if (dateDepart && dateArrivee && !forceConflict) {
      if (createDto.chauffeur) {
        const conflict = await this.conflictService.checkDriverConflict(
          createDto.chauffeur,
          dateDepart,
          dateArrivee,
        );
        if (conflict) {
          throw new ConflictException(
            `Conflit : Le chauffeur est déjà occupé sur cette période.`,
          );
        }
      }
      if (createDto.vehicule) {
        const conflict = await this.conflictService.checkVehicleConflict(
          createDto.vehicule,
          dateDepart,
          dateArrivee,
        );
        if (conflict) {
          throw new ConflictException(
            `Conflit : Le véhicule est déjà utilisé sur cette période.`,
          );
        }
      }
    }

    // 3. Calcul du niveau de sécurité
    let statutInitial = 'en attente';
    let statutLogistiqueInitial = 'en attente';
    let statutSecuriteInitial = 'en attente';
    let maxSecurityLevel = 0;

    if (createDto.type === 'maintenance') {
      statutInitial = 'validé';
      statutLogistiqueInitial = 'non requis';
      statutSecuriteInitial = 'non requis';
    } else {
      const stopLieuIds = createDto.stops.map(
        (stop: { lieu: string }) => stop.lieu,
      );
      const lieuxImpliques = await this.lieuModel
        .find({ _id: { $in: stopLieuIds } })
        .exec();

      lieuxImpliques.forEach((lieu) => {
        const niveau = lieu.niveauSecurite || (lieu.estSensible ? 3 : 1);
        if (niveau > maxSecurityLevel) maxSecurityLevel = niveau;
      });

      if (maxSecurityLevel === 0) statutSecuriteInitial = 'non requis';
    }

    // 4. Inférence Base/Pays
    let inferredBase: string | import('mongoose').Types.ObjectId | null = null;
    let inferredPays: string | import('mongoose').Types.ObjectId | null = null;
    if (
      createDto.type !== 'maintenance' &&
      createDto.stops &&
      createDto.stops.length > 0
    ) {
      const firstStopLieu = await this.lieuModel
        .findById(createDto.stops[0].lieu as string)
        .exec();
      if (firstStopLieu) {
        inferredBase = firstStopLieu.base;
        inferredPays = firstStopLieu.pays;
      }
    }

    const finalBase = user.base || inferredBase;
    const finalPays = user.pays || inferredPays || createDto.pays;

    // 5. Instanciation
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

    // 6. Matrice de Sécurité (si requis)
    if (mouvement.statutSecurite === 'en attente') {
      const { mode, validators } =
        await this.securityService.calculateValidators(
          mouvement.pays.toString(),
          mouvement.base ? mouvement.base.toString() : null,
          maxSecurityLevel,
        );
      mouvement.securityValidationMode = mode;
      mouvement.securityApprovals = validators;
    }

    // 7. Sauvegarde
    const savedMouvement = await mouvement.save();

    // 8. Notifications Email
    if (savedMouvement.statutLogistique === 'en attente') {
      // Notifier les logisticiens (Admin/Superviseur du pays)
      const logisticiens = await this.userModel
        .find({
          profil: { $in: ['Superviseur', 'Admin'] },
          pays: savedMouvement.pays,
        })
        .exec();
      for (const log of logisticiens) {
        if (log.email)
          await this.mailService.sendValidationRequest(
            log.email,
            await savedMouvement.populate([
              { path: 'vehicule' },
              { path: 'stops.lieu' },
              { path: 'demandeur' },
            ]),
          );
      }
    }

    if (savedMouvement.statutSecurite === 'en attente') {
      const validatorIds = savedMouvement.securityApprovals.map(
        (a: Record<string, any>) => a.validator as string,
      );
      const valideursSecu = await this.userModel
        .find({ _id: { $in: validatorIds } })
        .exec();
      for (const valideur of valideursSecu) {
        if (valideur.email)
          await this.mailService.sendValidationRequest(
            valideur.email,
            await savedMouvement.populate([
              { path: 'vehicule' },
              { path: 'stops.lieu' },
              { path: 'demandeur' },
            ]),
          );
      }
    }

    return savedMouvement;
  }

  // UPDATE / DELETE / STATS LOGIC TO BE ADDED IF NEEDED
}
