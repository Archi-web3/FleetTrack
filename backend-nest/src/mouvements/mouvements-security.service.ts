import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SecurityConfig,
  SecurityConfigDocument,
} from './schemas/security-config.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MouvementsSecurityService {
  private readonly logger = new Logger(MouvementsSecurityService.name);

  constructor(
    @InjectModel(SecurityConfig.name)
    private securityConfigModel: Model<SecurityConfigDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Calcule les validateurs requis en fonction du niveau de sécurité, du pays et de la base.
   */
  async calculateValidators(
    paysId: string,
    baseId: string | null,
    maxSecurityLevel: number,
  ): Promise<{ mode: string; validators: any[] }> {
    if (maxSecurityLevel === 0) {
      return { mode: 'none', validators: [] };
    }

    try {
      let config = await this.securityConfigModel
        .findOne({ pays: paysId, base: baseId })
        .exec();
      let allValidators: string[] = [];

      const extractValidators = (cfg: SecurityConfigDocument | null) => {
        const vals: string[] = [];
        if (cfg && cfg.rules) {
          const rule = cfg.rules.find((r) => r.level === maxSecurityLevel);
          if (
            rule &&
            rule.mandatoryValidators &&
            rule.mandatoryValidators.length > 0
          ) {
            vals.push(...rule.mandatoryValidators.map((id) => id.toString()));

            if (rule.includeLowerLevels) {
              for (let i = 1; i < maxSecurityLevel; i++) {
                const lowerRule = cfg.rules.find((r) => r.level === i);
                if (lowerRule && lowerRule.mandatoryValidators) {
                  vals.push(
                    ...lowerRule.mandatoryValidators.map((id) => id.toString()),
                  );
                }
              }
            }
          }
        }
        return vals;
      };

      allValidators = extractValidators(config);

      // Si aucune règle spécifique à la base, fallback sur la règle du Pays (base: null)
      if (allValidators.length === 0 && baseId) {
        config = await this.securityConfigModel
          .findOne({ pays: paysId, base: null })
          .exec();
        allValidators = extractValidators(config);
      }

      // Deduplication
      allValidators = [...new Set(allValidators)];

      if (allValidators.length > 0) {
        this.logger.log(
          `🛡️ Using matrix validators for level ${maxSecurityLevel}`,
        );
        return {
          mode: 'matrix',
          validators: allValidators.map((uid) => ({
            validator: new Types.ObjectId(uid),
            status: 'pending',
            isBackup: false,
          })),
        };
      } else {
        // FALLBACK : S'il n'y a pas de matrice, on prend les utilisateurs ayant le bon niveau de validation
        this.logger.warn(
          `⚠️ FALLBACK TRIGGERED! No valid matrix config found for level ${maxSecurityLevel} and pays ${paysId}`,
        );
        const validatorsToNotify = await this.userModel
          .find({
            niveauValidationSecu: { $gte: maxSecurityLevel },
            pays: paysId,
          })
          .exec();

        return {
          mode: 'fallback',
          validators: validatorsToNotify.map((u) => ({
            validator: u._id,
            status: 'pending',
            isBackup: Number(u.niveauValidationSecu) > maxSecurityLevel,
          })),
        };
      }
    } catch (e) {
      const err = e as Error;
      this.logger.error(
        '❌ Erreur lors du calcul des validateurs sécurité:',
        err.stack,
      );
      return { mode: 'error', validators: [] };
    }
  }
}
