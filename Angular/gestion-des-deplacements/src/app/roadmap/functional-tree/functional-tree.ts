import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

export interface TreeNode {
    id: string;
    name: string;
    type: 'root' | 'category' | 'function';
    children?: TreeNode[];
    isImplemented?: boolean; // Pour le futur (statut)
    color?: string; // Pour les lots
    description?: string; // Nouvelle "bulle d'info"
}

@Component({
    selector: 'app-functional-tree',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatTooltipModule, DragDropModule],
    templateUrl: './functional-tree.html',
    styleUrls: ['./functional-tree.css']
})
export class FunctionalTreeComponent {

    // Gestion de la sélection
    selectedNode: TreeNode | null = null;

    selectNode(node: TreeNode) {
        this.selectedNode = node;
        // Si c'est une catégorie vide ou root, on peut aussi l'éditer
    }

    // Données initiales enrichies
    treeData: TreeNode = {
        id: 'root',
        name: 'Mouvements Terrain & Parc de Véhicules',
        type: 'root',
        children: [
            {
                id: 'c1', name: 'Paramétrage', type: 'category', color: '#000000', children: [
                    {
                        id: 'f1-1', name: 'Gestion des utilisateurs : SSO + droits', type: 'function', isImplemented: true,
                        description: "Authentification locale (Email/Mot de passe crypté Bcrypt). Gestion fine des droits via le champ 'Profil' (RBAC) : SuperAdmin, Admin, Superviseur, Technicien, Guest.\n\nPas encore de connecteur SSO (ex: Azure AD) implémenté."
                    },
                    { id: 'f1-2', name: 'Gestion des employés (Core RH)', type: 'function' },
                    {
                        id: 'f1-3', name: 'Gestion de la structure ACF : BP, bases...', type: 'function', isImplemented: true,
                        description: "Modélisation en base de données : Collections 'Pays' et 'Base'.\nChaque utilisateur et véhicule est rattaché à une Base et un Pays, permettant le filtrage et la ségrégation des données."
                    },
                    { id: 'f1-4', name: 'Gestion des contrats', type: 'function' },
                    {
                        id: 'f1-5', name: 'Gestion des workflows de validation', type: 'function', isImplemented: true,
                        description: "Workflow codé en dur (Hardcoded State Machine) : En attente -> Validé (par Admin/Superviseur) -> Pris en charge -> Terminé.\nLe 'moteur' est dans `backend/routes/mouvements.js`."
                    },
                    {
                        id: 'f1-6', name: 'Gestion des lieux (départs/destinations)', type: 'function', isImplemented: true,
                        description: "Collection 'Lieu'. Contient : Nom, Adresse, Coordonnées GPS, et Indicateur 'Zone Sensible' (pour alertes sécu)."
                    },
                    {
                        id: 'f1-7', name: 'Gestion des véhicules', type: 'function', isImplemented: true,
                        description: "Collection 'Vehicule'. Fiche complète : Immatriculation, Marque, Modèle, Kilométrage, Capacité, Type Carburant, Date Achat..."
                    },
                    {
                        id: 'f1-8', name: 'Paramétrage checklists contrôle véhicule', type: 'function', isImplemented: true,
                        description: "Intégré dans e-Logbook (PWA). Formulaire dynamique avec validation des points de contrôle (Niveaux, Pression, Carrosserie...)."
                    },
                    {
                        id: 'f1-9', name: 'Paramétrage services type', type: 'function', isImplemented: true,
                        description: "Liste fixe des types de maintenances gérées : Vidange, Freins, Pneus, Distribution, etc."
                    }
                ]
            },
            {
                id: 'c2', name: 'Demandes de déplacement', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f2-1', name: 'Edition de demandes', type: 'function', isImplemented: true,
                        description: "Formulaire complet côté Admin & PWA. Champs : Itinéraire (Multi-stops), Passagers, Cargaison, Projet, Horaires."
                    },
                    {
                        id: 'f2-2', name: 'Envoi pour validation', type: 'function', isImplemented: true,
                        description: "Une fois créée, la demande est en statut 'En attente'. Un email automatique est envoyé aux superviseurs si le trajet est en zone sensible."
                    },
                    {
                        id: 'f2-3', name: 'Consultation des demandes', type: 'function', isImplemented: true,
                        description: "Tableaux de bord filtrables (par statut, dates, demandeur) pour visualiser l'ensemble des requêtes."
                    }
                ]
            },
            {
                id: 'c3', name: 'Validation des demandes', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f3-1', name: 'Workflow & Droits', type: 'function', isImplemented: true,
                        description: "Validation numérique. Seuls les rôles 'Admin', 'Superviseur' et 'SuperAdmin' ont le bouton 'Valider'. Les 'Superviseur Sécurité' ont un canal prioritaire pour les zones rouges."
                    }
                ]
            },
            {
                id: 'c4', name: 'Affectation des mouvements', type: 'category', color: '#ffa726', children: [
                    {
                        id: 'f4-1', name: 'Planning véhicules / chauffeurs', type: 'function', isImplemented: true,
                        description: "Vue 'Planning' (Diagramme de Gantt simplifié) permettant de voir l'occupation des ressources sur la journée/semaine."
                    },
                    {
                        id: 'f4-2', name: 'Consolidation (Regroupement)', type: 'function', isImplemented: true,
                        description: "Fonction 'Consolidation' : Permet de drag & drop plusieurs demandes passagers dans un même véhicule pour optimiser le trajet."
                    },
                    {
                        id: 'f4-3', name: 'Consultation disponibilités', type: 'function', isImplemented: true,
                        description: "Lors de l'affectation, le système vérifie les conflits d'horaires et alerte si le véhicule/chauffeur est déjà pris."
                    },
                    {
                        id: 'f4-4', name: 'Affectation véhicule/chauffeur', type: 'function', isImplemented: true,
                        description: "Assignation directe depuis la fiche mouvement ou via drag & drop dans l'outil de consolidation."
                    },
                    { id: 'f4-5', name: 'Consultation planning', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c5', name: 'Application chauffeur', type: 'category', color: '#f06292', children: [
                    {
                        id: 'f5-1', name: 'Consultation déplacements prévus', type: 'function', isImplemented: true,
                        description: "Dashboard 'Mes Missions' sur la PWA. Affiche le prochain trajet confirmé avec détails (Carte, Passagers)."
                    },
                    {
                        id: 'f5-2', name: 'Enregistrement mouvements (Logbook)', type: 'function', isImplemented: true,
                        description: "Start/Stop digital. Capture automatique de l'heure et saisie manuelle du kilométrage réel. Synchro Offline."
                    },
                    {
                        id: 'f5-3', name: 'Enregistrement carburant', type: 'function', isImplemented: true,
                        description: "Formulaire saisie plein : Volume, Prix, Station, Photo ticket (Upload). Calcul conso moyenne auto."
                    },
                    {
                        id: 'f5-4', name: 'Check quotidien / hebdo', type: 'function', isImplemented: true,
                        description: "Checklist digitalisée avant départ. Blocage si défaut critique (ex: Freins)."
                    },
                    {
                        id: 'f5-5', name: 'Information maintenance', type: 'function', isImplemented: true,
                        description: "Notifications visuelles sur la PWA quand une maintenance approche ou est en retard."
                    },
                    {
                        id: 'f5-6', name: 'Enregistrer une maintenance', type: 'function', isImplemented: true,
                        description: "Saisie par le chauffeur ou le garagiste de l'intervention réalisée (Coût, Pièces changées)."
                    },
                    { id: 'f5-7', name: 'Enregistrer une réparation', type: 'function' },
                    {
                        id: 'f5-8', name: 'Déclarer un incident', type: 'function', isImplemented: true,
                        description: "Formulaire déclaration accident/panne avec photos et géolocalisation."
                    },
                    {
                        id: 'f5-9', name: 'Position TR + Envoi serveur', type: 'function', isImplemented: true,
                        description: "Tracking GPS passif via le navigateur de la tablette. Envoi point toutes les X minutes si réseau dispo."
                    },
                    {
                        id: 'f5-10', name: 'Envoi d\'alertes sécu', type: 'function', isImplemented: true,
                        description: "Bouton SOS / Alerte qui notifie immédiatement les admins (Push & Dashboard)."
                    }
                ]
            },
            {
                id: 'c6', name: 'Consultation Logbook', type: 'category', color: '#ba68c8', children: [
                    {
                        id: 'f6-1', name: 'Consultation historique trajets', type: 'function', isImplemented: true,
                        description: "Historique complet disponible sur PWA (local) et Admin (global). Export Excel disponible."
                    },
                    { id: 'f6-2', name: 'Consultation historique carburants', type: 'function', isImplemented: true },
                    { id: 'f6-3', name: 'Consultation historique maintenances', type: 'function', isImplemented: true },
                    { id: 'f6-4', name: 'Consultation historique réparations', type: 'function' },
                    { id: 'f6-5', name: 'Consultation historique incidents', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c7', name: 'Planification des maintenances', type: 'category', color: '#8e24aa', children: [
                    {
                        id: 'f7-1', name: 'Alertes / suivi échéances', type: 'function', isImplemented: true,
                        description: "Calcul automatique basé sur Km ou Date (ex: Vidange tous les 5000km). Codes couleurs (Vert/Orange/Rouge) dans le parc automobile."
                    },
                    {
                        id: 'f7-2', name: 'Programmation des opérations', type: 'function', isImplemented: true,
                        description: "Possibilité de planifier une maintenance future, qui apparaît alors dans le planning véhicule."
                    }
                ]
            },
            {
                id: 'c8', name: 'Tracking / suivi temps réel', type: 'category', color: '#ff5722', children: [
                    {
                        id: 'f8-1', name: 'Consultation position véhicules TR', type: 'function', isImplemented: true,
                        description: "Carte OpenLayers affichant la dernière position connue de tous les véhicules actifs."
                    },
                    {
                        id: 'f8-2', name: 'Consultation historique des traces', type: 'function', isImplemented: true,
                        description: "Replay des trajets sur la carte (Trace A -> B)."
                    }
                ]
            },
            {
                id: 'c9', name: 'Suivi administratif', type: 'category', color: '#00bcd4', children: [
                    { id: 'f9-1', name: 'Suivi standards véhicules', type: 'function' },
                    { id: 'f9-2', name: 'Suivi échéances admin véhicules', type: 'function' },
                    {
                        id: 'f9-3', name: 'Suivi standards chauffeurs (formation)', type: 'function', isImplemented: true,
                        description: "Champ 'Eco-conduite' (Oui/Non + Date) sur la fiche Chauffeur. Pas de module de formation complet (LMS)."
                    },
                    { id: 'f9-4', name: 'Suivi échéances admin chauffeurs', type: 'function' }
                ]
            },
            {
                id: 'c10', name: 'Gestion financière', type: 'category', color: '#9c27b0', children: [
                    {
                        id: 'f10-1', name: 'Suivi coûts récurrents', type: 'function', isImplemented: true,
                        description: "Champs 'Coût Assurance', 'Coût Location', 'Dépréciation' dans la fiche Véhicule. Inclus dans les rapports de coûts."
                    },
                    { id: 'f10-2', name: 'Suivi coûts ponctuels', type: 'function' },
                    { id: 'f10-3', name: 'Consolidation coûts par véhicule/mois', type: 'function' },
                    {
                        id: 'f10-4', name: 'Ventilation des coûts (Analytique)', type: 'function', isImplemented: true,
                        description: "Lors de la création de mouvement, les coûts peuvent être ventilés sur plusieurs Projets (Calcul automatique du % par passager)."
                    },
                    { id: 'f10-5', name: 'Lien Polaris', type: 'function' }
                ]
            },
            {
                id: 'c12', name: 'Tableaux de bord & Reporting', type: 'category', color: '#009688', children: [
                    {
                        id: 'f12-1', name: 'KPIs Flotte & Environnement', type: 'function', isImplemented: true,
                        description: "Dashboard V2 : Km total, Conso moyenne, Coût total, Taux de service. Graphiques d'évolution mensuelle."
                    }
                ]
            }
        ]
    };

    // Gestion de l'édition
    editingNodeId: string | null = null;

    toggleEdit(node: TreeNode) {
        if (this.editingNodeId === node.id) {
            this.editingNodeId = null; // Save implicit
        } else {
            this.editingNodeId = node.id;
        }
    }

    addNode(parentNode: TreeNode) {
        const newNode: TreeNode = {
            id: 'new-' + Date.now(),
            name: 'Nouvelle Fonctionnalité',
            type: parentNode.type === 'root' ? 'category' : 'function',
            children: [],
            isImplemented: false
        };
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(newNode);
        this.editingNodeId = newNode.id; // Auto edit new node
    }

    deleteNode(parentNode: TreeNode, nodeIndex: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            parentNode.children!.splice(nodeIndex, 1);
        }
    }

    toggleImplementation(node: TreeNode) {
        node.isImplemented = !node.isImplemented;
    }
}
