const cron = require('node-cron');
const Vehicule = require('../models/vehicule.model');
const ServiceSchedule = require('../models/service-schedule.model');
const MaintenanceConfig = require('../models/maintenance-config.model');
const Utilisateur = require('../models/utilisateur.model');
const mailer = require('../utils/mailer');
const Base = require('../models/base.model');

// Run every day at 08:00 AM
const startMaintenanceCron = () => {
    console.log('⏰ Maintenance Cron Scheduled (08:00 Daily)');

    // cron.schedule('0 8 * * *', async () => { // Production
    cron.schedule('0 8 * * *', async () => {
        console.log('🔄 [CRON] Running Maintenance Check...');
        try {
            await checkAndNotifyMaintenance();
        } catch (error) {
            console.error('❌ [CRON] Error during maintenance check:', error);
        }
    });
};

const checkAndNotifyMaintenance = async () => {
    // 1. Fetch all active vehicles and populate Base
    const vehicules = await Vehicule.find({ enService: true }).populate('base');
    const maintenanceConfigs = await MaintenanceConfig.find({ actif: true });

    // Store alerts by Base ID
    const alertsByBase = {}; // { baseId: [ { vehicule, status, ecartKm } ] }

    // 2. Calculate Status for each vehicle
    for (const vehicule of vehicules) {
        if (!vehicule.base) continue; // Skip if no base assigned

        // Config Retrieval
        const config = maintenanceConfigs.find(c => c.typeVehicule === vehicule.type);
        const intervalle = config ? config.intervalleService : 5000;

        // Fetch Schedule Logic (Simplified from maintenance-tracking endpoint)
        let ecartKm = null;
        let statusCode = 'ok';

        // Prochain service planifié
        const prochainService = await ServiceSchedule.findOne({
            vehicule: vehicule._id,
            statut: { $ne: 'Complété' }
        }).sort({ kilometragePrevu: 1 });

        // Dernier service complété
        const dernierService = await ServiceSchedule.findOne({
            vehicule: vehicule._id,
            statut: 'Complété'
        }).sort({ dateCompletion: -1 });

        if (prochainService) {
            ecartKm = prochainService.kilometragePrevu - vehicule.kilometrage;
        } else if (dernierService) {
            ecartKm = (dernierService.kilometragePrevu + intervalle) - vehicule.kilometrage;
        } else {
            ecartKm = ((vehicule.kilometrageInitial || 0) + intervalle) - vehicule.kilometrage;
        }

        // Check Status
        if (ecartKm < 0) statusCode = 'retard';
        else if (ecartKm < 500) statusCode = 'proche';

        // 3. Collect Alerts
        if (statusCode === 'retard' || statusCode === 'proche') {
            const baseId = vehicule.base._id.toString();
            if (!alertsByBase[baseId]) {
                alertsByBase[baseId] = {
                    baseName: vehicule.base.nom,
                    alerts: []
                };
            }
            alertsByBase[baseId].alerts.push({
                immatriculation: vehicule.immatriculation,
                modele: `${vehicule.marque} ${vehicule.modele}`,
                status: statusCode,
                ecart: ecartKm
            });
        }
    }

    // 4. Send Emails per Base
    for (const baseId in alertsByBase) {
        const baseData = alertsByBase[baseId];

        // Find Supervisors for this Base
        const supervisors = await Utilisateur.find({
            profil: 'Superviseur',
            base: baseId
        });

        if (supervisors.length > 0) {
            console.log(`📧 Sending maintenance summary for Base ${baseData.baseName} to ${supervisors.length} supervisors.`);

            // Build HTML
            const rows = baseData.alerts.map(a => {
                const color = a.status === 'retard' ? '#f44336' : '#ff9800'; // Red or Orange
                const statusText = a.status === 'retard' ? 'EN RETARD' : 'PROCHE';
                return `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${a.immatriculation}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${a.modele}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; color: ${color}; font-weight: bold;">${statusText}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${Math.abs(a.ecart)} km ${a.ecart < 0 ? 'de dépassement' : 'restants'}</td>
                    </tr>
                `;
            }).join('');

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #005FB6;">Rapport Quotidien de Maintenance</h2>
                    <p>Bonjour,</p>
                    <p>Voici la liste des véhicules nécessitant une attention particulière sur la base <strong>${baseData.baseName}</strong> :</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Immatriculation</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Modèle</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Statut</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Détail</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>

                    <p style="margin-top: 20px;">Veuillez planifier les entretiens nécessaires.</p>
                    <p style="font-size: 12px; color: #888;">Ceci est un message automatique de FleetTrack.</p>
                </div>
            `;

            // Send to each supervisor
            for (const sup of supervisors) {
                if (sup.email) {
                    await mailer.sendMail(sup.email, `[FleetTrack] Alerte Maintenance - Base ${baseData.baseName}`, htmlContent);
                }
            }
        }
    }
};

// Export the function to start it
module.exports = startMaintenanceCron;
