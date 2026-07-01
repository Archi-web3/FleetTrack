import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type GenerateurLogbookDocument = GenerateurLogbook & Document;

@Schema({ timestamps: true })
export class GenerateurLogbook {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Generateur',
    required: true,
  })
  generateur: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  })
  utilisateur: string;

  @Prop({ required: true })
  dateReleve: Date;

  @Prop({ required: true })
  heureDebut: number;

  @Prop({ required: true })
  heureFin: number;

  @Prop({ default: 0 })
  carburantAjoute: number;

  @Prop()
  observations: string;
}

export const GenerateurLogbookSchema =
  SchemaFactory.createForClass(GenerateurLogbook);

GenerateurLogbookSchema.virtual('dureeSession').get(function (
  this: GenerateurLogbookDocument,
) {
  return this.heureFin - this.heureDebut;
});

GenerateurLogbookSchema.virtual('consommationLpH').get(function (
  this: GenerateurLogbookDocument,
) {
  const duree = this.heureFin - this.heureDebut;
  if (duree > 0 && this.carburantAjoute > 0) {
    return this.carburantAjoute / duree;
  }
  return 0;
});
