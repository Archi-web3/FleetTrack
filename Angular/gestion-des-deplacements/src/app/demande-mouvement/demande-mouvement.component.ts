import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MouvementService } from '../mouvement.service';
import { UtilisateurService } from '../utilisateur.service';
import { VehiculeService } from '../vehicule.service';
import { ChauffeurService } from '../chauffeur.service';
import { LieuService } from '../lieu.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service'; // NOUVEAU : Importer AuthService

@Component({
  selector: 'app-demande-mouvement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-mouvement.component.html',
  styleUrls: ['./demande-mouvement.component.css']
})
export class DemandeMouvementComponent implements OnInit {

  mouvement = {
    lieuDepart: '',
    lieuArrivee: '',
    dateDepart: '',
    dateArrivee: '',
    demandeur: '', // Sera défini automatiquement
    vehicule: null as string | null, // <<< MODIFIÉ : Peut être null
    chauffeur: null as string | null, // <<< MODIFIÉ : Peut être null
    passagers: [] as string[], // NOUVEAU : Champ pour les passagers (IDs)
    materiel: '', // Exemple, si vous voulez l'ajouter au formulaire
    objectif: ''
  };

  utilisateurs: any[] = [];
  vehicules: any[] = [];
  chauffeurs: any[] = [];
  lieux: any[] = [];

  selectedLieuDepartOption: 'existing' | 'new' = 'existing';
  selectedLieuArriveeOption: 'existing' | 'new' = 'existing';

  newLieuDepart = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false };
  newLieuArrivee = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false };

  // Variable pour la sélection multiple des passagers
  selectedPassagersIds: string[] = [];

  // Filtrage des lieux
  showAllLieuxInPays: boolean = false;
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  // NOUVEAU : Case à cocher pour retour identique
  isRetourIdentique: boolean = false;

  onRetourIdentiqueChange(): void {
    if (this.isRetourIdentique) {
      if (this.selectedLieuDepartOption === 'existing') {
        this.selectedLieuArriveeOption = 'existing';
        this.mouvement.lieuArrivee = this.mouvement.lieuDepart;
      } else {
        // Cas complexe (nouveau lieu), on simplifie en désactivant la copie pour le "nouveau" mode
        // Ou on copie les champs newLieuDepart vers newLieuArrivee
        this.selectedLieuArriveeOption = 'new';
        this.newLieuArrivee = { ...this.newLieuDepart };
      }
    } else {
      // On reset éventuellement si l'utilisateur décoche, ou on laisse tel quel pour qu'il modifie
      this.mouvement.lieuArrivee = '';
    }
  }

  // NOUVEAU : Gestion des étapes intermédiaires
  etapes: any[] = [];

  constructor(
    private mouvementService: MouvementService,
    private utilisateurService: UtilisateurService,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private lieuService: LieuService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();
    this.loadData();
    // Définir le demandeur automatiquement
    this.mouvement.demandeur = this.authService.getUserId() || '';
  }

  loadData(): void {
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => this.utilisateurs = data,
      (error) => console.error('Erreur chargement utilisateurs:', error)
    );

    this.vehiculeService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );

    this.chauffeurService.getChauffeurs().subscribe(
      (data) => this.chauffeurs = data,
      (error) => console.error('Erreur chargement chauffeurs:', error)
    );

    this.lieuService.getLieux().subscribe(
      (data) => {
        // Par défaut, afficher tous les lieux pour SuperAdmin
        if (this.userProfile === 'SuperAdmin') {
          this.lieux = data;
          console.log('SuperAdmin: affichage de tous les lieux');
          return;
        }

        // Pour les autres utilisateurs, filtrer par base ou pays
        if (!this.userBaseId || !this.userPaysId) {
          console.warn('⚠️ Base ou Pays non défini pour l\'utilisateur');
          this.lieux = [];
          return;
        }

        if (this.showAllLieuxInPays) {
          // Afficher tous les lieux du pays
          this.lieux = data.filter((lieu: any) => {
            const lieuPaysId = typeof lieu.pays === 'string' ? lieu.pays : lieu.pays?._id;
            return lieuPaysId === this.userPaysId;
          });
          console.log(`Affichage des lieux du pays (${this.lieux.length} lieux)`);
        } else {
          // Afficher uniquement les lieux de la base (STRICT)
          this.lieux = data.filter((lieu: any) => {
            const lieuBaseId = typeof lieu.base === 'string' ? lieu.base : lieu.base?._id;
            return lieuBaseId === this.userBaseId;
          });
          console.log(`Affichage des lieux de la base (${this.lieux.length} lieux)`);
        }
      },
      (error) => console.error('Erreur chargement lieux:', error)
    );
  }

  // Basculer l'affichage des lieux
  toggleShowAllLieuxInPays(): void {
    this.showAllLieuxInPays = !this.showAllLieuxInPays;
    this.loadData();
  }

  // Gestion des étapes
  addEtape(): void {
    this.etapes.push({ lieu: '', dateArrivee: '', dateDepart: '' });
  }

  removeEtape(index: number): void {
    this.etapes.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    console.log('Tentative de soumission de demande...');

    try {
      // 1. Validation de base
      if (!this.mouvement.lieuDepart || !this.mouvement.lieuArrivee || !this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
        // Note exception: si on crée un nouveau lieu, lieuDepart/Arrivee peuvent être vide temporairement, 
        // mais ils seront remplis ci-dessous.
        // On vérifie les dates obligatoires
        if (!this.mouvement.dateDepart || !this.mouvement.dateArrivee) {
          alert('Veuillez renseigner les dates de départ et d\'arrivée.');
          return;
        }
      }

      // 2. Création des Lieux (si "Nouveau")
      // Gérer le nouveau lieu de départ si sélectionné
      if (this.selectedLieuDepartOption === 'new') {
        const nom = this.newLieuDepart.nom.trim();
        const adresse = this.newLieuDepart.adresse.trim();
        const lat = Number(this.newLieuDepart.coordonnees.latitude);
        const long = Number(this.newLieuDepart.coordonnees.longitude);

        if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
          alert("Veuillez remplir le nom, l'adresse et entrer des nombres valides pour la Latitude et la Longitude du nouveau lieu de départ.");
          return;
        }
        this.newLieuDepart.coordonnees.latitude = lat;
        this.newLieuDepart.coordonnees.longitude = long;

        console.log('Création nouveau lieu de départ:', this.newLieuDepart);
        const newDepartLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuDepart));
        this.mouvement.lieuDepart = newDepartLieu._id;
      }

      // Gérer le nouveau lieu d'arrivée si sélectionné
      if (this.selectedLieuArriveeOption === 'new') {
        const nom = this.newLieuArrivee.nom.trim();
        const adresse = this.newLieuArrivee.adresse.trim();
        const lat = Number(this.newLieuArrivee.coordonnees.latitude);
        const long = Number(this.newLieuArrivee.coordonnees.longitude);

        if (nom === '' || adresse === '' || isNaN(lat) || isNaN(long)) {
          alert("Veuillez remplir le nom, l'adresse et entrer des nombres valides pour la Latitude et la Longitude du nouveau lieu d'arrivée.");
          return;
        }
        this.newLieuArrivee.coordonnees.latitude = lat;
        this.newLieuArrivee.coordonnees.longitude = long;

        console.log('Création nouveau lieu d\'arrivée:', this.newLieuArrivee);
        const newArriveeLieu = await firstValueFrom(this.lieuService.addLieu(this.newLieuArrivee));
        this.mouvement.lieuArrivee = newArriveeLieu._id;
      }

      // 3. Construction du payload avec 'stops'
      // Le backend attend 'stops' : [ { lieu, dateDepart }, { lieu }, { lieu, dateArrivee } ]
      const stops = [];

      // Stop 0: Départ
      stops.push({
        lieu: this.mouvement.lieuDepart,
        dateDepart: this.mouvement.dateDepart
      });

      // Stops intermédiaires
      this.etapes.forEach(etape => {
        if (etape.lieu) {
          const stop: any = { lieu: etape.lieu };
          if (etape.dateArrivee) stop.dateArrivee = etape.dateArrivee;
          if (etape.dateDepart) stop.dateDepart = etape.dateDepart;
          stops.push(stop);
        }
      });

      // Stop Final: Arrivée
      stops.push({
        lieu: this.mouvement.lieuArrivee,
        dateArrivee: this.mouvement.dateArrivee
      });

      // Assigner les passagers sélectionnés
      this.mouvement.passagers = this.selectedPassagersIds;

      // Préparer l'objet final à envoyer
      const payload = {
        ...this.mouvement,
        stops: stops, // <<< L'array CRUCIAL
        // Nettoyer les champs plats si besoin, ou les laisser (le backend les ignore ou les écrase via pre-save)
      };

      console.log('Soumission du mouvement avec payload:', payload);

      this.mouvementService.addMouvement(payload).subscribe(
        (response) => {
          console.log('Mouvement créé avec succès:', response);
          alert('Demande de mouvement soumise !');
          this.router.navigate(['/']); // Rediriger vers la liste des mouvements
        },
        (error) => {
          console.error('Erreur lors de la soumission de la demande:', error);
          alert('Erreur lors de la soumission du mouvement. Vérifiez la console.');
        }
      );
    } catch (error: any) {
      console.error('Erreur générale dans onSubmit (création lieu ou mouvement):', error);
      alert('Une erreur est survenue lors du processus de soumission: ' + (error.message || ''));
    }
  }
}
