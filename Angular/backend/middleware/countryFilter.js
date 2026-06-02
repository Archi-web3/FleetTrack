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
    console.log('🌍 [countryFilter] User:', req.utilisateur?.nom, '- Profil:', req.utilisateur?.profil);
    console.log('🌍 [countryFilter] Pays sélectionné:', req.selectedCountry);

    if (req.utilisateur?.profil === 'SuperAdmin') {
        if (req.selectedCountry) {
            if (req.selectedCountry === 'all') {
                // "Tous" -> Pas de filtre (Vue Globale)
                req.countryFilter = {};
                console.log('✅ [countryFilter] SuperAdmin selection "Tous" - Vue Globale');
            } else if (req.selectedCountry === 'none') {
                // "Aucun" -> Items sans pays
                req.countryFilter = { $or: [{ pays: null }, { pays: { $exists: false } }] };
                console.log('✅ [countryFilter] SuperAdmin selection "Aucun" - Filtre items sans pays');
            } else {
                // Pays spécifique
                req.countryFilter = { pays: req.selectedCountry };
                console.log('✅ [countryFilter] SuperAdmin avec pays sélectionné - Filtre appliqué:', req.countryFilter);
            }
        } else {
            // Sinon, il voit tout (Comportement par défaut "Vue Globale" si rien n'est sélectionné)
            req.countryFilter = {};
            console.log('✅ [countryFilter] SuperAdmin SANS pays sélectionné - Pas de filtre pays (Vue Globale)');
        }
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
