import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
export interface AuthRequest extends Request {
    user: UserPayloadDto;
}
export declare class AnalyticsQueryDto {
    dateDebut?: string;
    dateFin?: string;
    projet?: string;
    vehicule?: string;
    startDate?: string;
    endDate?: string;
    vehicleId?: string;
}
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getGlobalStats(query: AnalyticsQueryDto, req: AuthRequest): Promise<{
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
    getStatsByProject(query: AnalyticsQueryDto, req: AuthRequest): Promise<{
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
    getTCO(query: AnalyticsQueryDto, req: AuthRequest): Promise<{
        totalCost: number;
        breakdown: {
            fuel: number;
            maintenance: number;
            incidents: number;
            fixed: number;
        };
        vehicleCount: number;
    }>;
    getCostForecast(months: number, req: AuthRequest): Promise<{
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
