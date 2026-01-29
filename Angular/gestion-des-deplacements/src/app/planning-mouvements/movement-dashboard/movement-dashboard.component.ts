import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-movement-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
    ],
    templateUrl: './movement-dashboard.component.html',
    styleUrls: ['./movement-dashboard.component.css']
})
export class MovementDashboardComponent implements OnChanges {
    @Input() movements: any[] = [];
    @Input() dateRangeLabel: string = '';

    // Data Source for Table
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // KPIs
    kpi = {
        total: 0,
        validated: 0,
        inProgress: 0,
        pending: 0,
        completed: 0,
        cancelled: 0
    };

    // Filters
    filterStatus: string = 'all';
    filterType: string = 'all';
    searchQuery: string = '';

    displayedColumns: string[] = ['statut', 'objectif', 'dateDepart', 'vehicule', 'chauffeur', 'demandeur'];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['movements']) {
            this.updateDashboard();
        }
    }

    updateDashboard(): void {
        if (!this.movements) return;

        // 1. Calculate KPIs
        this.kpi.total = this.movements.length;
        this.kpi.validated = this.movements.filter(m => m.statut === 'validé').length;
        this.kpi.inProgress = this.movements.filter(m => m.statut === 'en cours' || m.statut === 'pris en charge').length;
        this.kpi.pending = this.movements.filter(m => m.statut === 'en attente').length;
        this.kpi.completed = this.movements.filter(m => m.statut === 'terminé').length;
        this.kpi.cancelled = this.movements.filter(m => m.statut === 'annulé' || m.statut === 'refusé').length;

        // 2. Update Table Data
        this.applyFilters();
    }

    applyFilters(): void {
        let filtered = [...this.movements];

        // Status Filter
        if (this.filterStatus !== 'all') {
            filtered = filtered.filter(m => m.statut === this.filterStatus);
        }

        // Type/Mode Filter (optional if data available)
        if (this.filterType !== 'all') {
            // Assuming 'modeTransport' or similar exists, or infer depending on usage
            // For now, let's filter by some other property if needed or leave placeholder
        }

        // Search Query
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                (m.objectif?.toLowerCase().includes(q)) ||
                (m.demandeur?.nom?.toLowerCase().includes(q)) ||
                (m.vehicule?.immatriculation?.toLowerCase().includes(q))
            );
        }

        this.dataSource.data = filtered;

        // Reset paginator if set
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.paginator.firstPage();
        }
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getStatusColor(statut: string): string {
        switch (statut) {
            case 'validé': return 'primary';
            case 'en cours': return 'accent';
            case 'pris en charge': return 'accent';
            case 'terminé': return 'warn'; // Warn implies green/done in some themes or just distinct
            case 'annulé': return 'warn';
            default: return ''; // Default gray
        }
    }

    // Custom CSS classes for status badges
    getStatusClass(statut: string): string {
        switch (statut) {
            case 'validé': return 'status-validated';
            case 'en cours': return 'status-inprogress';
            case 'pris en charge': return 'status-inprogress';
            case 'terminé': return 'status-completed';
            case 'en attente': return 'status-pending';
            case 'annulé': case 'refusé': return 'status-cancelled';
            default: return 'status-default';
        }
    }
}
