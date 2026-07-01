import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Generateur, GenerateurDocument } from './schemas/generateur.schema';
import {
  GenerateurLogbook,
  GenerateurLogbookDocument,
} from '../logbook/schemas/logbook.schema';

@Injectable()
export class GenerateursService {
  constructor(
    @InjectModel(Generateur.name)
    private generateurModel: Model<GenerateurDocument>,
    @InjectModel(GenerateurLogbook.name)
    private logbookModel: Model<GenerateurLogbookDocument>,
  ) {}

  async findAll(): Promise<Generateur[]> {
    return this.generateurModel
      .find()
      .populate('base', 'nom')
      .populate('pays', 'nom')
      .exec();
  }

  async findById(id: string): Promise<GenerateurDocument | null> {
    return this.generateurModel
      .findById(id)
      .populate('base', 'nom')
      .populate('pays', 'nom')
      .exec();
  }

  async create(createGenerateurDto: any): Promise<Generateur> {
    const generateur = new this.generateurModel(createGenerateurDto);
    return generateur.save();
  }

  async update(
    id: string,
    updateGenerateurDto: import('mongoose').UpdateQuery<GenerateurDocument>,
  ): Promise<Generateur> {
    const generateur = await this.generateurModel
      .findByIdAndUpdate(id, updateGenerateurDto, { new: true })
      .exec();
    if (!generateur) {
      throw new NotFoundException('Générateur introuvable');
    }
    return generateur;
  }

  async delete(id: string): Promise<Generateur> {
    const generateur = await this.generateurModel.findByIdAndDelete(id).exec();
    if (!generateur) {
      throw new NotFoundException('Générateur introuvable');
    }
    return generateur;
  }

  // --- LOGBOOK LOGIC ---
  async getLogbooks(generateurId: string): Promise<GenerateurLogbook[]> {
    return this.logbookModel
      .find({ generateur: generateurId })
      .populate('utilisateur', 'nom prenom')
      .sort({ dateReleve: -1 })
      .exec();
  }

  async addLogbookEntry(
    generateurId: string,
    logbookDto: Record<string, any>,
    user: import('../mouvements/dto/mouvements.dto').UserPayloadDto,
  ): Promise<GenerateurLogbook> {
    const gen = await this.generateurModel.findById(generateurId).exec();
    if (!gen) {
      throw new NotFoundException('Générateur introuvable');
    }

    logbookDto.generateur = gen._id;
    logbookDto.utilisateur = user._id || user.id;

    const log = new this.logbookModel(logbookDto);
    const savedLog = await log.save();

    if (log.heureFin > gen.heuresFonctionnement) {
      gen.heuresFonctionnement = log.heureFin;
    }

    const duree = log.heureFin - log.heureDebut;
    if (duree > 0 && log.carburantAjoute > 0) {
      const lph = log.carburantAjoute / duree;
      if (gen.consommationTheorique === 0) {
        gen.consommationTheorique = lph;
      } else {
        gen.consommationTheorique = (gen.consommationTheorique + lph) / 2;
      }
    }

    await gen.save();
    return savedLog;
  }

  // --- MAINTENANCE PREDICTION ---
  async getMaintenanceOverview(): Promise<any[]> {
    const generateurs = await this.generateurModel.find().exec();

    return generateurs.map((gen) => {
      const h = gen.heuresFonctionnement;
      let prochainService = 250;
      if (h >= 250 && h < 500) prochainService = 500;
      else if (h >= 500 && h < 1000) prochainService = 1000;
      else if (h >= 1000 && h < 3000) prochainService = 3000;
      else prochainService = Math.ceil((h + 1) / 250) * 250;

      const heuresRestantes = prochainService - h;

      return {
        _id: gen._id,
        marque: gen.marque,
        modele: gen.modele,
        numeroSerie: gen.numeroSerie,
        heuresActuelles: h,
        prochainService: prochainService,
        heuresRestantes: heuresRestantes,
        statut:
          heuresRestantes <= 0
            ? 'En retard'
            : heuresRestantes <= 50
              ? 'Dû bientôt'
              : 'À jour',
      };
    });
  }
}
