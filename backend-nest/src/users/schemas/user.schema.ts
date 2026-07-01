import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class Utilisateur {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  motDePasse: string;

  // Ancien profil conservé temporairement pour la rétrocompatibilité
  @Prop({
    enum: [
      'SuperAdmin',
      'Admin',
      'Superviseur',
      'Superviseur Sécurité',
      'Logisticien',
      'Technicien',
      'Guest',
      'Chauffeur',
    ],
    default: 'Technicien',
  })
  profil: string;

  // NOUVEAU: Référence dynamique au rôle avec les habilitations
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pays' })
  pays: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Base' })
  base: string;

  @Prop()
  numeroEmploye: string;

  @Prop({ enum: [1, 2, 3, 4, 5], default: 1 })
  niveauValidationSecu: number;

  @Prop({ default: true })
  autoManageSecurity: boolean;

  // Chauffeurs
  @Prop()
  prenom: string;

  @Prop()
  telephone: string;

  @Prop()
  permis: string;

  @Prop({ default: true })
  disponible: boolean;

  @Prop({ type: Object })
  formationEcoConduite: {
    effectuee?: boolean;
    date?: Date;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicule' })
  vehiculeAttitre: string;

  @Prop([
    {
      nom: String,
      url: String,
      dateAjout: { type: Date, default: Date.now },
      typeSource: { type: String, enum: ['Upload', 'Lien'], default: 'Upload' },
    },
  ])
  documents: any[];

  @Prop({ default: 'Support', trim: true })
  projet: string;
}

export const UtilisateurSchema = SchemaFactory.createForClass(Utilisateur);

// Hook pour hacher le mot de passe avant sauvegarde
UtilisateurSchema.pre(
  'save',
  async function (next: (err?: import('mongoose').CallbackError) => void) {
    if (this.isModified('motDePasse')) {
      const salt = await bcrypt.genSalt(10);
      this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    }
    next();
  },
);

// Méthode de comparaison
UtilisateurSchema.methods.comparePassword = async function (
  this: import('mongoose').HydratedDocument<Utilisateur>,
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

export type UtilisateurDocument = HydratedDocument<Utilisateur>;
export type UserDocument = UtilisateurDocument;
export { Utilisateur as User, UtilisateurSchema as UserSchema };
