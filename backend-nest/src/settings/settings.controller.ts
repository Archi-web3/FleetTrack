import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public/debug-email-keys')
  async debugEmailKeys() {
    const baseId = "6937ff5290074e68ade3c07b";
    const emailSettings = await this.settingsService.getSetting(`emailSettings_base_${baseId}`) as any[];
    const template = emailSettings?.find((t) => t.id === 'req_created');
    
    return {
      foundArray: !!emailSettings,
      arrayLength: emailSettings ? emailSettings.length : 0,
      foundTemplate: !!template,
      templateData: template || null
    };
  }

  @Get('public/:key')
  async getPublicSetting(@Param('key') key: string) {
    const value = await this.settingsService.getSetting(key);
    // If setting does not exist, return an empty object for brandSettings and co2Factors
    if (!value) {
      if (key === 'brandSettings') {
        return {
          key,
          value: {
            primaryColor: '#8b5cf6',
            heroDisplayMode: 'both',
            headerDisplayMode: 'both',
            appName: 'FleetTrack',
            appTagline: 'Gestion de flotte',
          },
        };
      }
      if (key === 'co2Factors') {
        return { key, value: { short: 150, medium: 120, long: 100 } };
      }
      return { key, value: {} };
    }
    return { key, value };
  }

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    const value = await this.settingsService.getSetting(key);

    return { key, value: value || {} };
  }

  @Post(':key')
  async setSetting(
    @Param('key') key: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.settingsService.setSetting(key, body.value || body);
  }
}
