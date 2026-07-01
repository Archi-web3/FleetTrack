import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mouvement, MouvementDocument } from './schemas/mouvement.schema';

@Injectable()
export class MouvementsConflictService {
  constructor(
    @InjectModel(Mouvement.name)
    private mouvementModel: Model<MouvementDocument>,
  ) {}

  /**
   * Vérifie les conflits pour un chauffeur.
   */
  async checkDriverConflict(
    chauffeurId: string,
    dateDepart: Date,
    dateArrivee: Date,
    excludeMouvementId: string | null = null,
  ): Promise<MouvementDocument | null> {
    if (!chauffeurId || !dateDepart || !dateArrivee) return null;

    const query: Record<string, any> = {
      chauffeur: chauffeurId,
      statut: {
        $in: [
          'en attente',
          'en attente validation sécurité',
          'validé',
          'pris en charge',
          'en cours',
        ],
      },
      dateDepart: { $lt: dateArrivee },
      dateArrivee: { $gt: dateDepart },
    };

    if (excludeMouvementId) {
      query._id = { $ne: excludeMouvementId };
    }

    return this.mouvementModel
      .findOne(query)
      .populate('stops.lieu')
      .populate('demandeur', 'nom prenom')
      .exec();
  }

  /**
   * Vérifie les conflits pour un véhicule.
   */
  async checkVehicleConflict(
    vehiculeId: string,
    dateDepart: Date,
    dateArrivee: Date,
    excludeMouvementId: string | null = null,
  ): Promise<MouvementDocument | null> {
    if (!vehiculeId || !dateDepart || !dateArrivee) return null;

    const query: Record<string, any> = {
      vehicule: vehiculeId,
      statut: {
        $in: [
          'en attente',
          'en attente validation sécurité',
          'validé',
          'pris en charge',
          'en cours',
        ],
      },
      dateDepart: { $lt: dateArrivee },
      dateArrivee: { $gt: dateDepart },
    };

    if (excludeMouvementId) {
      query._id = { $ne: excludeMouvementId };
    }

    return this.mouvementModel
      .findOne(query)
      .populate('stops.lieu')
      .populate('demandeur', 'nom prenom')
      .exec();
  }
}
