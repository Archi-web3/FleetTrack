import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChecklistTemplateDocument = ChecklistTemplate & Document;

@Schema({ timestamps: true })
export class ChecklistTemplate {
  @Prop({ required: true })
  nom: string;

  @Prop()
  nom_en: string;

  @Prop({
    enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C'],
    required: true,
  })
  type: string;

  @Prop({ default: 'Tous' })
  typeVehicule: string;

  @Prop({ default: 0, min: 0 })
  coutParDefaut: number;

  @Prop([
    {
      numero: String,
      categorie: {
        type: String,
        enum: [
          'Détection',
          'Moteur',
          'Roues/Pneus',
          'Pneus',
          'Batterie/Élec',
          'Électricité',
          'Éclairage',
          'Sécurité/Documents',
          'Sécurité',
          'Communication',
          'Nettoyage',
          'Finalisation',
          'Sous le Capot',
          'Extérieur',
          'Intérieur/Cabine',
          'Test Routier',
          'Autre',
        ],
      },
      description: { type: String, required: true },
      description_en: String,
      numeroTacheManuel: String,
      obligatoire: { type: Boolean, default: true },
    },
  ])
  taches: any[];

  @Prop({ default: true })
  actif: boolean;
}

export const ChecklistTemplateSchema =
  SchemaFactory.createForClass(ChecklistTemplate);
