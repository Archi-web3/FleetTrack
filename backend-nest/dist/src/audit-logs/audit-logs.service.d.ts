import { Model } from 'mongoose';
import { Request } from 'express';
import { AuditLogDocument } from './schemas/audit-log.schema';
import type { AuthRequest } from '../analytics/analytics.controller';
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
export declare class AuditLogsService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    logAction(req: AuthRequest | Request, action: string, category: string, target?: string, details?: Record<string, unknown>): Promise<void>;
}
