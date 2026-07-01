import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getSetting(key: string): Promise<any> {
    const setting = await this.settingModel.findOne({ key }).exec();
    return setting ? setting.value : null;
  }

  async setSetting(key: string, value: any): Promise<Setting> {
    const setting = await this.settingModel
      .findOneAndUpdate({ key }, { value }, { new: true, upsert: true })
      .exec();
    return setting;
  }
}
