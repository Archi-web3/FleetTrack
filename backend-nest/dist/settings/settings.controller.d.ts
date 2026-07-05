import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSetting(key: string): Promise<{
        key: string;
        value: {
            primaryColor: string;
            heroDisplayMode: string;
            headerDisplayMode: string;
            appName: string;
            appTagline: string;
            short?: undefined;
            medium?: undefined;
            long?: undefined;
        };
    } | {
        key: string;
        value: {
            short: number;
            medium: number;
            long: number;
            primaryColor?: undefined;
            heroDisplayMode?: undefined;
            headerDisplayMode?: undefined;
            appName?: undefined;
            appTagline?: undefined;
        };
    } | {
        key: string;
        value: {
            primaryColor?: undefined;
            heroDisplayMode?: undefined;
            headerDisplayMode?: undefined;
            appName?: undefined;
            appTagline?: undefined;
            short?: undefined;
            medium?: undefined;
            long?: undefined;
        };
    }>;
    getSetting(key: string): Promise<{
        key: string;
        value: unknown;
    }>;
    setSetting(key: string, body: Record<string, unknown>): Promise<import("./schemas/setting.schema").Setting>;
}
