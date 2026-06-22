import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { MouvementService } from '../../../core/services/mouvement.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule, CalendarView, CalendarEvent } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chauffeur-profile',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTabsModule, MatCardModule, 
    MatIconModule, MatButtonModule, MatTableModule, 
    MatFormFieldModule, MatInputModule, FormsModule, MatTooltipModule,
    CalendarModule
  ],
  templateUrl: './chauffeur-profile.html',
  styleUrls: ['./chauffeur-profile.scss']
})
export class ChauffeurProfileComponent implements OnInit {
  chauffeur: any = null;
  loading: boolean = true;
  
  mouvements: any[] = [];
  planning: any[] = [];
  
  mouvementsColumns: string[] = ['dateDepart', 'vehicule', 'objectif', 'statut'];
  planningColumns: string[] = ['dateDepart', 'vehicule', 'objectif'];

  newDocName: string = '';
  newDocUrl: string = '';

  // Calendar & Schedule
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = false;

  newSchedule: any = {
    status: 'On Duty',
    startDate: '',
    endDate: '',
    notes: ''
  };
  scheduleEntries: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService,
    private mouvementService: MouvementService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadChauffeur(id);
      this.loadMouvements(id);
    }
  }

  loadChauffeur(id: string): void {
    this.loading = true;
    this.utilisateurService.getUserById(id).subscribe({
      next: (data) => {
        this.chauffeur = data;
        if (!this.chauffeur.documents) {
          this.chauffeur.documents = [];
        }
        if (!this.chauffeur.schedules) {
          this.chauffeur.schedules = [];
        }
        this.scheduleEntries = this.chauffeur.schedules;
        this.buildCalendarEvents();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading chauffeur:', err);
        this.loading = false;
      }
    });
  }

  loadMouvements(id: string): void {
    this.mouvementService.getMouvementsByChauffeur(id).subscribe({
      next: (data) => {
        // Séparer les mouvements terminés du planning futur/en cours
        const now = new Date();
        this.mouvements = data.filter(m => m.statut === 'terminé' || m.statut === 'annulé');
        this.planning = data.filter(m => m.statut !== 'terminé' && m.statut !== 'annulé');
        
        // Tri par date
        this.mouvements.sort((a, b) => new Date(b.stops?.[0]?.dateDepart || 0).getTime() - new Date(a.stops?.[0]?.dateDepart || 0).getTime());
        this.planning.sort((a, b) => new Date(a.stops?.[0]?.dateDepart || 0).getTime() - new Date(b.stops?.[0]?.dateDepart || 0).getTime());
      },
      error: (err) => {
        console.error('Error loading mouvements:', err);
      }
    });
  }

  // --- SCHEDULE METHODS ---

  buildCalendarEvents(): void {
    this.events = this.scheduleEntries.map((sch: any) => {
      let color: any = { primary: '#1e90ff', secondary: '#D1E8FF' }; // On Duty
      if (sch.status === 'Off Duty') color = { primary: '#e3bc08', secondary: '#FDF1BA' };
      if (sch.status === 'Sick') color = { primary: '#ad2121', secondary: '#FAE3E3' };
      if (sch.status === 'Vacation') color = { primary: '#4caf50', secondary: '#E8F5E9' };

      return {
        start: new Date(sch.startDate),
        end: new Date(sch.endDate),
        title: `${sch.status} ${sch.notes ? '- ' + sch.notes : ''}`,
        color: color,
        allDay: true,
        meta: { schedule: sch }
      };
    });
    this.refresh.next();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  addSchedule(): void {
    if (!this.newSchedule.status || !this.newSchedule.startDate || !this.newSchedule.endDate) {
      alert('Veuillez remplir les champs obligatoires (Statut, Date début, Date fin).');
      return;
    }
    
    const newEntry = { ...this.newSchedule };
    const updatedSchedules = [...this.scheduleEntries, newEntry];
    
    this.updateSchedules(updatedSchedules, () => {
      // Reset form
      this.newSchedule = { status: 'On Duty', startDate: '', endDate: '', notes: '' };
    });
  }

  deleteSchedule(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      const updatedSchedules = [...this.scheduleEntries];
      updatedSchedules.splice(index, 1);
      this.updateSchedules(updatedSchedules);
    }
  }

  private updateSchedules(schedules: any[], onSuccess?: () => void): void {
    if (!this.chauffeur || !this.chauffeur._id) return;
    
    this.utilisateurService.updateUser(this.chauffeur._id, { schedules: schedules }).subscribe({
      next: (updatedUser) => {
        this.chauffeur.schedules = updatedUser.schedules;
        this.scheduleEntries = updatedUser.schedules;
        this.buildCalendarEvents();
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        console.error('Error updating schedules:', err);
        alert('Erreur lors de la mise à jour du planning.');
      }
    });
  }

  addLinkDocument(): void {
    if (!this.newDocName || !this.newDocUrl) return;
    
    const newDoc = {
      nom: this.newDocName,
      url: this.newDocUrl,
      typeSource: 'Lien',
      dateAjout: new Date()
    };
    
    this.updateDocuments([...this.chauffeur.documents, newDoc]);
    
    this.newDocName = '';
    this.newDocUrl = '';
  }

  uploadDocument(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    const formData = new FormData();
    formData.append('photo', file); // API requires 'photo' field name typically for Cloudinary upload
    
    // Simulate loading maybe?
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    
    this.http.post<any>(`${environment.apiUrl}/upload`, formData, { headers }).subscribe({
      next: (res) => {
        const newDoc = {
          nom: file.name,
          url: res.url || res.secure_url,
          typeSource: 'Upload',
          dateAjout: new Date()
        };
        
        this.updateDocuments([...this.chauffeur.documents, newDoc]);
      },
      error: (err) => {
        console.error('Error uploading file:', err);
        alert('Erreur lors du téléchargement du fichier.');
      }
    });
  }

  deleteDocument(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      const updatedDocs = [...this.chauffeur.documents];
      updatedDocs.splice(index, 1);
      this.updateDocuments(updatedDocs);
    }
  }

  private updateDocuments(docs: any[]): void {
    if (!this.chauffeur || !this.chauffeur._id) return;
    
    this.utilisateurService.updateUser(this.chauffeur._id, { documents: docs }).subscribe({
      next: (updatedUser) => {
        this.chauffeur.documents = updatedUser.documents;
      },
      error: (err) => {
        console.error('Error updating documents:', err);
        alert('Erreur lors de la mise à jour des documents.');
      }
    });
  }
}
