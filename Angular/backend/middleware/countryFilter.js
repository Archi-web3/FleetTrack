/**
 * Middleware de filtrage automatique par pays
 * 
 * Ce middleware garantit que chaque utilisateur ne voit que les données de son pays,
 * sauf pour les SuperAdmins qui peuvent voir tous les pays.
 * 
 * Usage:
 *   router.get('/', auth(), countryFilter, async (req, res) => {
 *     const filter = { ...req.countryFilter, otherFilters };
 *     const data = await Model.find(filter);
 *   });
 */

const countryFilter = (req, res, next) => {
    console.log('🌍 [countryFilter] Vérification filtrage pays');
    console.log('🌍 [countryFilter] User:', req.user?.nom, '- Profil:', req.user?.profil);
    console.log('🌍 [countryFilter] Pays sélectionné:', req.selectedCountry);

    // SuperAdmin : Aucun filtre (peut voir tous les pays)
    if (req.user?.profil === 'SuperAdmin') {
        req.countryFilter = {};
        console.log('✅ [countryFilter] SuperAdmin détecté - Pas de filtre pays');
        return next();
    }

    // Utilisateurs normaux : Filtre obligatoire par pays
    if (req.selectedCountry) {
        req.countryFilter = { pays: req.selectedCountry };
        console.log('✅ [countryFilter] Filtre pays appliqué:', req.countryFilter);
        return next();
    }

    // Pas de pays sélectionné = accès refusé
    console.log('❌ [countryFilter] Aucun pays sélectionné - Accès refusé');
    return res.status(403).json({
        message: 'Sélection de pays requise. Veuillez sélectionner un pays dans les paramètres.'
    });
};

module.exports = countryFilter;
