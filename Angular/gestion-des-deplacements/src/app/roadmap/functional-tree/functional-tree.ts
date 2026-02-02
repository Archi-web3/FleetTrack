import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RoadmapService } from '../roadmap.service';
import { HttpClientModule } from '@angular/common/http';

export interface TreeNode {
    id: string;
    name: string;
    type: 'root' | 'category' | 'function';
    children?: TreeNode[];
    isImplemented?: boolean; // Pour le futur (statut)
    isExclusive?: boolean; // Fonctionnalité "FleetTrack" mise en avant
    color?: string; // Pour les lots
    description?: string; // Nouvelle "bulle d'info"
    lot?: number; // Phase de développement (1, 2, 3, 4)
    dataSource?: string[]; // Origin of the data (Flux, Manuel)
}

@Component({
    selector: 'app-functional-tree',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatTooltipModule, DragDropModule, HttpClientModule],
    templateUrl: './functional-tree.html',
    styleUrls: ['./functional-tree.css']
})
export class FunctionalTreeComponent implements OnInit {

    constructor(private roadmapService: RoadmapService) { }

    ngOnInit() {
        this.loadTree();
    }

    loadTree() {
        this.roadmapService.getFunctionalTree().subscribe(
            (data) => {
                if (data) {
                    this.treeData = data;
                }
            },
            (err) => {
                console.warn('Could not load existing tree, using default.', err);
                // On first load if 404, we might want to save the default to init the DB
                if (err.status === 404) {
                    this.saveTree();
                }
            }
        );
    }

    saveTree() {
        this.roadmapService.saveFunctionalTree(this.treeData).subscribe(
            (res) => {
                console.log('Tree saved successfully');
            },
            (err) => {
                console.error('Error saving tree', err);
            }
        );
    }

    toggleDataSource(node: TreeNode, source: string) {
        if (!node.dataSource) {
            node.dataSource = [];
        }
        const index = node.dataSource.indexOf(source);
        if (index > -1) {
            node.dataSource.splice(index, 1);
        } else {
            node.dataSource.push(source);
        }
        this.saveTree();
    }


    // Gestion de la sélection
    selectedNode: TreeNode | null = null;

    selectNode(node: TreeNode) {
        this.selectedNode = node;
        // Si c'est une catégorie vide ou root, on peut aussi l'éditer
    }

    deselectNode() {
        this.selectedNode = null;
    }

    printTree() {
        window.print();
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
                        id: 'f1-1', name: 'Gestion des utilisateurs : SSO + droits', type: 'function', isImplemented: true, lot: 1,
                        description: "Authentification locale (Email/Mot de passe crypté Bcrypt). Gestion fine des droits via le champ 'Profil' (RBAC) : SuperAdmin, Admin, Superviseur, Technicien, Guest, incluant un profil 'Superviseur Sécurité' spécifique."
                    },
                    {
                        id: 'f1-3', name: 'Gestion de la structure ACF : BP, bases...', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Modélisation complète : Collections 'Pays', 'Base', 'Lieux', 'Nom de projet'. Le système permet de créer des admins pays et gérer les affectations globales (Bases, Lieux, Utilisateurs, Véhicules)."
                    },
                    {
                        id: 'f1-5', name: 'Gestion des workflows de validation', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Workflow multiniveaux : Logistique ET Sécurité. Validation Sécurité obligatoire pour les zones sensibles AVANT l'organisation du mouvement."
                    },
                    {
                        id: 'f1-6', name: 'Gestion des lieux (départs/destinations)', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Collection 'Lieu' enrichie : Nom, Adresse, Coordonnées GPS. Niveaux de sécurité paramétrables (1 à 5) pour chaque lieu."
                    },
                    {
                        id: 'f1-7', name: 'Gestion des véhicules', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Fiche complète : Marque, Modèle, Immat, Statut (Propriété/Location), Données Admin (Assurances), Données Enviro (CO2) et Conso théorique vs réelle. Option pour activer/désactiver le tracking GPS par véhicule."
                    },
                    {
                        id: 'f1-8', name: 'Paramétrage checklists contrôle véhicule', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Intégré dans e-Logbook (PWA). Template modifiable directement dans l'outil avec ajout de liens vers instructions PDF pour chaque point de contrôle. Traçabilité complète des checks faits/non faits."
                    },
                    {
                        id: 'f1-9', name: 'Paramétrage services type', type: 'function', isImplemented: true, isExclusive: true, lot: 1,
                        description: "Liste des types de maintenance paramétrable avec possibilité de définir des intervalles par type de véhicule et liens vers instructions PDF."
                    }
                ]
            },
            {
                id: 'c11', name: 'Communication & Flux', type: 'category', color: '#009688', children: [
                    {
                        id: 'f11-1', name: '[NEW] Emails Transactionnels', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Envoi automatique d'emails pour les notifications de validation, refus, ou modification de statut de demande."
                    },
                    {
                        id: 'f11-2', name: '[NEW] Notifications Push (Mobile)', type: 'function', isImplemented: true, lot: 4,
                        description: "Envoi de notifications push sur les téléphones (PWA) pour les alertes de sécurité urgentes, même si l'application est fermée."
                    },
                    {
                        id: 'f11-3', name: '[NEW] Alertes Maintenance', type: 'function', isImplemented: true, lot: 4,
                        description: "Notifications automatiques aux gestionnaires de parc lorsque des maintenances sont dues (basé sur kilomètres ou date)."
                    }
                ]
            },
            {
                id: 'c2', name: 'Demandes de déplacement', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f2-1', name: 'Edition de demandes', type: 'function', isImplemented: true, isExclusive: true, lot: 2,
                        description: "Création uniquement dans FleetTrack (pas PWA). Formulaire riche : Mode (Routier, Air, Mer), Itinéraire (Multi-stops, GPS ou Lieux enregistrés), Passagers, Cargaison, Horaires. Projet affilié automatiquement au demandeur. Estimation automatique trajet (OSRM) et calcul heure arrivée."
                    },
                    {
                        id: 'f2-2', name: 'Envoi pour validation', type: 'function', isImplemented: true, isExclusive: true, lot: 2,
                        description: "Statut 'En attente' (Log ou Sécu). Email auto aux superviseurs (Sécu si zone sensible)."
                    },
                    {
                        id: 'f2-3', name: 'Consultation des demandes', type: 'function', isImplemented: true, lot: 2,
                        description: "Via le Planning Global et le menu 'Mes Mouvements'."
                    }
                ]
            },
            {
                id: 'c3', name: 'Validation des demandes', type: 'category', color: '#ffca28', children: [
                    {
                        id: 'f3-1', name: 'Workflow & Droits', type: 'function', isImplemented: true, isExclusive: true, lot: 2,
                        description: "Admin paramètre le niveau d'habilitation de chaque Superviseur Sécurité. Validation numérique centralisée."
                    }
                ]
            },
            {
                id: 'c4', name: 'Affectation des mouvements', type: 'category', color: '#ffa726', children: [
                    {
                        id: 'f4-1', name: 'Planning véhicules / chauffeurs', type: 'function', isImplemented: true, isExclusive: true, lot: 2,
                        description: "Code couleur des mouvements selon statut. Infos détaillées au survol (tooltip)."
                    },
                    {
                        id: 'f4-2', name: 'Consolidation (Regroupement)', type: 'function', isImplemented: true, isExclusive: true, lot: 2,
                        description: "Outil de regroupement pour optimisation. Sélection des mouvements à fusionner (étape, horaire, passagers). Visualisation cartographique des opportunités de consolidation."
                    },
                    {
                        id: 'f4-4', name: 'Affectation véhicule/chauffeur', type: 'function', isImplemented: true, lot: 2,
                        description: "Se fait à l'étape de consolidation après validations (Log & Sécu)."
                    },
                    { id: 'f4-5', name: 'Consultation planning', type: 'function', isImplemented: true, lot: 2, description: "Visuel des statuts sur planning semaine. Consultable aussi dans 'Mes mouvements'." },
                    {
                        id: 'f4-6', name: '[NEW] Filtre "En Attente"', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Bouton Toggle sur le planning global pour afficher/masquer les demandes en attente et éviter de polluer la vue par défaut."
                    },
                    {
                        id: 'f4-7', name: '[NEW] Indicateur Sécurité', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Statut spécifique 'En Attente Sécurité' visible sur le planning pour alerter les superviseurs des points de blocage."
                    }
                ]
            },
            {
                id: 'c5', name: 'Application chauffeur (PWA)', type: 'category', color: '#f06292', children: [
                    {
                        id: 'f5-1', name: 'Consultation Lieux & Horaires', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Dashboard 'Mes Missions'. Affiche le prochain trajet confirmé : Lieux, Horaires, Passagers (pas de carte interactive)."
                    },
                    {
                        id: 'f5-2', name: 'Enregistrement mouvements (Logbook)', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Start/Stop digital. Capture auto heure. Saisie manuelle Km réel. Reprise dernier Km enregistré. Détection mouvements affiliés pour prise en charge. Mouvements libres (non planifiés) possibles avec géoloc. Synchro Offline/Online automatique. Comparaison Planning vs Réel (Heures/Km)."
                    },
                    {
                        id: 'f5-11', name: '[NEW] Signature Décharge Visiteur', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Fonction permettant de faire signer directement sur l'écran du téléphone une décharge de responsabilité à un visiteur. Le template est pré-défini."
                    },
                    {
                        id: 'f5-3', name: 'Enregistrement carburant', type: 'function', isImplemented: true, lot: 3,
                        description: "Synchronisé avec le module Carburant de FleetTrack global."
                    },
                    {
                        id: 'f5-4', name: 'Check quotidien / hebdo', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Log automatique à chaque vérification (Date/Heure)."
                    },
                    {
                        id: 'f5-5', name: 'Information maintenance', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Suivi du template des checks service. Instructions accessibles. Validation complétion par Responsable (Admin/Superviseur) uniquement."
                    },
                    {
                        id: 'f5-8', name: 'Déclarer un incident', type: 'function', isImplemented: true, lot: 3,
                        description: "Formulaire déclaration d'incident."
                    },
                    {
                        id: 'f5-9', name: 'Position TR + Envoi serveur', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Tracking GPS passif (si activé). Comparaison trajet Réel vs Planifié dans FleetTrack."
                    },
                    {
                        id: 'f5-10', name: 'Réception alertes sécu', type: 'function', isImplemented: true, lot: 3,
                        description: "Réception des alertes envoyées par le superviseur depuis FleetTrack."
                    }
                ]
            },
            {
                id: 'c12', name: 'Pilotage & Statistiques', type: 'category', color: '#3f51b5', children: [
                    {
                        id: 'f12-1', name: '[NEW] Tableau de Bord Global', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Module de statistiques avancées avec filtres (Dates, Projets, Véhicules). Indicateurs clés : Distance totale, CO2 flotte, Consommation, Répartition par mode (Routier/Aérien/Maritime)."
                    },
                    {
                        id: 'f12-2', name: '[NEW] Impact Environnemental', type: 'function', isImplemented: true, lot: 4,
                        description: "Suivi des indicateurs environnementaux et plan d'action (Roadmap Verte/IAP) pour réduire l'empreinte carbone."
                    },
                    {
                        id: 'f12-3', name: '[NEW] Guide Utilisateur Intégré', type: 'function', isImplemented: true, lot: 4,
                        description: "Documentation complète et contextuelle intégrée directement dans l'application pour accompagner les utilisateurs."
                    }
                ]
            },
            {
                id: 'c6', name: 'Consultation Logbook', type: 'category', color: '#ba68c8', children: [
                    {
                        id: 'f6-1', name: 'Consultation Global Logbook', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Tout le logbook (Trajets, Carburant, Maintenance, Incidents) est consultable centralisé via Gestion des Déplacements (FleetTrack). Tout est dans l'app."
                    },
                    {
                        id: 'f6-2', name: 'Historique des réparations', type: 'function', isImplemented: true, lot: 3, description: "Détails complets des réparations visibles dans le global."
                    }
                ]
            },
            {
                id: 'c7', name: 'Planification des maintenances', type: 'category', color: '#8e24aa', children: [
                    {
                        id: 'f7-1', name: 'Alertes / suivi échéances', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Calcul auto (Km ou Date). Codes couleurs (Vert/Orange/Rouge). Alertes PWA et Global + Email superviseur."
                    },
                    {
                        id: 'f7-2', name: 'Programmation des opérations', type: 'function', isImplemented: false, lot: 4,
                        description: "Planifier une maintenance future visible dans le planning véhicule."
                    }
                ]
            },
            {
                id: 'c8', name: 'Tracking / suivi temps réel', type: 'category', color: '#ff5722', children: [
                    {
                        id: 'f8-1', name: 'Consultation position véhicules TR', type: 'function', isImplemented: true, lot: 3,
                        description: "Carte OpenLayers affichant la dernière position connue."
                    },
                    {
                        id: 'f8-2', name: 'Consultation historique des traces', type: 'function', isImplemented: true, isExclusive: true, lot: 3,
                        description: "Replay des trajets. Comparaison possible entre trace Planifiée et trace Réelle (GPS)."
                    }
                ]
            },
            {
                id: 'c9', name: 'Suivi administratif', type: 'category', color: '#00bcd4', children: [
                    { id: 'f9-2', name: 'Suivi échéances admin véhicules', type: 'function', isImplemented: true, lot: 1, description: "Prise en compte échéance assurance." },
                    {
                        id: 'f9-4', name: 'Suivi échéances admin chauffeurs', type: 'function', isImplemented: false, lot: 1,
                        description: "Suivi expiration contrat et permis."
                    }
                ]
            },
            {
                id: 'c10', name: 'Gestion financière', type: 'category', color: '#9c27b0', children: [
                    {
                        id: 'f10-1', name: 'Suivi coûts récurrents', type: 'function', isImplemented: true, isExclusive: true, lot: 4,
                        description: "Champs 'Coût Assurance', 'Coût Location', 'Dépréciation' dans la fiche Véhicule. Inclus dans les rapports."
                    },
                    {
                        id: 'f10-6', name: 'Module Gestion des Coûts', type: 'function', isImplemented: false, lot: 4,
                        description: "Module complet gestion des coûts, tableaux de dépréciation..."
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
        this.saveTree();
    }

    deleteNode(parentNode: TreeNode, nodeIndex: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            parentNode.children!.splice(nodeIndex, 1);
            this.saveTree();
        }
    }

    toggleImplementation(node: TreeNode) {
        node.isImplemented = !node.isImplemented;
        this.saveTree();
    }

    drop(event: CdkDragDrop<TreeNode[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            this.saveTree();
        }
    }
}
