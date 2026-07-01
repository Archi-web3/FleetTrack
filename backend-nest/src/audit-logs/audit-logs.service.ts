/* eslint-disable @typescript-eslint/no-base-to-string */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import type { AuthRequest } from '../analytics/analytics.controller';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

export interface AuditLogPayload {
  action: string;
  category: string;
  target?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  ip?: string;
  actor?: {
    userId: string;
    nom: string;
    role: string;
  };
  pays?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async logAction(
    req: AuthRequest | Request,
    action: string,
    category: string,
    target?: string,
    details?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const logEntry: AuditLogPayload = {
        action,
        category,
        target,
        details,
        timestamp: new Date(),
      };

      if (req) {
        const reqObj = req as Request & {
          connection?: { remoteAddress?: string };
          utilisateur?: UserPayloadDto;
        };
        logEntry.ip = reqObj.ip || reqObj.connection?.remoteAddress;

        // Either req contains the full user or req.utilisateur contains it (depends on context)
        const user = (req as AuthRequest).user || reqObj.utilisateur;
        if (user) {
          let safeRole = 'Unknown';
          if (typeof user.role === 'object' && user.role !== null) {
            safeRole = String(
              (user.role as { name?: string }).name || 'Unknown',
            );
          } else if (user.role) {
            safeRole = String(user.role);
          } else if (user.profil) {
            safeRole = String(user.profil);
          }
          logEntry.actor = {
            userId: String(user._id || user.id || 'Unknown'),
            nom: String(user.nom || 'Unknown'),
            role: safeRole,
          };
          if (user.pays) {
            // Handle populated or direct ObjectId
            logEntry.pays =
              typeof user.pays === 'object' && user.pays !== null
                ? (user.pays as { _id?: string })._id
                : user.pays;
          }
        }
      }

      const newLog = new this.auditLogModel(logEntry);
      await newLog.save();
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement de l'audit:",
        err as Error,
      );
    }
  }
}
