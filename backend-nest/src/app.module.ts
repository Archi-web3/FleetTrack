import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SecurityConfigModule } from './security-config/security-config.module';
import { PaysModule } from './pays/pays.module';
import { BasesModule } from './bases/bases.module';
import { LieuxModule } from './lieux/lieux.module';
import { ProjetsModule } from './projets/projets.module';
import { ChauffeursModule } from './chauffeurs/chauffeurs.module';
import { GenerateursModule } from './generateurs/generateurs.module';
import { MouvementsModule } from './mouvements/mouvements.module';
import { LogbookModule } from './logbook/logbook.module';
import { FuelModule } from './fuel/fuel.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ServiceScheduleModule } from './service-schedule/service-schedule.module';
import { WaiversModule } from './waivers/waivers.module';
import { ChecklistTemplatesModule } from './checklist-templates/checklist-templates.module';
import { EnvironmentModule } from './environment/environment.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UtilsModule } from './utils/utils.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Use the .env from the root of backend-nest
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    VehiclesModule,
    AuthModule,
    UsersModule,
    RolesModule,
    SecurityConfigModule,
    PaysModule,
    BasesModule,
    LieuxModule,
    ProjetsModule,
    ChauffeursModule,
    GenerateursModule,
    SettingsModule,
    NotificationsModule,
    MouvementsModule,
    LogbookModule,
    FuelModule,
    MaintenanceModule,
    ServiceScheduleModule,
    WaiversModule,
    ChecklistTemplatesModule,
    EnvironmentModule,
    SettingsModule,
    AnalyticsModule,
    UtilsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
