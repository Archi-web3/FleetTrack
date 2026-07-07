import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
export declare class SettingsService {
    private settingModel;
    private readonly logger;
    constructor(settingModel: Model<SettingDocument>);
    getSetting(key: string): Promise<unknown>;
    setSetting(key: string, value: unknown): Promise<Setting>;
}
