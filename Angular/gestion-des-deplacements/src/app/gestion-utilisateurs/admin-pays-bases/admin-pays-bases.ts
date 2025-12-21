import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-pays-bases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './admin-pays-bases.html',
  styleUrls: ['./admin-pays-bases.css']
})
export class AdminPaysBasesComponent implements OnInit {
  paysList: any[] = [];
  baseList: any[] = [];

  newPays = { nom: '', code: '', devise: 'USD' };
  newBase = { nom: '', pays: '', code: '' };

  selectedPays: any = null;
  editingPays: any = null; // Pour l'édition
  editingBase: any = null; // Pour l'édition

  userProfile: string | null = null;

  constructor(
    private adminService: AdminService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.loadPays();
    this.loadBases();
  }

  loadPays() {
    this.adminService.getPays().subscribe(data => this.paysList = data);
  }

  loadBases() {
    this.adminService.getBases(this.selectedPays?._id).subscribe(data => this.baseList = data);
  }

  onPaysSelect(pays: any) {
    this.selectedPays = pays;
    this.newBase.pays = pays._id;
    this.loadBases();
  }

  // PAYS - Create/Update
  savePays() {
    if (!this.newPays.nom || !this.newPays.code) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editingPays) {
      // Update
      this.adminService.updatePays(this.editingPays._id, this.newPays).subscribe(() => {
        alert('Pays mis à jour avec succès');
        this.loadPays();
        this.cancelEditPays();
      }, error => {
        alert('Erreur lors de la mise à jour du pays');
        console.error(error);
      });
    } else {
      // Create
      this.adminService.addPays(this.newPays).subscribe(() => {
        alert('Pays créé avec succès');
        this.loadPays();
        this.newPays = { nom: '', code: '', devise: 'USD' };
      }, error => {
        alert('Erreur lors de la création du pays');
        console.error(error);
      });
    }
  }

  editPays(pays: any) {
    this.editingPays = pays;
    this.newPays = { nom: pays.nom, code: pays.code, devise: pays.devise };
  }

  cancelEditPays() {
    this.editingPays = null;
    this.newPays = { nom: '', code: '', devise: 'USD' };
  }

  deletePays(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pays ? Toutes les bases associées seront également supprimées.')) {
      return;
    }
    this.adminService.deletePays(id).subscribe(() => {
      alert('Pays supprimé avec succès');
      this.loadPays();
      if (this.selectedPays?._id === id) {
        this.selectedPays = null;
        this.baseList = [];
      }
    }, error => {
      alert('Erreur lors de la suppression du pays');
      console.error(error);
    });
  }

  // BASE - Create/Update
  saveBase() {
    if (!this.newBase.nom || !this.newBase.pays) {
      alert('Veuillez sélectionner un pays et remplir le nom de la base');
      return;
    }

    if (this.editingBase) {
      // Update
      this.adminService.updateBase(this.editingBase._id, this.newBase).subscribe(() => {
        alert('Base mise à jour avec succès');
        this.loadBases();
        this.cancelEditBase();
      }, error => {
        alert('Erreur lors de la mise à jour de la base');
        console.error(error);
      });
    } else {
      // Create
      this.adminService.addBase(this.newBase).subscribe(() => {
        alert('Base créée avec succès');
        this.loadBases();
        this.newBase.nom = '';
        this.newBase.code = '';
      }, error => {
        alert('Erreur lors de la création de la base');
        console.error(error);
      });
    }
  }

  editBase(base: any) {
    this.editingBase = base;
    this.newBase = { nom: base.nom, code: base.code || '', pays: base.pays._id || base.pays };
  }

  cancelEditBase() {
    this.editingBase = null;
    this.newBase = { nom: '', code: '', pays: this.selectedPays?._id || '' };
  }

  deleteBase(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette base ?')) {
      return;
    }
    this.adminService.deleteBase(id).subscribe(() => {
      alert('Base supprimée avec succès');
      this.loadBases();
    }, error => {
      alert('Erreur lors de la suppression de la base');
      console.error(error);
    });
  }
}
