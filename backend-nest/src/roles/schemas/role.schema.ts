import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  // Tableau de strings représentant les habilitations (ex: 'CREATE_VEHICLE', 'VALIDATE_MOUVEMENT')
  @Prop([String])
  permissions: string[];

  // Booléen pour indiquer si ce rôle ne peut pas être supprimé (rôles système de base)
  @Prop({ default: false })
  isSystemRole: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
