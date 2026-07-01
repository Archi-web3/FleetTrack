import { Model } from 'mongoose';
import { VehiculeDocument } from '../vehicles/schemas/vehicule.schema';
import { FuelDocument } from '../logbook/schemas/fuel.schema';
import { MaintenanceDocument } from '../maintenance/schemas/maintenance.schema';
import { IncidentDocument } from '../logbook/schemas/incident.schema';
import { MouvementDocument } from '../mouvements/schemas/mouvement.schema';
import { SettingsService } from '../settings/settings.service';
export declare class AnalyticsService {
    private vehiculeModel;
    private fuelModel;
    private maintenanceModel;
    private incidentModel;
    private mouvementModel;
    private settingsService;
    private readonly logger;
    constructor(vehiculeModel: Model<VehiculeDocument>, fuelModel: Model<FuelDocument>, maintenanceModel: Model<MaintenanceDocument>, incidentModel: Model<IncidentDocument>, mouvementModel: Model<MouvementDocument>, settingsService: SettingsService);
    getGlobalStats(filters: {
        dateDebut?: string;
        dateFin?: string;
        projet?: string;
        vehicule?: string;
        countryId?: string;
    }): Promise<{
        kmTotaux: number;
        co2Total: number;
        co2Flotte: number;
        co2Aerien: number;
        consommationTotale: number;
        nombreMouvements: number;
        repartitionModes: {
            routier: number;
            aerien: number;
            maritime: number;
        };
        indicateursAvances: {
            trajetsCourts: {
                count: number;
                pourcentage: number;
            };
            kmMutualises: {
                km: number;
                pourcentage: number;
            };
            tauxUtilisation: number;
        };
    }>;
    getStatsByProject(filters: {
        dateDebut?: string;
        dateFin?: string;
        vehicule?: string;
        projet?: string;
        countryId?: string;
    }): Promise<{
        global: {
            kmTotaux: number;
            co2Total: number;
            consommationTotale: number;
        };
        parProjet: {
            projet: string;
            kmTotaux: number;
            kmInvolved: number;
            co2Total: number;
            consommationTotale: number;
            nombreMouvements: number;
            ratioKm: number;
            ratioCO2: number;
            ratioConsommation: number;
            tauxRemplissageMoyen: number;
        }[];
    }>;
    calculateTCO(filters: {
        startDate?: string;
        endDate?: string;
        vehicleId?: string;
        country?: string;
    }): Promise<{
        totalCost: number;
        breakdown: {
            fuel: number;
            maintenance: number;
            incidents: number;
            fixed: number;
        };
        vehicleCount: number;
    }>;
    predictCosts(countryId: string, months?: number): Promise<{
        predictedTotal: number;
        confidence: string;
        trend: string;
        details: {
            scheduledServices: number;
            unscheduledBuffer: number;
            durationMonths: number;
            vehicleCount: number;
        };
    }>;
}
