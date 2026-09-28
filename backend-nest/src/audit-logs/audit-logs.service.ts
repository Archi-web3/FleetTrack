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

function getReferenceId(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || value === null) return undefined;

  const reference = value as {
    _id?: unknown;
    id?: unknown;
    toString: () => string;
  };
  const nestedId = reference._id ?? reference.id;
  if (nestedId !== undefined && nestedId !== value) {
    return getReferenceId(nestedId);
  }
  return reference.toString();
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
          const paysValue = user.pays as unknown;
          const pays = Array.isArray(paysValue) ? (paysValue[0] as unknown) : paysValue;
          logEntry.pays = getReferenceId(pays);
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

  async getLogs(
    limit = 50,
    category?: string,
    pays?: string,
  ): Promise<AuditLog[]> {
    const query: { category?: string; pays?: string } = {};
    if (category) {
      query.category = category;
    }
    if (pays && pays !== 'all') {
      query.pays = pays;
    }

    return this.auditLogModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('pays', 'nom')
      .exec();
  }

  async clearLogs(): Promise<void> {
    await this.auditLogModel.deleteMany({});
  }
}
