const mongoose = require('mongoose');

const environmentDataSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12
    base: { type: String, required: true },

    // --- A. FLOTTE ---
    fleet_km_total: { type: Number, default: 0 },
    fleet_liters_total: { type: Number, default: 0 },
    fleet_liters_ac: { type: Number, default: 0 }, // Véhicules ACF
    fleet_liters_loc: { type: Number, default: 0 }, // Véhicules Location
    fleet_usage_admin_percent: { type: Number, default: 0 }, // % Admin vs Prog

    // --- B. ENERGIE (Générateurs + Réseau) ---
    energy_gen_hours: { type: Number, default: 0 },
    energy_gen_liters: { type: Number, default: 0 },
    energy_grid_kwh: { type: Number, default: 0 },

    // --- C. DRIVERS ACTIVITE (Pour IAP) ---
    driver_nb_projects: { type: Number, default: 0 },
    driver_nb_sites: { type: Number, default: 0 },
    driver_staff_fte: { type: Number, default: 0 }, // Staff Terrain
    driver_financial_volume: { type: Number, default: 0 }, // Volume Financier
    driver_km_passengers: { type: Number, default: 0 },
    driver_km_cargo: { type: Number, default: 0 },
    driver_tonnage: { type: Number, default: 0 },

    // --- CALCULATED METRICS (Snapshot) ---
    metrics_iap_score: { type: Number, default: 0 }, // Indice calculé
    metrics_co2_total: { type: Number, default: 0 }, // tCO2e
    metrics_co2_per_iap: { type: Number, default: 0 }, // L'indicateur clé (-5%)
    metrics_fleet_l100: { type: Number, default: 0 },
    metrics_gen_lh: { type: Number, default: 0 }

}, { timestamps: true });

// Index unique pour éviter doublons par mois/base
environmentDataSchema.index({ year: 1, month: 1, base: 1 }, { unique: true });

module.exports = mongoose.model('EnvironmentData', environmentDataSchema);
