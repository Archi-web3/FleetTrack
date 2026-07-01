/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MaintenanceConfig,
  MaintenanceConfigDocument,
} from './schemas/maintenance-config.schema';
import {
  ChecklistTemplate,
  ChecklistTemplateDocument,
} from './schemas/checklist-template.schema';
import {
  ServiceSchedule,
  ServiceScheduleDocument,
} from './schemas/service-schedule.schema';
import {
  WeeklyChecklist,
  WeeklyChecklistDocument,
} from './schemas/weekly-checklist.schema';
import { Maintenance, MaintenanceDocument } from './schemas/maintenance.schema';
import {
  Vehicule,
  VehiculeDocument,
} from '../vehicles/schemas/vehicule.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    @InjectModel(MaintenanceConfig.name)
    private configModel: Model<MaintenanceConfigDocument>,
    @InjectModel(ChecklistTemplate.name)
    private templateModel: Model<ChecklistTemplateDocument>,
    @InjectModel(ServiceSchedule.name)
    private scheduleModel: Model<ServiceScheduleDocument>,
    @InjectModel(WeeklyChecklist.name)
    private weeklyModel: Model<WeeklyChecklistDocument>,
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
    @InjectModel(Vehicule.name) private vehiculeModel: Model<VehiculeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ============================================
  // STATS (y compris coutMoyen implémenté)
  // ============================================
  async getStats(): Promise<{
    totalVehicules: number;
    servicesDus: number;
    checklistsRetard: number;
    coutMoyen: number;
  }> {
    const totalVehicules = await this.vehiculeModel.countDocuments({
      enService: true,
    });
    const servicesDus = await this.scheduleModel.countDocuments({
      statut: { $in: ['Dû', 'En retard'] },
    });

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const annee = now.getFullYear();

    const checklistsCompletees = await this.weeklyModel.countDocuments({
      semaine,
      annee,
      completee: true,
    });
    const checklistsRetard = Math.max(0, totalVehicules - checklistsCompletees);

    // Calcul du coût moyen de maintenance global (historique complet par défaut)
    const allMaintenances = await this.maintenanceModel
      .find({ cost: { $exists: true, $gt: 0 } })
      .exec();
    let totalCost = 0;
    allMaintenances.forEach((m) => (totalCost += m.cost));

    // Pour l'instant on fait la moyenne globale sur les véhicules actifs. On pourrait filtrer sur l'année.
    const coutMoyen =
      totalVehicules > 0
        ? parseFloat((totalCost / totalVehicules).toFixed(2))
        : 0;

    return { totalVehicules, servicesDus, checklistsRetard, coutMoyen };
  }

  // ============================================
  // WEEKLY CHECKLISTS
  // ============================================
  async getCurrentWeeklyChecklist(
    vehiculeId: string,
    userId: string,
  ): Promise<WeeklyChecklist> {
    if (!vehiculeId) throw new NotFoundException('Véhicule requis');

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const annee = now.getFullYear();

    let checklist = await this.weeklyModel
      .findOne({ vehicule: vehiculeId, semaine, annee })
      .populate('vehicule chauffeur')
      .exec();

    if (!checklist) {
      const template = await this.templateModel
        .findOne({ type: 'Hebdomadaire', actif: true })
        .exec();
      if (!template)
        throw new NotFoundException('Template checklist non trouvé');

      checklist = new this.weeklyModel({
        vehicule: vehiculeId,
        semaine,
        annee,
        chauffeur: userId,
        taches: template.taches.map((t) => ({
          numero: t.numero,
          categorie: t.categorie,
          description: t.description,
          numeroTacheManuel: t.numeroTacheManuel,
          validee: false,
        })),
        completee: false,
        tauxCompletion: 0,
      });

      await checklist.save();
      checklist = await this.weeklyModel
        .findById(checklist._id)
        .populate('vehicule chauffeur')
        .exec();
    }

    return checklist;
  }

  async validateWeeklyTask(
    checklistId: string,
    tacheId: string,
    validee: boolean,
    commentaire: string,
  ): Promise<WeeklyChecklist> {
    const checklist = await this.weeklyModel.findById(checklistId);
    if (!checklist) throw new NotFoundException('Checklist non trouvée');

    const tache = (checklist.taches as any).id(tacheId);
    if (!tache) throw new NotFoundException('Tâche non trouvée');

    tache.validee = validee;
    tache.dateValidation = validee ? new Date() : null;
    if (commentaire) tache.commentaire = commentaire;

    const totalTaches = checklist.taches.length;
    const tachesValidees = checklist.taches.filter((t) => t.validee).length;
    checklist.tauxCompletion = Math.round((tachesValidees / totalTaches) * 100);
    checklist.completee = checklist.tauxCompletion === 100;

    if (checklist.completee && !checklist.dateCompletion) {
      checklist.dateCompletion = new Date();
    } else if (!checklist.completee) {
      checklist.dateCompletion = null;
    }

    await checklist.save();
    return checklist;
  }

  // ============================================
  // SERVICE SCHEDULES
  // ============================================
  async getNextService(vehiculeId: string): Promise<ServiceSchedule> {
    if (!vehiculeId) throw new NotFoundException('Véhicule requis');

    const vehicule = await this.vehiculeModel.findById(vehiculeId);
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    let service = await this.scheduleModel
      .findOne({ vehicule: vehiculeId, statut: { $ne: 'Complété' } })
      .sort({ kilometragePrevu: 1 })
      .exec();

    if (!service) {
      const config = await this.configModel
        .findOne({ typeVehicule: vehicule.type || 'Land Cruiser', actif: true })
        .exec();
      const intervalleService = config ? config.intervalleService : 5000;

      service = new this.scheduleModel({
        vehicule: vehiculeId,
        typeService: 'A',
        kilometragePrevu: intervalleService,
        kilometrageActuel: vehicule.kilometrage || 0,
        statut: 'À venir',
        prochainService: { type: 'B', kilometrage: intervalleService * 2 },
      });
    }

    const kmActuel = vehicule.kilometrage || 0;
    service.kilometrageActuel = kmActuel;

    if (kmActuel >= service.kilometragePrevu + 200)
      service.statut = 'En retard';
    else if (kmActuel >= service.kilometragePrevu) service.statut = 'Dû';
    else if (kmActuel >= service.kilometragePrevu - 500) {
      service.statut = 'À venir';
      if (!service.dateAlerte) service.dateAlerte = new Date();
    }

    await service.save();
    return service;
  }

  async completeService(
    serviceId: string,
    signature: string,
    userId: string,
  ): Promise<ServiceSchedule> {
    const user = await this.userModel.findById(userId);
    if (
      !user ||
      !['Superviseur', 'Admin', 'SuperAdmin'].includes(user.profil)
    ) {
      throw new ForbiddenException(
        'Seuls les superviseurs peuvent valider les services',
      );
    }

    const service = await this.scheduleModel
      .findById(serviceId)
      .populate('vehicule')
      .exec();
    if (!service) throw new NotFoundException('Service non trouvé');

    service.statut = 'Complété';
    service.dateCompletion = new Date();
    service.signature = {
      superviseur: user._id,
      date: new Date(),
      signatureData: signature,
    };

    const vehicule =
      service.vehicule as unknown as import('../vehicles/schemas/vehicule.schema').VehiculeDocument;
    const config = await this.configModel
      .findOne({ typeVehicule: vehicule.type || 'Land Cruiser', actif: true })
      .exec();
    const intervalleService = config ? config.intervalleService : 5000;

    let prochainType = 'A';
    if (
      config &&
      config.sequenceMode === 'Custom' &&
      config.customSequence &&
      config.customSequence.length > 0
    ) {
      const totalCompleted = await this.scheduleModel.countDocuments({
        vehicule: vehicule._id,
        statut: 'Complété',
      });
      prochainType =
        config.customSequence[totalCompleted % config.customSequence.length];
    } else {
      switch (service.typeService) {
        case 'A': {
          const lastC = await this.scheduleModel
            .findOne({
              vehicule: vehicule._id,
              typeService: 'C',
              statut: 'Complété',
            })
            .sort({ dateCompletion: -1 });
          const servicesDepuisC = await this.scheduleModel.countDocuments({
            vehicule: vehicule._id,
            statut: 'Complété',
            dateCompletion: { $gt: lastC ? lastC.dateCompletion : new Date(0) },
          });
          prochainType = servicesDepuisC >= 3 ? 'C' : 'B';
          break;
        }
        case 'B':
        case 'C':
          prochainType = 'A';
          break;
      }
    }

    await service.save();

    const prochainKm = service.kilometragePrevu + intervalleService;
    await this.scheduleModel.create({
      vehicule: vehicule._id,
      typeService: prochainType,
      kilometragePrevu: prochainKm,
      kilometrageActuel: service.kilometrageActuel,
      statut: 'À venir',
    });

    return service;
  }
}
