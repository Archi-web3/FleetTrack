import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityConfig, SecurityConfigDocument } from '../mouvements/schemas/security-config.schema';

@Injectable()
export class SecurityConfigService {
  constructor(
    @InjectModel(SecurityConfig.name) private securityConfigModel: Model<SecurityConfigDocument>
  ) {}

  async getConfig(paysId: string, baseId: string | null): Promise<SecurityConfigDocument> {
    if (!paysId) {
      throw new Error('PaysId est requis');
    }

    const query: Record<string, unknown> = { pays: paysId };
    if (baseId && baseId !== 'null') {
      query['base'] = baseId;
    } else {
      query['base'] = null;
    }

    let config = await this.securityConfigModel.findOne(query).exec();
    if (!config) {
      // Return a structured empty object matching the schema instead of null
      return { pays: paysId as any, base: (baseId !== 'null' ? baseId : null) as any, rules: [] } as SecurityConfigDocument;
    }
    return config;
  }

  async saveConfig(paysId: string, baseId: string | null, data: Record<string, unknown>, userId: string): Promise<SecurityConfigDocument> {
    if (!paysId) {
      throw new Error('PaysId est requis');
    }

    const query: Record<string, unknown> = { pays: paysId };
    if (baseId && baseId !== 'null') {
      query['base'] = baseId;
    } else {
      query['base'] = null;
    }

    const updateData: Record<string, unknown> = {
      ...data,
      pays: paysId,
      updatedBy: userId,
    };
    
    if (baseId && baseId !== 'null') {
        updateData['base'] = baseId;
    } else {
        updateData['base'] = null;
    }

    const config = await this.securityConfigModel.findOneAndUpdate(
      query,
      updateData,
      { new: true, upsert: true }
    ).exec();

    return config;
  }
}
