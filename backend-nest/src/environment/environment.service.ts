/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EnvironmentAction,
  EnvironmentActionDocument,
} from './schemas/environment-action.schema';
import {
  EnvironmentData,
  EnvironmentDataDocument,
} from './schemas/environment-data.schema';
import { Fuel, FuelDocument } from '../logbook/schemas/fuel.schema';
import {
  Mouvement,
  MouvementDocument,
} from '../mouvements/schemas/mouvement.schema';

@Injectable()
export class EnvironmentService {
  private readonly logger = new Logger(EnvironmentService.name);

  constructor(
    @InjectModel(EnvironmentAction.name)
    private actionModel: Model<EnvironmentActionDocument>,
    @InjectModel(EnvironmentData.name)
    private dataModel: Model<EnvironmentDataDocument>,
    @InjectModel(Fuel.name) private fuelModel: Model<FuelDocument>,
    @InjectModel(Mouvement.name)
    private mouvementModel: Model<MouvementDocument>,
  ) {}

  // ==========================
  // ACTIONS (Roadmap CO2)
  // ==========================
  async getActions(year: number, base: string): Promise<EnvironmentAction[]> {
    return this.actionModel.find({ year, base }).exec();
  }

  async createAction(data: Record<string, any>): Promise<EnvironmentAction> {
    const action = new this.actionModel(data);
    return action.save();
  }

  async updateAction(
    id: string,
    data: import('mongoose').UpdateQuery<EnvironmentActionDocument>,
  ): Promise<EnvironmentAction> {
    const updated = await this.actionModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Action non trouvée');
    return updated;
  }

  async deleteAction(id: string): Promise<void> {
    await this.actionModel.findByIdAndDelete(id);
  }

  // ==========================
  // DATA (Monthly Stats)
  // ==========================
  async getData(year: number, base: string): Promise<EnvironmentData[]> {
    return this.dataModel.find({ year, base }).sort({ month: 1 }).exec();
  }

  async upsertData(data: Partial<EnvironmentData>): Promise<EnvironmentData> {
    const { year, month, base } = data;
    return this.dataModel.findOneAndUpdate({ year, month, base }, data, {
      new: true,
      upsert: true,
    });
  }

  // ==========================
  // AUTOMATION (Aggregation)
  // ==========================
  async aggregateStats(
    year: number,
    month: number,
    _base: string,
  ): Promise<{
    fleet_liters_total: number;
    fleet_km_total: number;
    driver_nb_projects: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const fuelStats = await this.fuelModel.aggregate<{ totalLiters: number }>([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalLiters: { $sum: '$quantity' } } },
    ]);

    const kmStats = await this.mouvementModel.aggregate<{ totalKm: number }>([
      {
        $match: {
          dateDepart: { $gte: startDate, $lte: endDate },
          statut: { $in: ['terminé', 'validé'] },
        },
      },
      {
        $group: {
          _id: null,
          totalKm: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$startMileage', null] },
                    { $ne: ['$endMileage', null] },
                  ],
                },
                { $subtract: ['$endMileage', '$startMileage'] },
                0,
              ],
            },
          },
          nbMissions: { $sum: 1 },
        },
      },
    ]);

    return {
      fleet_liters_total: fuelStats[0]?.totalLiters || 0,
      fleet_km_total: kmStats[0]?.totalKm || 0,
      driver_nb_projects: 0, // Simplification for now, would require checking Utilisateurs/Projets
    };
  }
}
