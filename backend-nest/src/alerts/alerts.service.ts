import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
  ) {}

  async createAlert(data: any, userId: string): Promise<Alert> {
    const alert = new this.alertModel({
      ...data,
      createdBy: userId,
    });
    return alert.save();
  }

  async getAllAlerts(): Promise<Alert[]> {
    return this.alertModel
      .find()
      .populate('createdBy', 'nom prenom')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAlertsForVehicle(vehicleId: string): Promise<Alert[]> {
    if (!vehicleId) return [];

    return this.alertModel
      .find({
        active: true,
        $or: [
          { targetType: 'all' },
          { targetType: 'vehicle', targetVehicleId: vehicleId },
        ],
        'deletedBy.vehicleId': { $ne: vehicleId },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(
    alertId: string,
    vehicleId: string,
    userName: string,
  ): Promise<Alert> {
    const alert = await this.alertModel.findById(alertId);
    if (!alert) throw new NotFoundException('Alerte non trouvée');

    const alreadyRead = alert.readBy.some((r) => r.vehicleId === vehicleId);
    if (!alreadyRead) {
      alert.readBy.push({ vehicleId, readAt: new Date(), user: userName });
      await alert.save();
    }
    return alert;
  }

  async hideAlert(alertId: string, vehicleId: string): Promise<Alert> {
    const alert = await this.alertModel.findById(alertId);
    if (!alert) throw new NotFoundException('Alerte non trouvée');

    const alreadyHidden = alert.deletedBy.some(
      (d) => d.vehicleId === vehicleId,
    );
    if (!alreadyHidden) {
      alert.deletedBy.push({ vehicleId, deletedAt: new Date() });
      await alert.save();
    }
    return alert;
  }

  async deleteAlert(id: string): Promise<void> {
    const result = await this.alertModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Alerte non trouvée');
  }
}
