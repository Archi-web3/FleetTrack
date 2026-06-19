import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenerateursService, Generateur } from '../../../core/services/generateurs.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-generateur-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './generateur-form.html',
  styleUrls: ['./generateur-form.css']
})
export class GenerateurFormComponent implements OnInit {
  generateurId: string | null = null;
  loading = false;
  bases: any[] = [];
  paysList: any[] = [];

  generateur: Generateur = {
    marque: '',
    modele: '',
    puissanceKVA: 0,
    numeroSerie: '',
    numeroMoteur: '',
    acfCode: '',
    categorie: '',
    proprietaire: '',
    typeCarburant: 'Diesel',
    anneeFabrication: new Date().getFullYear(),
    anneePremiereUtilisation: new Date().getFullYear(),
    coutAssuranceAnnuel: 0,
    dateCommencement: new Date(),
    base: '',
    pays: '',
    siteInstallation: '',
    statut: 'Actif',
    heuresInitiales: 0,
    heuresFonctionnement: 0,
    consommationTheorique: 0,
    remarques: ''
  };

  carburantTypes = ['Diesel', 'Essence', 'Autre'];
  statuts = ['Actif', 'En maintenance', 'En panne', 'Hors service'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generateursService: GenerateursService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.generateurId = this.route.snapshot.paramMap.get('id');
    this.loadReferentials();
  }

  loadReferentials() {
    // Load bases and pays
    this.http.get<any[]>(`${environment.apiUrl}/bases`).subscribe(bases => this.bases = bases);
    this.http.get<any[]>(`${environment.apiUrl}/pays`).subscribe(pays => this.paysList = pays);

    if (this.generateurId) {
      this.loadGenerateur();
    }
  }

  loadGenerateur() {
    this.loading = true;
    this.generateursService.getGenerateur(this.generateurId!).subscribe({
      next: (data) => {
        // Handle populated values to just set ID for select bindings
        if (data.base && typeof data.base === 'object') {
          data.base = data.base._id;
        }
        if (data.pays && typeof data.pays === 'object') {
          data.pays = data.pays._id;
        }
        this.generateur = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement', 'Fermer');
        this.router.navigate(['/gestion-generateurs']);
      }
    });
  }

  save() {
    this.loading = true;
    
    // Si nouveau, on met les heures de fonctionnement aux heures initiales
    if (!this.generateurId && this.generateur.heuresFonctionnement === 0) {
      this.generateur.heuresFonctionnement = this.generateur.heuresInitiales || 0;
    }

    if (this.generateurId) {
      this.generateursService.updateGenerateur(this.generateurId, this.generateur).subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.onError(err)
      });
    } else {
      this.generateursService.createGenerateur(this.generateur).subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.onError(err)
      });
    }
  }

  onSuccess() {
    this.snackBar.open('Générateur enregistré avec succès', 'OK', { duration: 3000 });
    this.router.navigate(['/gestion-generateurs']);
  }

  onError(err: any) {
    this.loading = false;
    console.error(err);
    this.snackBar.open('Erreur lors de la sauvegarde (Vérifiez le Numéro de Série unique)', 'Fermer', { duration: 5000 });
  }
}
