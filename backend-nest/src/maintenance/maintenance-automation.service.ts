import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceSchedule,
  ServiceScheduleDocument,
} from '../service-schedule/schemas/service-schedule.schema';
import {
  ChecklistTemplate,
  ChecklistTemplateDocument,
} from '../checklist-templates/schemas/checklist-template.schema';
import {
  Vehicule,
  VehiculeDocument,
} from '../vehicles/schemas/vehicule.schema';

@Injectable()
export class MaintenanceAutomationService {
  private readonly logger = new Logger(MaintenanceAutomationService.name);

  constructor(
    @InjectModel(ServiceSchedule.name)
    private serviceScheduleModel: Model<ServiceScheduleDocument>,
    @InjectModel(ChecklistTemplate.name)
    private checklistTemplateModel: Model<ChecklistTemplateDocument>,
    @InjectModel(Vehicule.name) private vehiculeModel: Model<VehiculeDocument>,
  ) {}

  async generateServiceSchedules(
    vehiculeId: string,
    currentKm: number,
  ): Promise<ServiceScheduleDocument[]> {
    try {
      const vehicule = await this.vehiculeModel.findById(vehiculeId);
      if (!vehicule) {
        throw new Error('Véhicule non trouvé');
      }

      // Default interval, as MaintenanceConfig is not fully ported yet
      const serviceInterval = 5000;
      const initialKm = vehicule.kilometrageInitial || 0;

      this.logger.log(
        `[MAINTENANCE-AUTO] Génération services pour ${vehicule.immatriculation}`,
      );
      this.logger.log(
        ` - Km initial: ${initialKm}, Km actuel: ${currentKm}, Intervalle: ${serviceInterval} km`,
      );

      if (initialKm > 0) {
        const deleted = await this.serviceScheduleModel.deleteMany({
          vehicule: vehiculeId,
          kilometragePrevu: { $lt: initialKm },
          statut: { $ne: 'Complété' },
        });
        if (deleted.deletedCount > 0) {
          this.logger.log(
            ` Nettoyage: ${deleted.deletedCount} service(s) obsolètes supprimés (< ${initialKm} km)`,
          );
        }
      }

      const existingServices = await this.serviceScheduleModel
        .find({ vehicule: vehiculeId })
        .sort({ kilometragePrevu: 1 });
      const requiredServices = this.calculateServiceIntervals(
        initialKm,
        currentKm,
        serviceInterval,
      );

      const createdServices: ServiceScheduleDocument[] = [];
      for (const requiredService of requiredServices) {
        const exists = existingServices.find(
          (s) =>
            s.kilometragePrevu === requiredService.km &&
            s.typeService === requiredService.type,
        );

        if (!exists) {
          this.logger.log(
            ` Création: Service ${requiredService.type} à ${requiredService.km} km`,
          );

          let taches: {
            description: string;
            numeroTacheManuel?: string;
            categorie?: string;
            validee: boolean;
            dateValidation: Date | null;
            commentaire: string;
          }[] = [];
          try {
            const template = await this.checklistTemplateModel.findOne({
              type: `Service ${requiredService.type}`,
              actif: true,
            });

            if (template && template.taches && template.taches.length > 0) {
              taches = template.taches.map((t: Record<string, any>) => ({
                description: t.description as string,
                numeroTacheManuel: (t.numeroTacheManuel as string) || undefined,
                categorie: (t.categorie as string) || undefined,
                validee: false,
                dateValidation: null,
                commentaire: '',
              }));
            }
          } catch (templateError) {
            this.logger.error(
              ` Erreur chargement template: ${(templateError as Error).message}`,
            );
          }

          const newService = await this.serviceScheduleModel.create({
            vehicule: vehiculeId,
            typeService: requiredService.type,
            kilometragePrevu: requiredService.km,
            kilometrageActuel: currentKm,
            statut: this.determineStatut(currentKm, requiredService.km),
            taches: taches,
          });
          createdServices.push(newService);
        }
      }

      return createdServices;
    } catch (error) {
      this.logger.error('Erreur génération services:', error);
      throw error;
    }
  }

  private calculateServiceIntervals(
    initialKm: number,
    currentKm: number,
    interval: number,
  ): { type: string; km: number }[] {
    const services: { type: string; km: number }[] = [];
    const milestones = [50000, 100000];

    let nextServiceKm = Math.ceil(initialKm / interval) * interval;
    if (nextServiceKm <= initialKm) nextServiceKm += interval;

    let serviceCounter = 0;
    while (nextServiceKm <= currentKm + interval) {
      const isMilestone = milestones.includes(nextServiceKm);

      if (isMilestone) {
        const milestoneType = nextServiceKm === 50000 ? '50K' : '100K';
        services.push({ type: milestoneType, km: nextServiceKm });
      } else {
        const serviceType = this.getNextServiceType(serviceCounter, interval);
        services.push({ type: serviceType, km: nextServiceKm });
      }

      serviceCounter++;
      nextServiceKm += interval;
    }

    return services;
  }

  private getNextServiceType(counter: number, interval: number): string {
    const kmValue = (counter + 1) * interval;
    if (kmValue % 50000 === 0 || kmValue % 100000 === 0) return 'A';
    if ((counter + 1) % 8 === 0) return 'C';
    if ((counter + 1) % 4 === 0) return 'B';
    return 'A';
  }

  private determineStatut(currentKm: number, serviceKm: number): string {
    const diff = serviceKm - currentKm;
    if (diff > 500) return 'À venir';
    if (diff >= -200) return 'Dû';
    return 'En retard';
  }

  async updateServiceStatuses(
    vehiculeId: string,
    currentKm: number,
  ): Promise<number> {
    const services = await this.serviceScheduleModel.find({
      vehicule: vehiculeId,
      statut: { $ne: 'Complété' },
    });

    let updated = 0;
    for (const service of services) {
      const newStatut = this.determineStatut(
        currentKm,
        service.kilometragePrevu,
      );
      if (service.statut !== newStatut) {
        service.statut = newStatut;
        service.kilometrageActuel = currentKm;
        await service.save();
        updated++;
      }
    }
    return updated;
  }
}
