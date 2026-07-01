import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChecklistTemplateDocument = ChecklistTemplate & Document;

@Schema()
export class ChecklistTask {
  @Prop()
  numero: string;

  @Prop({
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
  })
  categorie: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  description_en: string;

  @Prop()
  numeroTacheManuel: string;

  @Prop({ default: true })
  obligatoire: boolean;
}

const ChecklistTaskSchema = SchemaFactory.createForClass(ChecklistTask);

@Schema({ timestamps: true })
export class ChecklistTemplate {
  @Prop({ required: true })
  nom: string;

  @Prop()
  nom_en: string;

  @Prop({
    required: true,
    enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C'],
  })
  type: string;

  @Prop({ default: 'Tous' })
  typeVehicule: string;

  @Prop({ default: 0, min: 0 })
  coutParDefaut: number;

  @Prop({ type: [ChecklistTaskSchema] })
  taches: ChecklistTask[];

  @Prop({ default: true })
  actif: boolean;
}

export const ChecklistTemplateSchema =
  SchemaFactory.createForClass(ChecklistTemplate);
