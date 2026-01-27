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
}

@Component({
    selector: 'app-functional-tree',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatTooltipModule, DragDropModule],
    templateUrl: './functional-tree.html',
    styleUrls: ['./functional-tree.css']
})
export class FunctionalTreeComponent {

    // Données initiales basées sur l'image XMind
    treeData: TreeNode = {
        id: 'root',
        name: 'Mouvements Terrain & Parc de Véhicules',
        type: 'root',
        children: [
            {
                id: 'c1', name: 'Paramétrage', type: 'category', color: '#000000', children: [ // Black
                    { id: 'f1-1', name: 'Gestion des utilisateurs : SSO + droits', type: 'function', isImplemented: true },
                    { id: 'f1-2', name: 'Gestion des employés (Core RH)', type: 'function' },
                    { id: 'f1-3', name: 'Gestion de la structure ACF : BP, bases...', type: 'function', isImplemented: true },
                    { id: 'f1-4', name: 'Gestion des contrats', type: 'function' },
                    { id: 'f1-5', name: 'Gestion des workflows de validation', type: 'function', isImplemented: true },
                    { id: 'f1-6', name: 'Gestion des lieux (départs/destinations)', type: 'function', isImplemented: true },
                    { id: 'f1-7', name: 'Gestion des véhicules', type: 'function', isImplemented: true },
                    { id: 'f1-8', name: 'Paramétrage checklists contrôle véhicule', type: 'function', isImplemented: true },
                    { id: 'f1-9', name: 'Paramétrage services type', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c2', name: 'Demandes de déplacement', type: 'category', color: '#ffca28', children: [ // Yellow/Amber
                    { id: 'f2-1', name: 'Edition de demandes', type: 'function', isImplemented: true },
                    { id: 'f2-2', name: 'Envoi pour validation', type: 'function', isImplemented: true },
                    { id: 'f2-3', name: 'Consultation des demandes', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c3', name: 'Validation des demandes', type: 'category', color: '#ffca28', children: [ // Yellow
                    { id: 'f3-1', name: 'Validations en fonction d\'un workflow et de droits associés', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c4', name: 'Affectation des mouvements', type: 'category', color: '#ffa726', children: [ // Orange
                    { id: 'f4-1', name: 'Définition du planning véhicules / chauffeurs', type: 'function', isImplemented: true },
                    { id: 'f4-2', name: 'Consolidation des mouvements (Regroupement)', type: 'function', isImplemented: true },
                    { id: 'f4-3', name: 'Consultation des disponibilités', type: 'function', isImplemented: true },
                    { id: 'f4-4', name: 'Affectation d\'un véhicule/chauffeur', type: 'function', isImplemented: true },
                    { id: 'f4-5', name: 'Consultation du planning des mouvements', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c5', name: 'Application chauffeur', type: 'category', color: '#f06292', children: [ // Pink
                    { id: 'f5-1', name: 'Consultation des déplacements prévus', type: 'function', isImplemented: true },
                    { id: 'f5-2', name: 'Enregistrement des mouvements (Logbook)', type: 'function', isImplemented: true },
                    { id: 'f5-3', name: 'Enregistrement carburant', type: 'function', isImplemented: true },
                    { id: 'f5-4', name: 'Réaliser le check quotidien / hebdo', type: 'function', isImplemented: true },
                    { id: 'f5-5', name: 'Information maintenance programmées', type: 'function', isImplemented: true },
                    { id: 'f5-6', name: 'Enregistrer une opération de maintenance', type: 'function', isImplemented: true },
                    { id: 'f5-7', name: 'Enregistrer une réparation', type: 'function' },
                    { id: 'f5-8', name: 'Déclarer un incident (technique ou sécu)', type: 'function', isImplemented: true },
                    { id: 'f5-9', name: 'Enregistrement position TR + Envoi serveur', type: 'function', isImplemented: true },
                    { id: 'f5-10', name: 'Envoi d\'alertes sécu', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c6', name: 'Consultation Logbook', type: 'category', color: '#ba68c8', children: [ // Purple Light
                    { id: 'f6-1', name: 'Consultation historique trajets', type: 'function', isImplemented: true },
                    { id: 'f6-2', name: 'Consultation historique carburants', type: 'function', isImplemented: true },
                    { id: 'f6-3', name: 'Consultation historique maintenances', type: 'function', isImplemented: true },
                    { id: 'f6-4', name: 'Consultation historique réparations', type: 'function' },
                    { id: 'f6-5', name: 'Consultation historique incidents', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c7', name: 'Planification des maintenances', type: 'category', color: '#8e24aa', children: [ // Purple Dark
                    { id: 'f7-1', name: 'Alertes sur maintenances à réaliser / suivi échéances', type: 'function', isImplemented: true },
                    { id: 'f7-2', name: 'Programmation des opérations dans les plannings', type: 'function', isImplemented: true } // Partiel
                ]
            },
            {
                id: 'c8', name: 'Tracking / suivi temps réel', type: 'category', color: '#ff5722', children: [ // Deep Orange
                    { id: 'f8-1', name: 'Consultation position véhicules TR', type: 'function', isImplemented: true },
                    { id: 'f8-2', name: 'Consultation historique des traces', type: 'function', isImplemented: true }
                ]
            },
            {
                id: 'c9', name: 'Suivi administratif', type: 'category', color: '#00bcd4', children: [ // Cyan
                    { id: 'f9-1', name: 'Suivi standards véhicules (équipement)', type: 'function' },
                    { id: 'f9-2', name: 'Suivi échéances admin véhicules', type: 'function' },
                    { id: 'f9-3', name: 'Suivi standards chauffeurs (formation)', type: 'function' },
                    { id: 'f9-4', name: 'Suivi échéances admin chauffeurs', type: 'function' }
                ]
            },
            {
                id: 'c10', name: 'Gestion financière', type: 'category', color: '#9c27b0', children: [ // Deep Purple
                    { id: 'f10-1', name: 'Suivi coûts récurrents (Assurance, Loc...)', type: 'function' },
                    { id: 'f10-2', name: 'Suivi coûts ponctuels (Maint/Rep)', type: 'function' },
                    { id: 'f10-3', name: 'Consolidation coûts par véhicule/mois', type: 'function' },
                    { id: 'f10-4', name: 'Ventilation des coûts (Analytique)', type: 'function', isImplemented: true },
                    { id: 'f10-5', name: 'Lien Polaris (Planification budgétaire)', type: 'function' }
                ]
            },
            {
                id: 'c11', name: 'Infos aux RH', type: 'category', color: '#3f51b5', children: [ // Indigo
                    { id: 'f11-1', name: 'Automatisation échanges RH (Perdiems, Hôtels...)', type: 'function' }
                ]
            },
            {
                id: 'c12', name: 'Tableaux de bord', type: 'category', color: '#009688', children: [ // Teal
                    { id: 'f12-1', name: 'KPIs Flotte & Environnement', type: 'function', isImplemented: true }
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
