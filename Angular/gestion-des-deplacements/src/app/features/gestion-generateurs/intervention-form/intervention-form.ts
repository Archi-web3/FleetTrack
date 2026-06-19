import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenerateursService, Generateur } from '../../../core/services/generateurs.service';

@Component({
  selector: 'app-intervention-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './intervention-form.html',
  styleUrls: ['./intervention-form.css']
})
export class InterventionFormComponent implements OnInit {
  generateurId!: string;
  generateur!: Generateur;
  loading = true;

  intervention: any = {
    typeIntervention: 'Préventive',
    frequence: null,
    nomIntervenant: '',
    dateIntervention: new Date(),
    heuresActuelles: 0,
    prochaineMaintenanceHeures: 0,
    datePrevisionnelleProchaine: null,
    checklist: {},
    descriptionPanne: '',
    observations: '',
    piecesUtilisees: [],
    testCondition: 'Fonctionnement normal',
    faitA: '',
    signatureIntervenant: false,
    signatureResponsable: false,
    statut: 'Complété'
  };

  frequences = [250, 500, 1000, 3000];

  // Définition de la checklist complète ACF basée sur les heures
  tasks250 = [
    { id: 'nettoyerMoteur', label: 'Nettoyer le moteur (poussière/huile/échappement)' },
    { id: 'ajusterCosses', label: 'Ajuster les cosses batterie et fixation batterie' },
    { id: 'ajusterDurites', label: 'Ajuster les durites et collier de serrage' },
    { id: 'verifierEtat', label: 'Vérifier l\'état général, propreté, nettoyage de tâche de liquide' },
    { id: 'verifierNivRefr', label: 'Vérifier le niveau de liquide de refroidissement' },
    { id: 'verifierFuites', label: 'Vérifier les fuites d\'huiles, essence, liquide de refroidissement' },
    { id: 'vidangerFiltreFuel', label: 'Vidanger le filtre d\'essence primaire (& secondaire) séparateur d\'eau' },
    { id: 'verifierCourroie', label: 'Vérifier la courroie d\'alternateur & ventilateur' },
    { id: 'verifierNivBatt', label: 'Vérifier le niveau d\'électrolyte batterie (et faire l\'appoint si nécessaire)' },
    { id: 'vidangerHuile', label: 'Vidanger l\'huile moteur & remplissage avec de l\'huile neuve adaptée' },
    { id: 'vidangerCondensats', label: 'Vidanger les condensats du silencieux d\'échappement' },
    { id: 'nettoyerRefroidissement', label: 'Nettoyer le système de refroidissement (Faisceau radiateur)' },
    { id: 'nettoyerReniflard', label: 'Nettoyer le tuyau ou bac reniflards d\'huile' }
  ];

  tasks500 = [
    { id: 'changerFiltres', label: 'Changer les filtres (huile, essence, liquide de refroidissement, air)' },
    { id: 'verifierTuyaux', label: 'Vérifier l\'intégralité des tuyaux et durites (huile/essence/liquide/air)' }
  ];

  tasks1000 = [
    { id: 'calageSoupapes', label: 'Controler et ajuster le calage des soupapes (si nécessaire)' },
    { id: 'vidangeLiquideRefr', label: 'Vidange Liquide de refroidissement (Rinçage & Nettoyage du circuit)' }
  ];

  tasks3000 = [
    { id: 'testerInjecteurs', label: 'Tester et/ou changer les injecteurs d\'essence / Changer toutes les courroies' },
    { id: 'nettoyerChambre', label: 'Ouvrir et nettoyer les chambres de combustion' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generateursService: GenerateursService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generateurId = this.route.snapshot.paramMap.get('generateurId') || '';
    if (this.generateurId) {
      this.loadGenerateur();
    }
  }

  loadGenerateur() {
    this.generateursService.getGenerateur(this.generateurId).subscribe({
      next: (data) => {
        this.generateur = data;
        this.intervention.heuresActuelles = this.generateur.heuresFonctionnement;
        // Pre-fill user data if possible here (nomIntervenant)
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement', 'Fermer');
        this.router.navigate(['/gestion-generateurs']);
      }
    });
  }

  onTypeChange() {
    if (this.intervention.typeIntervention === 'Curative') {
      this.intervention.frequence = null;
    }
  }

  onFrequenceChange() {
    // Calcul de la prochaine maintenance auto
    if (this.intervention.frequence) {
      this.intervention.prochaineMaintenanceHeures = this.intervention.heuresActuelles + this.intervention.frequence;
    }
  }

  addPiece() {
    this.intervention.piecesUtilisees.push({ reference: '', details: '', quantite: 1 });
  }

  removePiece(index: number) {
    this.intervention.piecesUtilisees.splice(index, 1);
  }

  saveIntervention() {
    this.generateursService.createIntervention(this.generateurId, this.intervention).subscribe({
      next: () => {
        this.snackBar.open('Intervention enregistrée avec succès', 'OK', { duration: 3000 });
        this.router.navigate(['/gestion-generateurs']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer');
      }
    });
  }

  getTasksToShow() {
    if (this.intervention.typeIntervention !== 'Préventive' || !this.intervention.frequence) {
      return [];
    }
    
    let tasks: any[] = [];
    if (this.intervention.frequence >= 250) tasks = tasks.concat(this.tasks250);
    if (this.intervention.frequence >= 500) tasks = tasks.concat(this.tasks500);
    if (this.intervention.frequence >= 1000) tasks = tasks.concat(this.tasks1000);
    if (this.intervention.frequence >= 3000) tasks = tasks.concat(this.tasks3000);
    return tasks;
  }
}
