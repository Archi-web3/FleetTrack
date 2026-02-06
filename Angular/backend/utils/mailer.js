const nodemailer = require('nodemailer');

const isProduction = process.env.NODE_ENV === 'production';

// Configuration from environment variables
const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

// Check if SMTP is configured
const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

let transporter;

if (isSmtpConfigured) {
    console.log('📧 Maven configuration found. Initializing Nodemailer...');
    transporter = nodemailer.createTransport(smtpConfig);
} else {
    console.warn('⚠️ SMTP not configured (Missing SMTP_HOST or SMTP_USER). Using SIMULATION MODE (Logs only).');
    transporter = {
        sendMail: async (mailOptions) => {
            console.log('---------------------------------------------------');
            console.log('📧 [SIMULATION] Sending Email');
            console.log('---------------------------------------------------');
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Text: ${mailOptions.text}`);
            console.log(`HTML: ${mailOptions.html}`);
            console.log('---------------------------------------------------');
            return { messageId: 'simulation-' + Date.now() };
        }
    };
}

const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Fallback hardcodé si la variable d'env n'est pas définie
        const frontendUrl = process.env.FRONTEND_URL || 'https://fleettrack-api.onrender.com';

        const mailOptions = {
            from: process.env.SMTP_FROM || '"FleetTrack Notification" <no-reply@fleettrack.acf>',
            to: to,
            subject: subject,
            html: htmlContent,
            text: htmlContent.replace(/<[^>]*>?/gm, '') // Strip HTML for text fallback
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        // Don't throw error to avoid blocking the main flow
        return null;
    }
};

module.exports = {
    /**
     * Generic send mail
     */
    sendMail: sendEmail,

    /**
     * Sends a validation request email to supervisors/admins
     */
    sendValidationRequest: async (to, movement) => {
        const destination = getLastDestination(movement);
        const subject = `[FleetTrack] 🛡️ Validation Requise / Validation Required: ${destination}`;

        // Colors
        const riskColor = getRiskColor(movement.validationLevelRequired);
        const riskLabel = getRiskLabel(movement.validationLevelRequired);

        const folder = movement.projetsPassagers && movement.projetsPassagers.length > 0 ? movement.projetsPassagers.join(', ') : (movement.projet || 'N/A');

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <!-- Header -->
                <div style="background-color: #005FB6; padding: 20px; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">🛡️ Validation Sécurité / Security Validation</h2>
                    <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">FleetTrack Security Notification</p>
                </div>

                <!-- Content -->
                <div style="padding: 25px; background-color: #ffffff;">
                    <p>Bonjour,</p>
                    <p>Un nouveau mouvement nécessite votre validation. <br>
                    <em style="color: #666;">A new movement requires your approval.</em></p>
                    
                    <div style="background-color: #f8f9fa; border-left: 5px solid ${riskColor}; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666; width: 140px;"><strong>Niveau de Risque:</strong></td>
                                <td style="color: ${riskColor}; font-weight: bold;">⚠️ ${movement.validationLevelRequired} - ${riskLabel}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;"><strong>Demandeur:</strong></td>
                                <td>${movement.demandeur ? (movement.demandeur.prenom + ' ' + movement.demandeur.nom) : 'Inconnu'}</td>
                            </tr>
                             <tr>
                                <td style="padding: 5px 0; color: #666;"><strong>Objectif / Purpose:</strong></td>
                                <td>${movement.objectif || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;"><strong>Projet:</strong></td>
                                <td>${folder}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; color: #333; font-size: 16px;">Itinéraire / Itinerary</h3>
                        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; font-family: monospace;">
                            <div>🛫 <strong>Départ:</strong> ${formatDate(movement.stops[0].dateDepart)}</div>
                            <div style="padding-left: 25px; color: #005FB6;">${movement.stops[0].lieu ? movement.stops[0].lieu.nom : 'Unknown'}</div>
                            
                            ${movement.stops.length > 2 ? `<div style="padding: 5px 0 5px 25px;">⬇️ <em>${movement.stops.length - 2} étape(s) intermédiaire(s)</em></div>` : '<div style="padding: 5px 0 5px 25px;">⬇️</div>'}
                            
                            <div>🛬 <strong>Arrivée:</strong> ${formatDate(movement.stops[movement.stops.length - 1].dateArrivee)}</div>
                            <div style="padding-left: 25px; color: #005FB6;">${getLastDestination(movement)}</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; color: #333; font-size: 16px;">Véhicule & Passagers</h3>
                        <p><strong>🚙 Véhicule:</strong> ${movement.vehicule ? (movement.vehicule.marque + ' ' + movement.vehicule.modele + ' - ' + movement.vehicule.immatriculation) : '<em>Non encore assigné / Not assigned yet</em>'}</p>
                        <p><strong>👥 Passagers (${movement.passagers ? movement.passagers.length : 0}):</strong></p>
                        <ul style="color: #444; background: #fafafa; padding: 10px 10px 10px 30px; border-radius: 4px;">
                            ${movement.passagers && movement.passagers.length > 0
                ? movement.passagers.map(p => `<li>${p.prenom || ''} ${p.nom || p.email}</li>`).join('')
                : '<li>Aucun passager déclaré / No passengers</li>'}
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'https://fleettrack-api.onrender.com'}/validation" 
                           style="background-color: #005FB6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                           Accéder à la Validation / Go to Validation
                        </a>
                        <p style="margin-top: 10px; font-size: 12px; color: #888;">Connectez-vous pour valider ou refuser.<br>Login to approve or reject.</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    &copy; 2026 FleetTrack System. Tous droits réservés.
                </div>
            </div>
        `;
        return sendEmail(to, subject, html);
    },

    /**
     * Sends a status update email to the requester
     */
    sendStatusUpdate: async (to, movement, status, reason = '') => {
        const isRefused = status === 'refusé';
        const color = isRefused ? '#D32F2F' : '#2E7D32'; // Red vs Green
        const statusLabelFR = isRefused ? 'REFUSÉ' : 'VALIDÉ';
        const statusLabelEN = isRefused ? 'REJECTED' : 'APPROVED';

        const subject = `[FleetTrack] ℹ️ Votre mouvement est ${statusLabelFR} / Your trip is ${statusLabelEN}`;
        const destination = getLastDestination(movement);

        let reasonHtml = '';
        if (reason && isRefused) {
            reasonHtml = `
            <div style="background-color: #ffebee; border: 1px solid #ffcdd2; color: #b71c1c; padding: 10px; border-radius: 4px; margin-top: 10px;">
                <strong>Motif du refus / Reason:</strong><br>
                ${reason}
            </div>`;
        }

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <div style="background-color: ${color}; padding: 20px; color: white; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">${statusLabelFR}</h1>
                    <p style="margin: 5px 0 0;">${statusLabelEN}</p>
                </div>

                <!-- Content -->
                <div style="padding: 25px; background-color: #ffffff;">
                    <p>Bonjour ${movement.demandeur ? movement.demandeur.prenom : ''},</p>
                    
                    <p>Votre demande de mouvement vers <strong>${destination}</strong> a été mise à jour.</p>
                    
                    ${reasonHtml}

                    <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                        <h3 style="margin: 0 0 10px; color: #333;">Rappel du trajet / Trip Summary</h3>
                        <ul style="list-style: none; padding: 0; color: #555;">
                            <li style="margin-bottom: 8px;">📅 <strong>Départ:</strong> ${formatDate(movement.stops[0].dateDepart)}</li>
                            <li style="margin-bottom: 8px;">📍 <strong>Destination:</strong> ${destination}</li>
                            <li style="margin-bottom: 8px;">🎯 <strong>Objectif:</strong> ${movement.objectif || 'N/A'}</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 25px;">
                        <a href="${process.env.FRONTEND_URL || 'https://fleettrack-api.onrender.com'}/mes-mouvements" 
                           style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                           Voir ma demande / View my Request
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    &copy; 2026 FleetTrack System.
                </div>
            </div>
        `;
        return sendEmail(to, subject, html);
    }
};

// Helpers
function getLastDestination(movement) {
    if (movement.stops && movement.stops.length > 0) {
        const lastStop = movement.stops[movement.stops.length - 1];
        if (lastStop.lieu && lastStop.lieu.nom) {
            return lastStop.lieu.nom;
        }
    }
    return 'Destination inconnue';
}

function formatDate(date) {
    if (!date) return 'N/A';
    // Format français propre avec heure
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function getRiskColor(level) {
    if (!level) return '#757575';
    if (level === 1) return '#2E7D32'; // Stable (Green)
    if (level === 2) return '#FBC02D'; // Moderate (Yellow/Orange)
    if (level === 3) return '#F57C00'; // Difficult (Orange)
    if (level === 4) return '#D32F2F'; // High (Red)
    if (level >= 5) return '#D32F2F'; // Extreme (Red/Black)
    return '#757575';
}

function getRiskLabel(level) {
    if (!level) return 'Inconnu';
    if (level === 1) return 'Stable';
    if (level === 2) return 'Modéré / Moderate';
    if (level === 3) return 'Difficile / Difficult';
    if (level === 4) return 'Élevé / High';
    if (level >= 5) return 'Extrême / Extreme';
    return 'Inconnu';
}
