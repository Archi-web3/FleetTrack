import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WeeklyChecklistDocument = WeeklyChecklist & Document;

@Schema()
export class WeeklyTask {
  @Prop()
  numero: string;

  @Prop()
  categorie: string;

  @Prop()
  description: string;

  @Prop()
  numeroTacheManuel: string;

  @Prop({ default: false })
  validee: boolean;

  @Prop()
  dateValidation: Date;

  @Prop()
  commentaire: string;
}

const WeeklyTaskSchema = SchemaFactory.createForClass(WeeklyTask);

@Schema({ timestamps: true })
export class WeeklyChecklist {
  @Prop({ type: Types.ObjectId, ref: 'Vehicule', required: true })
  vehicule: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 53 })
  semaine: number;

  @Prop({ required: true })
  annee: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  chauffeur: Types.ObjectId;

  @Prop({ type: [WeeklyTaskSchema] })
  taches: WeeklyTask[];

  @Prop({ default: false })
  completee: boolean;

  @Prop({ default: 0, min: 0, max: 100 })
  tauxCompletion: number;

  @Prop({ default: Date.now })
  dateCreation: Date;

  @Prop()
  dateCompletion: Date;
}

export const WeeklyChecklistSchema =
  SchemaFactory.createForClass(WeeklyChecklist);
WeeklyChecklistSchema.index({ vehicule: 1, semaine: 1, annee: 1 });
WeeklyChecklistSchema.index({ chauffeur: 1, completee: 1 });
