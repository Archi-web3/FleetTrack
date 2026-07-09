import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
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

  async getPlanning(includePending: boolean): Promise<Mouvement[]> {
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

  async getStatsByStatus(): Promise<any[]> {
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

  async getStatsByVehicle(): Promise<any[]> {
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

    // Prioritize createDto, then inferred, then if user has only 1 pays/base
    const finalBase = createDto.base && createDto.base !== 'all' ? createDto.base : (inferredBase || (Array.isArray(user.base) && user.base.length === 1 ? user.base[0] : null));
    let finalPays = createDto.pays && createDto.pays !== 'all' ? createDto.pays : (inferredPays || (Array.isArray(user.pays) && user.pays.length === 1 ? user.pays[0] : null));
    


    if (!finalPays && createDto.type !== 'maintenance') {
      throw new BadRequestException(
        "Impossible de déterminer le pays pour ce mouvement. Veuillez sélectionner un pays de contexte ou préciser le lieu de départ.",
      );
    }

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
      
      if (validators.length === 0 && mode === 'matrix') {
        mouvement.statutSecurite = 'validé';
      }
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
      const emails: string[] = [];
      for (const log of logisticiens) {
        if (log.email) emails.push(log.email);
      }
      if (emails.length > 0) {
        await this.mailService.sendTemplateEmail(
          'req_created',
          await savedMouvement.populate([
            { path: 'vehicule' },
            { path: 'stops.lieu' },
            { path: 'demandeur' },
          ]),
          emails,
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
      const emails: string[] = [];
      for (const valideur of valideursSecu) {
        if (valideur.email) emails.push(valideur.email);
      }
      if (emails.length > 0) {
        await this.mailService.sendTemplateEmail(
          'sec_request',
          await savedMouvement.populate([
            { path: 'vehicule' },
            { path: 'stops.lieu' },
            { path: 'demandeur' },
          ]) as any,
          emails,
        );
      }
    }

    return savedMouvement;
  }

  async update(
    id: string,
    updateDto: Record<string, unknown>,
  ): Promise<Mouvement> {
    const oldMouvement = await this.mouvementModel.findById(id).exec();
    
    if (oldMouvement) {
      let newStatutLogistique = updateDto.statutLogistique !== undefined ? updateDto.statutLogistique : oldMouvement.statutLogistique;
      let newStatutSecurite = updateDto.statutSecurite !== undefined ? updateDto.statutSecurite : oldMouvement.statutSecurite;
      
      // Implicit logistics validation when assigning vehicle & driver
      if (updateDto.vehicule && updateDto.chauffeur && updateDto.statutLogistique === undefined) {
          if (newStatutLogistique === 'en attente') {
              newStatutLogistique = 'validé';
              updateDto.statutLogistique = 'validé';
          }
      }

      const isPendingPhase = ['en attente', 'en attente validation logistique', 'en attente validation sécurité', 'validé'].includes(oldMouvement.statut);
      
      if (isPendingPhase && updateDto.statut === undefined) {
          if (newStatutLogistique === 'validé' && (newStatutSecurite === 'validé' || newStatutSecurite === 'non requis')) {
              updateDto.statut = 'validé';
          } else if (newStatutLogistique === 'validé' && newStatutSecurite === 'en attente') {
              updateDto.statut = 'en attente validation sécurité';
          } else if (newStatutLogistique === 'en attente' && (newStatutSecurite === 'validé' || newStatutSecurite === 'non requis')) {
              updateDto.statut = 'en attente validation logistique';
          } else if (newStatutLogistique === 'en attente' && newStatutSecurite === 'en attente') {
              updateDto.statut = 'en attente';
          }
      }
    }
    
    const updated = await this.mouvementModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate([{ path: 'demandeur' }, { path: 'vehicule' }, { path: 'stops.lieu' }])
      .exec();
    if (!updated) {
      throw new ConflictException('Mouvement non trouvé');
    }

    // Email Notifications on status change
    let emailError = false;
    try {
      if (oldMouvement && oldMouvement.statut !== updated.statut) {
         const demandeurEmail = (updated.demandeur as any)?.email;
         if (demandeurEmail) {
            if (updated.statut === 'validé') {
              await this.mailService.sendTemplateEmail('assigned', updated as any, [demandeurEmail]);
            } else if (updated.statut === 'refusé' || updated.statut === 'annulé') {
              await this.mailService.sendTemplateEmail('cancelled', updated as any, [demandeurEmail]);
            }
         }
      }
      
      if (oldMouvement && oldMouvement.statutLogistique !== updated.statutLogistique && updated.statutLogistique === 'validé') {
         // Logistique validée, on notifie la sécurité si requise
         if (updated.statutSecurite === 'en attente') {
            const validatorIds = updated.securityApprovals.map((a: any) => a.validator);
            const valideursSecu = await this.userModel.find({ _id: { $in: validatorIds } }).exec();
            const emails = valideursSecu.map(v => v.email).filter(e => e);
            if (emails.length > 0) {
               await this.mailService.sendTemplateEmail('log_validated', updated as any, emails);
            }
         }
      }
    } catch (e) {
      this.logger.error('Erreur lors de l\'envoi des emails de notification', e);
      emailError = true;
    }

    const result = updated.toObject();
    if (emailError) {
      (result as any).emailWarning = "L'envoi de l'e-mail de notification a échoué, mais l'action a bien été enregistrée.";
    }

    return result as Mouvement;
  }

  async validateSecurity(id: string, user: UserPayloadDto): Promise<Mouvement> {
    const mouvement = await this.mouvementModel.findById(id).exec();
    if (!mouvement) throw new ConflictException('Mouvement non trouvé');

    if (
      !mouvement.securityApprovals ||
      mouvement.securityApprovals.length === 0
    ) {
      return mouvement;
    }

    const securityApprovals = mouvement.securityApprovals as Array<{
      validator: { toString: () => string };
      status: string;
      approvalDate?: Date;
      isBackup?: boolean;
    }>;

    const userId = user._id || user.id;
    const userIdStr = userId.toString();
    const approvalIndex = securityApprovals.findIndex(
      (a) => a.validator.toString() === userIdStr,
    );

    if (approvalIndex === -1) {
      throw new ConflictException(
        "Vous n'êtes pas autorisé à valider ce mouvement",
      );
    }

    // Set this validator's status to approved
    securityApprovals[approvalIndex].status = 'approved';
    securityApprovals[approvalIndex].approvalDate = new Date();

    // Check if ALL primary validators have approved
    const allApproved = securityApprovals
      .filter((a) => !a.isBackup)
      .every((a) => a.status === 'approved');

    let oldStatut = mouvement.statut;

    if (allApproved) {
      mouvement.statutSecurite = 'validé';
      // If logistics is not required or already valid, set overall to validé
      if (
        mouvement.statutLogistique === 'non requis' ||
        mouvement.statutLogistique === 'validé'
      ) {
        mouvement.statut = 'validé';
      } else {
        mouvement.statut = 'en attente';
      }
    }

    const updated = await mouvement.save();

    const populatedMouvement = await this.mouvementModel.findById(updated._id).populate([{ path: 'demandeur' }, { path: 'vehicule' }, { path: 'stops.lieu' }]).exec();

    // Notifier le demandeur
    let emailError = false;
    try {
      const demandeurEmail = (populatedMouvement?.demandeur as any)?.email;
      if (demandeurEmail) {
         if (allApproved && mouvement.statutSecurite === 'validé') {
           await this.mailService.sendTemplateEmail('sec_validated', populatedMouvement as any, [demandeurEmail]);
         }
         if (oldStatut !== updated.statut && updated.statut === 'validé') {
           await this.mailService.sendTemplateEmail('assigned', populatedMouvement as any, [demandeurEmail]);
         }
      }
    } catch (e) {
      this.logger.error('Erreur lors de l\'envoi des emails de notification', e);
      emailError = true;
    }

    const result = updated.toObject();
    if (emailError) {
      (result as any).emailWarning = "L'envoi de l'e-mail de notification a échoué, mais l'action a bien été enregistrée.";
    }

    return result as Mouvement;
  }

  async revertSecurityToDraft(id: string): Promise<Mouvement> {
    const mouvement = await this.mouvementModel.findById(id).exec();
    if (!mouvement) throw new ConflictException('Mouvement non trouvé');

    mouvement.statutSecurite = 'en attente';
    if (mouvement.securityApprovals) {
      mouvement.securityApprovals.forEach((a: any) => {
        a.status = 'pending';
        a.approvalDate = undefined;
      });
    }

    if (mouvement.statutLogistique === 'en attente') {
      mouvement.statut = 'en attente';
    } else {
      mouvement.statut = 'en attente validation sécurité';
    }

    return mouvement.save();
  }

  async revertLogisticsToDraft(id: string): Promise<Mouvement> {
    const mouvement = await this.mouvementModel.findById(id).exec();
    if (!mouvement) throw new ConflictException('Mouvement non trouvé');

    mouvement.statutLogistique = 'en attente';
    mouvement.vehicule = undefined;
    mouvement.chauffeur = undefined;

    mouvement.statut = 'en attente';

    return mouvement.save();
  }

  async cleanGhosts(): Promise<{ message: string }> {
    const mouvementsGroupes = await this.mouvementModel
      .find({ statut: 'regroupé' })
      .populate('parentMouvement')
      .exec();
    const ghostsToDelete = mouvementsGroupes.filter(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (m: any) => !m.parentMouvement,
    );
    if (ghostsToDelete.length > 0) {
      const ids = ghostsToDelete.map((m) => m._id);
      await this.mouvementModel.deleteMany({ _id: { $in: ids } }).exec();
      return {
        message: `${ghostsToDelete.length} mouvements fantômes nettoyés.`,
      };
    }
    return { message: 'Aucun fantôme trouvé.' };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async fixCountries(): Promise<{ message: string }> {
    return { message: 'Not implemented' };
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async getSuggestions(_id: string): Promise<any[]> {
    return [];
  }

  async remove(id: string): Promise<Mouvement | null> {
    return this.mouvementModel.findByIdAndDelete(id).exec();
  }
}
