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
        const subject = `[FleetTrack] Validation requise: Trajet vers ${getLastDestination(movement)}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #005FB6;">Validation de sécurité requise</h2>
                <p>Bonjour,</p>
                <p>Un nouveau mouvement nécessite votre validation car il implique des zones sensibles ou un niveau de risque élevé.</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Demandeur:</strong> ${movement.demandeur ? movement.demandeur.nom : 'Inconnu'}</p>
                    <p><strong>Véhicule:</strong> ${movement.vehicule ? (movement.vehicule.marque + ' ' + movement.vehicule.immatriculation) : 'Non assigné'}</p>
                    <p><strong>Départ:</strong> ${formatDate(movement.stops[0].dateDepart)}</p>
                    <p><strong>Destination:</strong> ${getLastDestination(movement)}</p>
                    <p><strong>Niveau de risque:</strong> <span style="color: red; font-weight: bold;">${movement.validationLevelRequired}</span></p>
                </div>

                <p>Veuillez vous connecter à l'application pour valider ou refuser ce mouvement.</p>
                
                <a href="${process.env.FRONTEND_URL || 'https://fleettrack-api.onrender.com'}/valider-mouvements" style="background-color: #005FB6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Accéder à la plateforme</a>
            </div>
        `;
        return sendEmail(to, subject, html);
    },

    /**
     * Sends a status update email to the requester
     */
    sendStatusUpdate: async (to, movement, status, reason = '') => {
        const color = status === 'validé' ? '#4caf50' : (status === 'refusé' ? '#f44336' : '#ff9800');
        const subject = `[FleetTrack] Votre mouvement est ${status.toUpperCase()}`;

        let reasonHtml = '';
        if (reason && status === 'refusé') {
            reasonHtml = `<p><strong>Motif du refus:</strong> <span style="color: #f44336;">${reason}</span></p>`;
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: ${color};">Votre mouvement a été ${status}</h2>
                <p>Bonjour ${movement.demandeur ? movement.demandeur.nom : ''},</p>
                <p>Le statut de votre demande de mouvement a changé.</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Départ:</strong> ${formatDate(movement.stops[0].dateDepart)}</p>
                    <p><strong>Destination:</strong> ${getLastDestination(movement)}</p>
                    <p><strong>Nouveau statut:</strong> <strong style="color: ${color};">${status.toUpperCase()}</strong></p>
                    ${reasonHtml}
                </div>

                <a href="${process.env.FRONTEND_URL || 'https://fleettrack-api.onrender.com'}/mes-mouvements" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Voir les détails</a>
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
    return new Date(date).toLocaleString('fr-FR');
}
