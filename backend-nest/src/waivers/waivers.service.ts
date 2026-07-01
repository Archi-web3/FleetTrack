import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Waiver, WaiverDocument } from './schemas/waiver.schema';
import { UploadsService } from '../uploads/uploads.service';
import { CreateWaiverDto } from './dto/waivers.dto';

@Injectable()
export class WaiversService {
  constructor(
    @InjectModel(Waiver.name) private waiverModel: Model<WaiverDocument>,
    private uploadsService: UploadsService,
  ) {}

  async createWaiver(
    data: CreateWaiverDto,
    file?: Express.Multer.File,
  ): Promise<Waiver> {
    let signatureUrl = data.signatureUrl;

    if (file) {
      const publicId = `waiver_${Date.now()}`;
      const result = (await this.uploadsService.uploadImage(
        file,
        'fleettrack/waivers',
        publicId,
      )) as Record<string, any>;
      signatureUrl = result.secure_url as string;
    }

    const waiver = new this.waiverModel({
      visitorName: data.visitorName,
      signatureUrl: signatureUrl,
      vehicleId: data.vehicleId,
      tripId: data.tripId,
      legalTextVersion: data.legalTextVersion || 'v1.0',
    });

    return waiver.save();
  }

  async getAllWaivers(): Promise<Waiver[]> {
    return this.waiverModel
      .find()
      .populate('vehicleId', 'immatriculation marque modele')
      .populate('tripId', 'dateDepart statut')
      .sort({ signedAt: -1 })
      .exec();
  }

  async deleteWaiver(id: string): Promise<void> {
    const waiver = await this.waiverModel.findById(id);
    if (!waiver) throw new NotFoundException('Waiver non trouvé');

    // On pourrait optionnellement supprimer l'image Cloudinary ici en extrayant le publicId de signatureUrl
    await this.waiverModel.findByIdAndDelete(id);
  }
}
