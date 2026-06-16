const express = require('express');
const router = express.Router();
const SecurityConfig = require('../models/security-config.model');
const Mouvement = require('../models/mouvement.model');
const Utilisateur = require('../models/utilisateur.model');
const auth = require('../middleware/authMiddleware');

// === GET CONFIG ===
// Récupérer la config pour le pays
router.get('/security-config', auth(), async (req, res) => {
    try {
        const pays = req.selectedCountry || req.utilisateur.pays;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Chercher la config du pays
        let config = await SecurityConfig.findOne({ pays: pays })
            .populate('rules.mandatoryValidators', 'nom prenom email');

        if (!config) {
            // Aucune config trouvée, on retourne un objet vide ou des valeurs par défaut
            return res.json({ pays, rules: [] });
        }

        res.json(config);
    } catch (err) {
        console.error('Erreur GET security-config:', err);
        res.status(500).json({ message: err.message });
    }
});

// === UPDATE / CREATE CONFIG ===
// La gestion des droits est faite côté front, mais on limite au moins aux profils élevés
router.post('/security-config', auth(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const pays = req.selectedCountry || req.utilisateur.pays;
        const { rules } = req.body;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Upsert (Mise à jour ou Création)
        // La matrice est maintenant uniquement au niveau pays.
        const filter = { pays: pays };
        const update = {
            pays: pays,
            rules: rules,
            updatedAt: new Date(),
            updatedBy: req.utilisateur.id
        };

        const config = await SecurityConfig.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, // Crée si n'existe pas
            setDefaultsOnInsert: true
        });

        // --- RETROACTIVE UPDATE OF PENDING MOVEMENTS ---
        // Après avoir sauvé la nouvelle config, on met à jour tous les mouvements 
        // "en attente de sécurité" de ce pays pour qu'ils respectent la nouvelle matrice.
        try {
            const pendingMouvements = await Mouvement.find({ 
                pays: pays, 
                statutSecurite: 'en attente' 
            });

            for (let mouvement of pendingMouvements) {
                let maxSecurityLevel = mouvement.validationLevelRequired;
                if (!maxSecurityLevel || maxSecurityLevel < 1) continue;

                let allValidators = [];
                const rule = rules.find(r => r.level === maxSecurityLevel);
                if (rule) {
                    if (rule.mandatoryValidators) {
                        allValidators.push(...rule.mandatoryValidators.map(id => id.toString()));
                    }
                    if (rule.includeLowerLevels) {
                        for (let i = 1; i < maxSecurityLevel; i++) {
                            const lowerRule = rules.find(r => r.level === i);
                            if (lowerRule && lowerRule.mandatoryValidators) {
                                allValidators.push(...lowerRule.mandatoryValidators.map(id => id.toString()));
                            }
                        }
                    }
                }

                allValidators = [...new Set(allValidators)]; // Deduplicate

                if (allValidators.length > 0) {
                    // Pour ne pas écraser les approbations déjà faites, on préserve les statuts existants
                    const oldApprovals = mouvement.securityApprovals || [];
                    mouvement.securityApprovals = allValidators.map(uid => {
                        const existing = oldApprovals.find(a => a.validator && a.validator.toString() === uid);
                        return { 
                            validator: uid, 
                            status: existing ? existing.status : 'pending',
                            approvedAt: existing ? existing.approvedAt : null,
                            comment: existing ? existing.comment : null
                        };
                    });
                } else {
                    // Fallback
                    const validatorsToNotify = await Utilisateur.find({
                        profil: 'Superviseur Sécurité',
                        niveauValidationSecu: { $gte: maxSecurityLevel },
                        pays: pays
                    });
                    
                    const oldApprovals = mouvement.securityApprovals || [];
                    mouvement.securityApprovals = validatorsToNotify.map(u => {
                        const uid = u._id.toString();
                        const existing = oldApprovals.find(a => a.validator && a.validator.toString() === uid);
                        return { 
                            validator: uid, 
                            status: existing ? existing.status : 'pending',
                            approvedAt: existing ? existing.approvedAt : null,
                            comment: existing ? existing.comment : null
                        };
                    });
                }

                await mouvement.save();
                console.log(`[SECURITY-CONFIG] Updated pending validators for movement ${mouvement._id}`);
            }
        } catch (updateErr) {
            console.error('❌ Erreur lors de la mise à jour rétroactive des mouvements en attente:', updateErr);
            // On ne bloque pas la réponse si la mise à jour rétroactive échoue
        }
        // --- FIN RETROACTIVE UPDATE ---

        res.json(config);
    } catch (err) {
        console.error('Erreur POST security-config:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
