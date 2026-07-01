import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
export declare class SettingsService {
    private settingModel;
    private readonly logger;
    constructor(settingModel: Model<SettingDocument>);
    getSetting(key: string): Promise<any>;
    setSetting(key: string, value: any): Promise<Setting>;
}
