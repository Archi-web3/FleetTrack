import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

interface WorkflowStep {
  id: string;
  title: string;
  actor: string;
  description: string;
  icon: string;
  notifications: string[];
  enabled: boolean;
  canDisable: boolean;
}

interface WorkflowDef {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

@Component({
  selector: 'app-workflow-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule, MatSlideToggleModule, FormsModule, MatButtonModule],
  templateUrl: './workflow-dashboard.html',
  styleUrls: ['./workflow-dashboard.css']
})
export class WorkflowDashboardComponent implements OnInit {

  userProfile: string = '';

  workflows: WorkflowDef[] = [
    {
      id: 'mouvement',
      name: 'Validation de Mouvement',
      description: 'Processus standard de création et validation d\'un déplacement.',
      steps: [
        { id: 'req', title: 'Nouvelle Demande', actor: 'Utilisateur Demandeur', description: 'Le demandeur soumet une demande de mouvement via le formulaire.', icon: 'assignment', notifications: ['Logisticiens'], enabled: true, canDisable: false },
        { id: 'log', title: 'Consolidation Logistique', actor: 'Pôle Logistique', description: 'Le logisticien vérifie la demande, assigne un véhicule et un chauffeur.', icon: 'inventory_2', notifications: [], enabled: true, canDisable: false },
        { id: 'sec', title: 'Validation Sécurité', actor: 'Admin Sécurité', description: 'Évaluation des risques (Matrice Sécurité). Obligatoire si la zone est sensible.', icon: 'security', notifications: ['Logisticiens'], enabled: true, canDisable: true },
        { id: 'confirm', title: 'Mouvement Confirmé', actor: 'Système', description: 'Le mouvement est validé et prêt à démarrer.', icon: 'check_circle', notifications: ['Demandeur', 'Chauffeur'], enabled: true, canDisable: false }
      ]
    },
    {
      id: 'maintenance',
      name: 'Suivi de Maintenance',
      description: 'Cycle de vie d\'une maintenance (Alerte -> Garage -> Résolution).',
      steps: [
        { id: 'alert', title: 'Alerte Déclenchée', actor: 'Système', description: 'Une alerte est générée selon le plan de maintenance.', icon: 'warning', notifications: ['Logisticiens'], enabled: true, canDisable: false },
        { id: 'garage', title: 'Prise en charge Garage', actor: 'Logisticien', description: 'Le véhicule est envoyé au garage.', icon: 'build', notifications: ['Chauffeurs'], enabled: true, canDisable: true },
        { id: 'resolve', title: 'Facture & Clôture', actor: 'Logisticien', description: 'Saisie de la facture et remise en service.', icon: 'receipt', notifications: [], enabled: true, canDisable: false }
      ]
    }
  ];

  selectedWorkflow: WorkflowDef | null = null;

  ngOnInit() {
    this.userProfile = localStorage.getItem('userProfile') || 'SuperAdmin';
    this.selectedWorkflow = this.workflows[0];
  }

  selectWorkflow(wf: WorkflowDef) {
    this.selectedWorkflow = wf;
  }
}
