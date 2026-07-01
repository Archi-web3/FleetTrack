import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fuel, FuelDocument } from './schemas/fuel.schema';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import {
  Mouvement,
  MouvementDocument,
} from '../mouvements/schemas/mouvement.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Maintenance,
  MaintenanceDocument,
} from '../maintenance/schemas/maintenance.schema';

@Injectable()
export class LogbookService {
  private readonly logger = new Logger(LogbookService.name);

  constructor(
    @InjectModel(Fuel.name) private fuelModel: Model<FuelDocument>,
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    @InjectModel(Mouvement.name)
    private mouvementModel: Model<MouvementDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
  ) {}

  async getMyTrips(userId: string): Promise<Mouvement[]> {
    const user = await this.userModel.findById(userId);
    if (!user || user.profil !== 'Chauffeur') {
      return [];
    }

    return this.mouvementModel
      .find({
        chauffeur: userId,
        statut: { $in: ['validé', 'pris en charge', 'en cours', 'terminé'] },
      })
      .populate('vehicule')
      .populate('chauffeur')
      .populate('passagers')
      .populate('stops.lieu')
      .sort({ dateDepart: 1 })
      .exec();
  }

  async takeCharge(mouvementId: string, userId: string): Promise<Mouvement> {
    const user = await this.userModel.findById(userId);
    if (!user || user.profil !== 'Chauffeur') {
      throw new ForbiddenException('User is not a driver');
    }

    const movement = await this.mouvementModel.findById(mouvementId);
    if (!movement) {
      throw new NotFoundException('Movement not found');
    }

    if (movement.chauffeur.toString() !== userId) {
      throw new ForbiddenException('This movement is not assigned to you');
    }

    if (movement.statut !== 'validé') {
      throw new BadRequestException(
        'Movement must be validated to take charge',
      );
    }

    movement.statut = 'pris en charge';
    movement.takenInChargeAt = new Date();
    movement.takenInChargeBy = user._id.toString();

    await movement.save();
    return this.mouvementModel
      .findById(movement._id)
      .populate('vehicule chauffeur passagers stops.lieu')
      .exec();
  }
}
