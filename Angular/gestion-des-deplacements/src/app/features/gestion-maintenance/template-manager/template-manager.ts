import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-template-manager',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatDialogModule,
        MatTableModule,
        MatAutocompleteModule,
        TranslateModule
    ],
    templateUrl: './template-manager.html',
    styleUrls: ['./template-manager.scss']
})
export class TemplateManagerComponent implements OnInit {
    @ViewChild('templateFormDialog') templateFormDialog!: TemplateRef<any>;

    templates: any[] = [];
    selectedTemplate: any | null = null;
    templateForm: FormGroup;
    displayedColumns: string[] = ['icon', 'nom', 'type', 'coutParDefaut', 'taches', 'actions'];

    categories = [
        'Détection',
        'Moteur',
        'Roues/Pneus',
        'Pneus',
        'Batterie/Élec',
        'Électricité',
        'Éclairage',
        'Sécurité/Documents',
        'Sécurité',
        'Communication',
        'Nettoyage',
        'Finalisation',
        'Sous le Capot',
        'Extérieur',
        'Intérieur/Cabine',
        'Test Routier',
        'Autre'
    ];

    templateTypes = [
        'Hebdomadaire',
        'Service A',
        'Service B',
        'Service C',
        'Curative',
        'Préventive'
    ];

    get allTemplateTypes(): string[] {
        const customTypes = this.templates.map(t => t.type).filter(t => !!t);
        return Array.from(new Set([...this.templateTypes, ...customTypes])).sort();
    }

    constructor(
        private maintenanceService: MaintenanceService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.templateForm = this.fb.group({
            nom: ['', Validators.required],
            type: ['Hebdomadaire', Validators.required],
            coutParDefaut: [0, [Validators.min(0)]],
            actif: [true],
            taches: this.fb.array([])
        });
    }

    ngOnInit() {
        this.loadTemplates();
    }

    get taches() {
        return this.templateForm.get('taches') as FormArray;
    }

    loadTemplates() {
        this.maintenanceService.getTemplates().subscribe({
            next: (data) => this.templates = data,
            error: (err) => console.error('Erreur chargement templates:', err)
        });
    }

    selectTemplate(template: any) {
        this.selectedTemplate = template;

        // Clear existing tasks
        while (this.taches.length) {
            this.taches.removeAt(0);
        }

        // Add tasks from template
        template.taches.forEach((t: any) => {
            this.taches.push(this.fb.group({
                categorie: [t.categorie, Validators.required],
                description: [t.description, Validators.required],
                numeroTacheManuel: [t.numeroTacheManuel || ''],
                numero: [t.numero]
            }));
        });

        this.templateForm.patchValue({
            nom: template.nom,
            type: template.type,
            coutParDefaut: template.coutParDefaut || 0,
            actif: template.actif
        });

        this.dialog.open(this.templateFormDialog, {
            width: '1000px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true
        });
    }

    createTemplate() {
        this.selectedTemplate = null;
        this.templateForm.reset({
            nom: 'Nouvelle Checklist',
            type: 'Hebdomadaire',
            coutParDefaut: 0,
            actif: true
        });
        while (this.taches.length) {
            this.taches.removeAt(0);
        }

        this.dialog.open(this.templateFormDialog, {
            width: '1000px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    addTask() {
        this.taches.push(this.fb.group({
            categorie: [this.categories[0], Validators.required],
            description: ['', Validators.required],
            numeroTacheManuel: [''],
            numero: [this.taches.length + 1]
        }));
    }

    removeTask(index: number) {
        this.taches.removeAt(index);
    }

    saveTemplate() {
        if (this.templateForm.invalid) return;

        const templateData = this.templateForm.value;

        if (this.selectedTemplate) {
            this.maintenanceService.updateTemplate(this.selectedTemplate._id, templateData).subscribe({
                next: () => {
                    this.snackBar.open('Template mis à jour', 'OK', { duration: 3000 });
                    this.loadTemplates();
                    this.closeDialog();
                },
                error: (err) => console.error('Erreur MAJ:', err)
            });
        } else {
            this.maintenanceService.createTemplate(templateData).subscribe({
                next: () => {
                    this.snackBar.open('Template créé', 'OK', { duration: 3000 });
                    this.loadTemplates();
                    this.closeDialog();
                },
                error: (err) => console.error('Erreur création:', err)
            });
        }
    }

    deleteTemplate(template: any) {
        if (confirm(`Supprimer le template "${template.nom}" ?`)) {
            this.maintenanceService.deleteTemplate(template._id).subscribe({
                next: () => {
                    this.snackBar.open('Template supprimé', 'OK', { duration: 3000 });
                    this.loadTemplates();
                    if (this.selectedTemplate?._id === template._id) {
                        this.createTemplate();
                    }
                },
                error: (err) => console.error('Erreur suppression:', err)
            });
        }
    }
}
