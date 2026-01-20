import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface RoadmapItem {
    id: number;
    title: string;
    description: string;
    category: string;
    categoryIcon: string;
    targetApp: 'Gestion des déplacements' | 'e-logbook' | 'Les deux';
    status: 'Planifié' | 'En cours' | 'Terminé';
    priority: 'Haute' | 'Moyenne' | 'Basse';
}

@Component({
    selector: 'app-roadmap',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './roadmap.html',
    styleUrls: ['./roadmap.css']
})
export class RoadmapComponent {
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
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 3,
            title: 'Module Alertes Sécurité',
            description: 'Système de notifications push pour alerter les chauffeurs et superviseurs des zones à risque, marchés à éviter, et autres alertes de sécurité critiques en temps réel.',
            category: 'Sécurité & Alertes',
            categoryIcon: 'warning',
            targetApp: 'Les deux',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 4,
            title: 'Carte Live de la Flotte',
            description: 'Visualisation en temps réel de tous les véhicules de la flotte sur une carte interactive. Permet de suivre les mouvements en cours et optimiser la gestion des ressources.',
            category: 'Sécurité & Alertes',
            categoryIcon: 'map',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
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
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Basse'
        },
        {
            id: 7,
            title: 'Kilomètres Mutualisés',
            description: 'Suivi et reporting du nombre de kilomètres mutualisés (plusieurs passagers/projets dans un même trajet) pour optimiser l\'utilisation des véhicules.',
            category: 'Analytics & Reporting',
            categoryIcon: 'groups',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Basse'
        },
        {
            id: 8,
            title: 'Taux d\'Utilisation des Véhicules',
            description: 'Indicateurs de performance montrant le taux d\'utilisation et de disponibilité de chaque véhicule pour identifier les ressources sous-utilisées ou sur-sollicitées.',
            category: 'Analytics & Reporting',
            categoryIcon: 'assessment',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 9,
            title: 'Mouvements Flexibles',
            description: 'Ajout d\'une option pour marquer les demandes de mouvement comme "flexibles" en termes d\'horaire, permettant une meilleure optimisation du planning.',
            category: 'Planning & Scheduling',
            categoryIcon: 'schedule',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Moyenne'
        },
        {
            id: 10,
            title: 'Mouvements Récurrents',
            description: 'Possibilité d\'enregistrer des demandes de mouvement récurrentes (quotidiennes, hebdomadaires, mensuelles) pour éviter les saisies répétitives et gagner du temps.',
            category: 'Planning & Scheduling',
            categoryIcon: 'repeat',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 11,
            title: 'Slots Maintenance dans Planning',
            description: 'Intégration des créneaux horaires de maintenance préventive directement dans le planning global pour éviter les conflits et assurer la disponibilité des véhicules.',
            category: 'Planning & Scheduling',
            categoryIcon: 'build_circle',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Haute'
        },
        {
            id: 12,
            title: 'Journal d\'activité (Audit Log)',
            description: 'Historique complet des actions sensibles (créations, modifications, suppressions) pour une traçabilité totale.',
            category: 'Sécurité & Admin',
            categoryIcon: 'security',
            targetApp: 'Gestion des déplacements',
            status: 'Planifié',
            priority: 'Haute'
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
            case 'Gestion des déplacements': return 'app-gestion';
            case 'e-logbook': return 'app-logbook';
            case 'Les deux': return 'app-both';
            default: return '';
        }
    }
}
