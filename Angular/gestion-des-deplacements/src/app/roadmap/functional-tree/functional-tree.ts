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
    isExclusive?: boolean; // Fonctionnalité "FleetTrack" mise en avant
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
                        description: "Authentification locale (Email/Mot de passe crypté Bcrypt). Gestion fine des droits via le champ 'Profil' (RBAC) : SuperAdmin, Admin, Superviseur, Technicien, Guest.\nAjouté : Profil 'Superviseur Sécurité' spécifique.\nRoadmap : Connecteur SSO (Azure AD)."
                    },
                    {
                        id: 'f1-3', name: 'Gestion de la structure ACF : BP, bases...', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Modélisation complète : Collections 'Pays', 'Base', 'Lieux', 'Nom de projet'.\nLe rôle 'Super Admin' peut créer des admins pays et gérer les affectations globales (Bases, Lieux, Utilisateurs, Véhicules)."
                    },
                    {
                        id: 'f1-5', name: 'Gestion des workflows de validation', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Workflow multiniveaux : Logistique ET Sécurité.\nValidation Sécurité obligatoire pour les zones sensibles AVANT l'organisation du mouvement.\nNote Roadmap : Revoir si l'attribution véhicule doit se faire avant ou après la validation sécu (risque d'annulation tardive)."
                    },
                    {
                        id: 'f1-6', name: 'Gestion des lieux (départs/destinations)', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Collection 'Lieu' enrichie : Nom, Adresse, Coordonnées GPS.\nNouveau : Niveaux de sécurité paramétrables (1 à 5) pour chaque lieu."
                    },
                    {
                        id: 'f1-7', name: 'Gestion des véhicules', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Fiche complète : Marque, Modèle, Immat.\nNouveau : Statut (Propriété/Location), Données Admin (Assurances), Données Enviro (CO2), Conso théorique vs réelle.\nOption : Activer/Désactiver le tracking GPS par véhicule."
                    },
                    {
                        id: 'f1-8', name: 'Paramétrage checklists contrôle véhicule', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Intégré dans e-Logbook (PWA). Template modifiable directement dans l'outil.\nAjout de liens vers instructions PDF pour chaque point de contrôle.\nTraçabilité complète des checks faits/non faits."
                    },
                    {
                        id: 'f1-9', name: 'Paramétrage services type', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Liste des types de maintenance paramétrable.\nPossibilité de définir des intervalles de maintenance par type de véhicule.\nLien vers instructions PDF."
                    }
                ]
            },
            {
                id: 'c2', name: 'Demandes de déplacement', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f2-1', name: 'Edition de demandes', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Création uniquement dans FleetTrack (pas PWA). Formulaire riche : Mode (Routier, Air, Mer), Itinéraire (Multi-stops, GPS ou Lieux enregistrés), Passagers, Cargaison, Horaires.\nProjet affilié automatiquement au demandeur (consolidation possible).\nEstimation automatique trajet (OSRM) et calcul heure arrivée."
                    },
                    {
                        id: 'f2-2', name: 'Envoi pour validation', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Statut 'En attente' (Log ou Sécu). Email auto aux superviseurs (Sécu si zone sensible).\nRoadmap : Afficher les demandes en attente sur le planning global (bouton filtre). Notification au demandeur lors validation/refus."
                    },
                    {
                        id: 'f2-3', name: 'Consultation des demandes', type: 'function', isImplemented: true,
                        description: "Via le Planning Global et le menu 'Mes Mouvements'.\nRoadmap : Ajouter un tableau de bord des mouvements filtrable en bas du planning global (remplaçant la carte interactive)."
                    }
                ]
            },
            {
                id: 'c3', name: 'Validation des demandes', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f3-1', name: 'Workflow & Droits', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Admin paramètre le niveau d'habilitation de chaque Superviseur Sécurité.\nValidation numérique centralisée."
                    }
                ]
            },
            {
                id: 'c4', name: 'Affectation des mouvements', type: 'category', color: '#ffa726', children: [
                    {
                        id: 'f4-1', name: 'Planning véhicules / chauffeurs', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Code couleur des mouvements selon statut. Infos détaillées au survol (tooltip)."
                    },
                    {
                        id: 'f4-2', name: 'Consolidation (Regroupement)', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Outil de regroupement pour optimisation (pas drag & drop). Sélection des mouvements à fusionner (étape, horaire, passagers).\nVisualisation cartographique des opportunités de consolidation."
                    },
                    {
                        id: 'f4-4', name: 'Affectation véhicule/chauffeur', type: 'function', isImplemented: true,
                        description: "Se fait à l'étape de consolidation après validations (Log & Sécu).\nRoadmap : Détection automatique des conflits d'horaires."
                    },
                    { id: 'f4-5', name: 'Consultation planning', type: 'function', isImplemented: true, description: "Visuel des statuts sur planning semaine. Consultable aussi dans 'Mes mouvements'." }
                ]
            },
            {
                id: 'c5', name: 'Application chauffeur (PWA)', type: 'category', color: '#f06292', children: [
                    {
                        id: 'f5-1', name: 'Consultation Lieux & Horaires', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Dashboard 'Mes Missions'. Affiche le prochain trajet confirmé : Lieux, Horaires, Passagers (pas de carte interactive)."
                    },
                    {
                        id: 'f5-2', name: 'Enregistrement mouvements (Logbook)', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Start/Stop digital. Capture auto heure. Saisie manuelle Km réel. Reprise dernier Km enregistré.\nDétection mouvements affiliés pour prise en charge.\nMouvements libres (non planifiés) possibles avec géoloc.\nSynchro Offline/Online automatique.\nComparaison Planning vs Réel (Heures/Km)."
                    },
                    {
                        id: 'f5-3', name: 'Enregistrement carburant', type: 'function', isImplemented: true,
                        description: "Synchronisé avec le module Carburant de FleetTrack global."
                    },
                    {
                        id: 'f5-4', name: 'Check quotidien / hebdo', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Log automatique à chaque vérification (Date/Heure). Blocage si défaut critique (Roadmap)."
                    },
                    {
                        id: 'f5-5', name: 'Information maintenance', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Suivi du template des checks service. Instructions accessibles.\nValidation complétion par Responsable (Admin/Superviseur) uniquement."
                    },
                    {
                        id: 'f5-8', name: 'Déclarer un incident', type: 'function', isImplemented: true,
                        description: "Formulaire déclaration. Roadmap : Relevé géolocalisation automatique."
                    },
                    {
                        id: 'f5-9', name: 'Position TR + Envoi serveur', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Tracking GPS passif (si activé). Comparaison trajet Réel vs Planifié dans FleetTrack."
                    },
                    {
                        id: 'f5-10', name: 'Réception alertes sécu', type: 'function', isImplemented: true,
                        description: "Réception des alertes envoyées par le superviseur depuis FleetTrack."
                    }
                ]
            },
            {
                id: 'c6', name: 'Consultation Logbook', type: 'category', color: '#ba68c8', children: [
                    {
                        id: 'f6-1', name: 'Consultation Global Logbook', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Tout le logbook (Trajets, Carburant, Maintenance, Incidents) est consultable centralisé via Gestion des Déplacements (FleetTrack). Pas d'export Excel, tout est dans l'app."
                    },
                    {
                        id: 'f6-2', name: 'Historique des réparations', type: 'function', isImplemented: true, description: "Détails complets des réparations visibles dans le global."
                    }
                ]
            },
            {
                id: 'c7', name: 'Planification des maintenances', type: 'category', color: '#8e24aa', children: [
                    {
                        id: 'f7-1', name: 'Alertes / suivi échéances', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Calcul auto (Km ou Date). Codes couleurs (Vert/Orange/Rouge). Alertes PWA et Global + Email superviseur."
                    },
                    {
                        id: 'f7-2', name: 'Programmation des opérations', type: 'function', isImplemented: false,
                        description: "Roadmap : Planifier une maintenance future visible dans le planning véhicule."
                    }
                ]
            },
            {
                id: 'c8', name: 'Tracking / suivi temps réel', type: 'category', color: '#ff5722', children: [
                    {
                        id: 'f8-1', name: 'Consultation position véhicules TR', type: 'function', isImplemented: true,
                        description: "Carte OpenLayers affichant la dernière position connue."
                    },
                    {
                        id: 'f8-2', name: 'Consultation historique des traces', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Replay des trajets. Comparaison possible entre trace Planifiée et trace Réelle (GPS)."
                    }
                ]
            },
            {
                id: 'c9', name: 'Suivi administratif', type: 'category', color: '#00bcd4', children: [
                    { id: 'f9-2', name: 'Suivi échéances admin véhicules', type: 'function', isImplemented: true, description: "Prise en compte échéance assurance." },
                    {
                        id: 'f9-4', name: 'Suivi échéances admin chauffeurs', type: 'function', isImplemented: false,
                        description: "Roadmap : Suivi expiration contrat et permis."
                    }
                ]
            },
            {
                id: 'c10', name: 'Gestion financière', type: 'category', color: '#9c27b0', children: [
                    {
                        id: 'f10-1', name: 'Suivi coûts récurrents', type: 'function', isImplemented: true, isExclusive: true,
                        description: "Champs 'Coût Assurance', 'Coût Location', 'Dépréciation' dans la fiche Véhicule. Inclus dans les rapports."
                    },
                    {
                        id: 'f10-6', name: 'Module Gestion des Coûts', type: 'function', isImplemented: false,
                        description: "Roadmap : Module complet gestion des coûts, tableaux de dépréciation..."
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
