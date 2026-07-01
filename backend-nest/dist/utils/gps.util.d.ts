export declare function calculateGpsDistance(trace: {
    lat: number;
    lng: number;
}[]): number;
export declare function analyzeDeviations(gpsDistance: number, odometerDistance: number): Record<string, any>[];
