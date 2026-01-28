import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FunctionalTreeComponent } from './functional-tree/functional-tree';

interface RoadmapItem {
    id: number;
    title: string;
    description: string;
    category: string;
    categoryIcon: string;
    targetApp: 'FleetTrack' | 'e-logbook' | 'Les deux';
    status: 'Planifié' | 'En cours' | 'Terminé';
    priority: 'Haute' | 'Moyenne' | 'Basse';
}

interface ChangelogItem {
    version: string;
    date: string;
    changes: { category: string; description: string }[];
    type: 'major' | 'minor' | 'patch';
}

@Component({
    selector: 'app-roadmap',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTabsModule, FunctionalTreeComponent],
    templateUrl: './roadmap.html',
    styleUrls: ['./roadmap.css']
})
export class RoadmapComponent {
    changelogItems: ChangelogItem[] = [
        {
            version: 'v2.8.0',
            date: '28 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Journal d\'Activité', description: 'Nouveau Module : Audit Log complet traçant toutes les actions sensibles (Cr, Up, Del) sur les utilisateurs, véhicules, mouvements et lieux.' },
                { category: 'Journal d\'Activité', description: 'Filtres : Possibilité de filtrer l\'historique par Catégorie, Action et Pays (SuperAdmin).' },
                { category: 'Administration', description: 'Mode "Purge" : Fonctionnalité de nettoyage complet des logs (réservée au SuperAdmin) après confirmation.' },
                { category: 'Juridique', description: 'Décharge de Responsabilité : Ajout de la fonctionnalité de signature numérique pour les passagers externes.' },
                { category: 'Sécurité', description: 'Traçabilité : Enregistrement automatique du Pays concerné et de l\'IP de l\'auteur pour chaque action.' },
                { category: 'Correctif', description: 'Stabilité : Résolution des problèmes de CORS et Rate Limiting sur l\'API.' }
            ]
        },
        {
            version: 'v2.7.1',
            date: '26 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Carte Interactive', description: 'Nouveau Filtre : Sélection par Mode de Transport (Route, Aérien, Maritime).' },
                { category: 'Demande Mouvement', description: 'Récurrence : Possibilité de créer une série de demandes (Quotidienne/Hebdomadaire) sur 3 mois.' },
                { category: 'UX', description: 'Amélioration de la saisie des dates pour les demandes récurrentes.' },
                { category: 'Communication', description: 'Emails Transactionnels : Notification automatique aux Superviseurs (demande de validation) et Demandeurs (suivi statut).' },
                { category: 'Workflow', description: 'Validation Sécurité : Matrice de risque active. Les trajets en zone rouge/orange déclenchent une approbation sécuritaire obligatoire.' },
                { category: 'Alerting', description: 'Push Notifications : Diffusion instantanée des alertes de sécurité sur les mobiles (même app fermée).' },
                { category: 'Sécurité', description: 'Durcissement Backend : Rate Limiter, Helmet et CORS strict pour bloquer les accès non autorisés.' },
                { category: 'Documentation', description: 'Transparence : Nouvel onglet "Sécurité" détaillant les mesures de protection des données.' }
            ]
        },
        {
            version: 'v2.7.0',
            date: '26 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Objectifs Environnementaux', description: 'Nouveau Module : Suivi de la consommation (-5%) et Plan d\'Action (Roadmap) trimestriel.' },
                { category: 'Objectifs Environnementaux', description: 'IAP (Indicateur) : Calcul automatique de l\'Indice d\'Activité Pondéré pour l\'efficacité énergétique.' },
                { category: 'Objectifs Environnementaux', description: 'UI : Guide méthodologique intégré et configuration personnalisée des pondérations.' }
            ]
        },
        {
            version: 'v2.6.1',
            date: '26 Janvier 2026',
            type: 'patch',
            changes: [
                { category: 'Correctif', description: 'Résolution du blocage lors de la connexion (Login) causé par une police manquante.' }
            ]
        },
        {
            version: 'v2.6.0',
            date: '25 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Dashboard', description: 'Tour de Contrôle : KPIs CO2 séparés (Flotte vs Aérien) et nouvelles cartes par mode + Correctif Stats Globales.' },
                { category: 'Logbook', description: 'Visualisation Carte : Correction du tracé planifié (Ligne bleue) et support robuste des coordonnées GPS.' },
                { category: 'UX / UI', description: 'Amélioration lisibilité : Fonds blancs imposés sur les listes déroulantes, champs de saisie et icônes modes.' },
                { category: 'Correctif', description: 'Stabilisation de la persistance des dates (Stops) et du calcul distance Aérien.' }
            ]
        },
        {
            version: 'v2.5.0',
            date: '25 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Tour de Contrôle', description: 'Dashboard : Filtres avancés par date et sélection multiple interactive sur la carte.' },
                { category: 'Tour de Contrôle', description: 'Validation : Gestion des trajets "Hors-Liste" (Imprévus) avec indicateurs visuels et validation Manager.' },
                { category: 'Visualisation', description: 'Carte : Affichage du code véhicule (ACF) dans les infobulles.' },
                { category: 'e-logbook', description: 'Mode Libre : Possibilité de démarrer un trajet sans mission planifiée (avec GPS complet).' },
                { category: 'Backend', description: 'Flagging automatique des trajets ad-hoc et intégration dans le flux de consolidation.' }
            ]
        },
        {
            version: 'v2.4.0',
            date: '24 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'e-logbook', description: 'Traceur GPS "Boîte Noire" : Enregistrement auto (Position, Vitesse) pour les véhicules trackés.' },
                { category: 'e-logbook', description: 'Départ GPS : Nouvelle option pour démarrer depuis la position actuelle (bypass lieux).' },
                { category: 'e-logbook', description: 'UX : Annulation de Trajet (Bouton d\'urgence) et Indicateurs visuels (Satellite).' },
                { category: 'e-logbook', description: 'Fix Kilométrage : Logique de suggestion intelligente (Max des 10 derniers trajets).' },
                { category: 'Web Dashboard', description: 'Visualisation : Carte interactive des trajets réels vs planifiés (Comparaison).' },
                { category: 'Web Dashboard', description: 'Admin : Toggle "Activer GPS" par véhicule.' },
                { category: 'Backend', description: 'Analyse : Calcul Distance Réelle (Haversine) et Détection de Déviation (>15%).' }
            ]
        },
        {
            version: 'v2.3.1',
            date: '24 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Maintenance', description: 'Notifications Email Automatiques : Envoi quotidien (08h00) aux Superviseurs pour les véhicules nécessitant une maintenance (Statut Proche ou Retard).' }
            ]
        },
        {
            version: 'v2.3.0',
            date: '24 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Alerting', description: 'Détection automatique de la surconsommation de carburant (>10% vs théorique).' },
                { category: 'Maintenance', description: 'Calcul dynamique du statut (OK/Proche/Retard) basé sur les intervalles configurables.' },
                { category: 'Maintenance', description: 'Intégration des configurations de maintenance par type de véhicule (Intervalles personnalisés).' }
            ]
        },
        {
            version: 'v2.2.0',
            date: '24 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Validation', description: 'Emails de refus : Notification enrichie avec le motif de refus.' },
                { category: 'Visualisation', description: 'Carte Interactive : Tracés routiers réels (OSRM) et marqueurs de couleurs.' },
                { category: 'Intelligence', description: 'Calculs prédictifs : Estimation automatique Distance/Durée lors de la demande.' },
                { category: 'Expérience Utilisateur', description: 'Pré-remplissage intelligent de l\'heure d\'arrivée (+ marge sécurité).' },
                { category: 'Correctif', description: 'Résolution des problèmes CORS (Intercepteurs) pour les API externes.' }
            ]
        },
        {
            version: 'v2.1.0',
            date: '23 Janvier 2026',
            type: 'minor',
            changes: [
                { category: 'Gestion Financière', description: 'Ajout d\'une liste déroulante pour la sélection des projets (Ventilation) pour plus de cohérence.' },
                { category: 'Statistiques', description: 'Correction des filtres Dashboard Global vs Par Projet : respect strict de la ventilation financière.' },
                { category: 'Statistiques', description: 'Ajout des colonnes "Distance Totale" (Impliquée) vs "Distance Ventilée" (Réelle) dans les rapports.' },
                { category: 'Sécurité', description: 'Durcissement du service d\'authentification et gestion automatique des erreurs 401 (reconnexion propre).' }
            ]
        },
        {
            version: 'v2.0.1',
            date: '21 Janvier 2026',
            type: 'patch',
            changes: [
                { category: 'Correctif', description: 'Rétablissement de la visibilité du menu "Validation" pour le rôle Superviseur Sécurité.' },
                { category: 'Architecture', description: 'Mise à jour des Interceptors pour la gestion multi-pays.' }
            ]
        },
        {
            version: 'v2.0.0',
            date: 'Janvier 2026',
            type: 'major',
            changes: [
                { category: 'Véhicules', description: 'Instauration des IDs automatiques, gestion des Assurances et distinction Propriété/Location.' },
                { category: 'Lieux', description: 'Niveaux de sécurité (1-5) avec indicateurs visuels.' },
                { category: 'Utilisateurs', description: 'Ajout des matricules employés et niveaux d\'habilitation sécurité.' },
                { category: 'Mouvements', description: 'Support des modes Aérien et Maritime.' },
                { category: 'Validation', description: 'Matrice intelligente (Niveau de risque vs Habilitation user) et historique des signatures.' },
                { category: 'Ventilation', description: 'Algorithme de répartition automatique des coûts basé sur les passagers.' }
            ]
        }
    ];

    roadmapItems: RoadmapItem[] = [
        {
            id: 1,
            title: 'Traduction Multi-langues (i18n)',
            description: 'Internationalisation complète des deux applications avec support pour le français, anglais, espagnol et autres langues. Les utilisateurs pourront changer la langue via un menu déroulant ou sélecteur de drapeaux.',
            category: 'Internationalisation & Accessibilité',
            categoryIcon: 'language',
            targetApp: 'Les deux',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 2,
            title: 'Géolocalisation GPS',
            description: 'Intégration du GPS pour enregistrer automatiquement les coordonnées exactes de départ et d\'arrivée des trajets. Fonctionne en mode hors-ligne avec synchronisation automatique une fois la connexion rétablie.',
            category: 'Mobile & Localisation',
            categoryIcon: 'my_location',
            targetApp: 'e-logbook',
            status: 'Terminé',
            priority: 'Haute'
        },
        {
            id: 3,
            title: 'Module Alertes Sécurité',
            description: 'Système de notifications push pour alerter les chauffeurs et superviseurs des zones à risque, marchés à éviter, et autres alertes de sécurité critiques en temps réel.',
            category: 'Sécurité & Alertes',
            categoryIcon: 'warning',
            targetApp: 'Les deux',
            status: 'En cours',
            priority: 'Haute'
        },
        {
            id: 4,
            title: 'Carte Live de la Flotte',
            description: 'Visualisation en temps réel de tous les véhicules de la flotte sur une carte interactive. Permet de suivre les mouvements en cours et optimiser la gestion des ressources.',
            category: 'Sécurité & Alertes',
            categoryIcon: 'map',
            targetApp: 'FleetTrack',
            status: 'Terminé',
            priority: 'Moyenne'
        },
        {
            id: 5,
            title: 'Manuel Chauffeur Digital',
            description: 'Intégration du Manuel Chauffeur en version digitale et des informations globales du POSL déplacement directement dans l\'application mobile pour un accès facile et hors-ligne.',
            category: 'Documentation',
            categoryIcon: 'menu_book',
            targetApp: 'e-logbook',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 6,
            title: 'Indicateur Trajets Courts (< 2km)',
            description: 'Calcul et affichage du pourcentage de trajets de moins de 2 km pour encourager les déplacements alternatifs (marche, vélo) et réduire l\'empreinte carbone.',
            category: 'Analytics & Reporting',
            categoryIcon: 'analytics',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Basse'
        },
        {
            id: 7,
            title: 'Kilomètres Mutualisés',
            description: 'Suivi et reporting du nombre de kilomètres mutualisés (plusieurs passagers/projets dans un même trajet) pour optimiser l\'utilisation des véhicules.',
            category: 'Analytics & Reporting',
            categoryIcon: 'groups',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Basse'
        },
        {
            id: 8,
            title: 'Taux d\'Utilisation des Véhicules',
            description: 'Indicateurs de performance montrant le taux d\'utilisation et de disponibilité de chaque véhicule pour identifier les ressources sous-utilisées ou sur-sollicitées.',
            category: 'Analytics & Reporting',
            categoryIcon: 'assessment',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 9,
            title: 'Mouvements Flexibles',
            description: 'Ajout d\'une option pour marquer les demandes de mouvement comme "flexibles" en termes d\'horaire, permettant une meilleure optimisation du planning.',
            category: 'Planning & Scheduling',
            categoryIcon: 'schedule',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 10,
            title: 'Mouvements Récurrents',
            description: 'Possibilité d\'enregistrer des demandes de mouvement récurrentes (quotidiennes, hebdomadaires, mensuelles) pour éviter les saisies répétitives et gagner du temps.',
            category: 'Planning & Scheduling',
            categoryIcon: 'repeat',
            targetApp: 'FleetTrack',
            status: 'Terminé',
            priority: 'Haute'
        },
        {
            id: 11,
            title: 'Slots Maintenance dans Planning',
            description: 'Intégration des créneaux horaires de maintenance préventive directement dans le planning global pour éviter les conflits et assurer la disponibilité des véhicules.',
            category: 'Planning & Scheduling',
            categoryIcon: 'build_circle',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 12,
            title: 'Journal d\'activité (Audit Log)',
            description: 'Historique complet des actions sensibles (créations, modifications, suppressions) pour une traçabilité totale.',
            category: 'Sécurité & Admin',
            categoryIcon: 'security',
            targetApp: 'FleetTrack',
            status: 'Terminé',
            priority: 'Haute'
        },
        {
            id: 13,
            title: 'Connecteur SSO (Azure AD)',
            description: 'Intégration du Single Sign-On avec Azure AD pour une gestion centralisée des identités et une connexion simplifiée pour les utilisateurs.',
            category: 'Sécurité & Admin',
            categoryIcon: 'vpn_key',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 14,
            title: 'Refonte Workflow Validation',
            description: 'Révision du logique d\'attribution des véhicules pour permettre l\'affectation APRES validation sécuritaire (évitant les annulations tardives).',
            category: 'Workflow',
            categoryIcon: 'hub',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 15,
            title: 'Suivi Demandes en Attente',
            description: 'Ajout de filtres sur le planning global pour visualiser les demandes en attente de validation et notifications automatiques aux demandeurs.',
            category: 'Workflow',
            categoryIcon: 'pending_actions',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 16,
            title: 'Tableau de Bord Mouvements',
            description: 'Nouveau dashboard filtrable intégré au planning pour une analyse fine des mouvements (statuts, types, périodes).',
            category: 'Analytics & Reporting',
            categoryIcon: 'dashboard',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 17,
            title: 'Détection Conflits Horaires',
            description: 'Algorithme automatique détectant les chevauchements de planning lors de l\'affectation véhicule/chauffeur.',
            category: 'Planning & Scheduling',
            categoryIcon: 'event_busy',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 18,
            title: 'Blocage Défaut Critique',
            description: 'Fonctionnalité bloquante dans l\'e-logbook empêchant l\'utilisation d\'un véhicule si un défaut critique est signalé lors du check.',
            category: 'Sécurité & Alertes',
            categoryIcon: 'gpp_bad',
            targetApp: 'e-logbook',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 19,
            title: 'Géoloc Incidents Auto',
            description: 'Capture automatique des coordonnées GPS lors de la déclaration d\'un incident via l\'application mobile.',
            category: 'Mobile & Localisation',
            categoryIcon: 'add_location',
            targetApp: 'e-logbook',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 20,
            title: 'Programmation Maintenance Future',
            description: 'Possibilité de planifier à l\'avance des opérations de maintenance qui bloqueront le planning du véhicule.',
            category: 'Planning & Scheduling',
            categoryIcon: 'edit_calendar',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 21,
            title: 'Suivi Administratif Chauffeurs',
            description: 'Module complet de suivi des expirations de contrats et permis de conduire avec alertes.',
            category: 'Sécurité & Admin',
            categoryIcon: 'badge',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Basse'
        },
        {
            id: 22,
            title: 'Module Gestion des Coûts',
            description: 'Module financier avancé incluant tableaux d\'amortissement, TCO (Total Cost of Ownership) et ventilation analytique poussée.',
            category: 'Analytics & Reporting',
            categoryIcon: 'euro',
            targetApp: 'FleetTrack',
            status: 'Planifié',
            priority: 'Basse'
        }
    ];

    getStatusClass(status: string): string {
        switch (status) {
            case 'Planifié': return 'status-planned';
            case 'En cours': return 'status-progress';
            case 'Terminé': return 'status-completed';
            default: return '';
        }
    }

    getPriorityClass(priority: string): string {
        switch (priority) {
            case 'Haute': return 'priority-high';
            case 'Moyenne': return 'priority-medium';
            case 'Basse': return 'priority-low';
            default: return '';
        }
    }

    getAppClass(app: string): string {
        switch (app) {
            case 'FleetTrack': return 'app-gestion';
            case 'e-logbook': return 'app-logbook';
            case 'Les deux': return 'app-both';
            default: return '';
        }
    }
}
