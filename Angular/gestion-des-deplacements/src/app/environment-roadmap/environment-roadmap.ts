import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnvironmentService } from '../environment.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-environment-roadmap',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatTableModule,
    MatExpansionModule, MatSnackBarModule, MatTooltipModule,
    BaseChartDirective
  ],
  templateUrl: './environment-roadmap.html',
  styleUrls: ['./environment-roadmap.css']
})
export class EnvironmentRoadmapComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentBase = 'Goma'; // TODO: Dynamique depuis User Profile
  years = [2024, 2025, 2026, 2027];
  months = [
    { id: 1, name: 'Janvier' }, { id: 2, name: 'Février' }, { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' }, { id: 5, name: 'Mai' }, { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' }, { id: 8, name: 'Août' }, { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' }, { id: 11, name: 'Novembre' }, { id: 12, name: 'Décembre' }
  ];

  // --- ACTIONS ---
  actionsT1: any[] = [];
  actionsT2: any[] = [];
  actionsT3: any[] = [];
  actionsT4: any[] = [];
  newAction = {
    category: '', action: '', status: 'Non commencé', impact_estimated: '', quarter: 'T1', comments: ''
  };
  leviers = [
    'Pooling', 'Planification', 'Choix Véhicule', 'Eco-conduite',
    'Maintenance', 'Substitution', 'Géolocalisation', 'Stock Carburant',
    'Générateurs', 'Politique Transport', 'Autre'
  ];

  // --- DATA ENTRY ---
  selectedMonth = new Date().getMonth() + 1;
  monthlyData: any = {
    fleet_km_total: 0, fleet_liters_total: 0,
    energy_gen_hours: 0, energy_gen_liters: 0, energy_grid_kwh: 0,
    driver_nb_projects: 0, driver_nb_sites: 0, driver_staff_fte: 0,
    driver_financial_volume: 0, driver_km_passengers: 0, driver_km_cargo: 0, driver_tonnage: 0
  };
  iapScore = 0;

  // --- ANALYTICS ---
  chartData: any[] = [];
  chartLabels: string[] = [];

  // Chart Config
  public barChartOptions: ChartConfiguration['options'] = { responsive: true };
  public barChartData: ChartData = { labels: [], datasets: [] };
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  // --- UI STATE ---
  showGuide = false;
  targetPercent = 5;

  constructor(
    private envService: EnvironmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Show guide by default on first visit?
    this.showGuide = true;
    this.loadActions();
    this.loadDataForChart();
  }

  // --- ACTIONS LOGIC ---
  loadActions() {
    this.envService.getActions(this.currentYear, this.currentBase).subscribe(res => {
      this.actionsT1 = res.filter(a => a.quarter === 'T1');
      this.actionsT2 = res.filter(a => a.quarter === 'T2');
      this.actionsT3 = res.filter(a => a.quarter === 'T3');
      this.actionsT4 = res.filter(a => a.quarter === 'T4');
    });
  }

  addAction() {
    const actionToSave = { ...this.newAction, year: this.currentYear, base: this.currentBase };
    this.envService.createAction(actionToSave).subscribe(() => {
      this.snackBar.open('Action ajoutée', 'OK', { duration: 3000 });
      this.loadActions();
      this.newAction = { category: '', action: '', status: 'Non commencé', impact_estimated: '', quarter: 'T1', comments: '' }; // Reset
    });
  }

  updateActionStatus(action: any, newStatus: string) {
    action.status = newStatus;
    this.envService.updateAction(action._id, { status: newStatus }).subscribe();
  }

  deleteAction(id: string) {
    if (!confirm('Supprimer cette action ?')) return;
    this.envService.deleteAction(id).subscribe(() => this.loadActions());
  }

  // --- DATA LOGIC ---
  loadMonthlyData() {
    // Check if data exists locally or fetch
    // Simple version: just fetch aggregation for now
    this.envService.getAggregatedStats(this.currentYear, this.selectedMonth, this.currentBase).subscribe(res => {
      // Pre-fill fields if 0 (don't overwrite user edits generally, but here for demo/simplicity)
      if (res) {
        this.monthlyData.fleet_km_total = res.fleet_km_total || 0;
        this.monthlyData.fleet_liters_total = res.fleet_liters_total || 0;
        this.autoCalculateIAP();
        this.snackBar.open('Données auto-calculées chargées', 'Cool', { duration: 2000 });
      }
    });
  }

  saveMonthlyData() {
    const payload = {
      ...this.monthlyData,
      year: this.currentYear,
      month: this.selectedMonth,
      base: this.currentBase,
      metrics_iap_score: this.iapScore
      // Add other calcs
    };
    this.envService.saveData(payload).subscribe(() => {
      this.snackBar.open('Données mensuelles sauvegardées', 'OK', { duration: 3000 });
      this.loadDataForChart();
    });
  }

  autoCalculateIAP() {
    // Placeholder IAP Logic displayed (Client side approx)
    this.iapScore =
      (this.monthlyData.driver_nb_projects * 10) +
      (this.monthlyData.driver_staff_fte * 1);
  }

  // --- CHARTS ---
  loadDataForChart() {
    this.envService.getData(this.currentYear, this.currentBase).subscribe(data => {
      this.chartLabels = data.map(d => this.months.find(m => m.id === d.month)?.name || '');

      const litres = data.map(d => d.fleet_liters_total + d.energy_gen_liters);
      const activity = data.map(d => d.driver_staff_fte); // Example driver

      // Calculate Target Line (Baseline - Target%)
      // For simplified demo, let's say Baseline is Avg of previous points or fixed
      const avgConso = litres.length ? litres.reduce((a, b) => a + b, 0) / litres.length : 1000;
      const targetVal = avgConso * (1 - (this.targetPercent / 100));
      const targetLine = new Array(litres.length).fill(targetVal);

      this.barChartData = {
        labels: this.chartLabels,
        datasets: [
          { data: litres, label: 'Conso Totale (L)', backgroundColor: '#005FB6', order: 2 },
          { data: activity, label: 'Activité (Staff)', backgroundColor: '#ff9800', type: 'line' as const, order: 1 },
          {
            data: targetLine,
            label: `Objectif (-${this.targetPercent}%)`,
            type: 'line' as const,
            borderColor: '#4caf50',
            borderDash: [5, 5],
            pointRadius: 0,
            order: 0
          }
        ]
      };
    });
  }
}
