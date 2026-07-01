import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

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
          }
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
  async setSetting(@Param('key') key: string, @Body() body: any) {
    return this.settingsService.setSetting(key, body.value || body);
  }
}
