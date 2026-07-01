import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type GenerateurDocument = Generateur & Document;

@Schema({ timestamps: true })
export class Generateur {
  @Prop({ required: true })
  marque: string;

  @Prop({ required: true })
  modele: string;

  @Prop({ required: true })
  puissanceKVA: number;

  @Prop({ required: true, unique: true })
  numeroSerie: string;

  @Prop()
  numeroMoteur: string;

  @Prop()
  acfCode: string;

  @Prop()
  categorie: string;

  @Prop()
  proprietaire: string;

  @Prop({ enum: ['Diesel', 'Essence', 'Autre'], default: 'Diesel' })
  typeCarburant: string;

  @Prop()
  anneeFabrication: number;

  @Prop()
  anneePremiereUtilisation: number;

  @Prop()
  coutAssuranceAnnuel: number;

  @Prop()
  dateCommencement: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base', required: true })
  base: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop()
  siteInstallation: string;

  @Prop({
    enum: ['Actif', 'En maintenance', 'En panne', 'Hors service'],
    default: 'Actif',
  })
  statut: string;

  @Prop({ default: 0 })
  heuresInitiales: number;

  @Prop({ default: 0 })
  heuresFonctionnement: number;

  @Prop({ default: 0 })
  consommationTheorique: number;

  @Prop()
  dateAcquisition: Date;

  @Prop()
  valeurAchat: number;

  @Prop()
  notes: string;

  @Prop()
  remarques: string;
}

export const GenerateurSchema = SchemaFactory.createForClass(Generateur);
