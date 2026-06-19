import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-generateur-guide',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './generateur-guide.html',
  styleUrls: ['./generateur-guide.css']
})
export class GenerateurGuideComponent {
  services = [
    {
      title: 'Service A (250 Heures)',
      frequence: 250,
      description: 'Maintenance préventive de base, incluant la vérification visuelle, les ajustements et la vidange primaire.',
      tasks: [
        'Nettoyer le moteur (poussière/huile/échappement)',
        'Ajuster les cosses batterie et fixation batterie',
        'Ajuster les durites et collier de serrage',
        'Vérifier l\'état général, propreté, nettoyage de tâche de liquide',
        'Vérifier le niveau de liquide de refroidissement',
        'Vérifier les fuites d\'huiles, essence, liquide de refroidissement',
        'Vidanger le filtre d\'essence primaire (& secondaire) séparateur d\'eau',
        'Vérifier la courroie d\'alternateur & ventilateur',
        'Vérifier le niveau d\'électrolyte batterie (et faire l\'appoint si nécessaire)',
        'Vidanger l\'huile moteur & remplissage avec de l\'huile neuve adaptée',
        'Vidanger les condensats du silencieux d\'échappement',
        'Nettoyer le système de refroidissement (Faisceau radiateur)',
        'Nettoyer le tuyau ou bac reniflards d\'huile'
      ]
    },
    {
      title: 'Service B (500 Heures)',
      frequence: 500,
      description: 'Maintenance préventive intermédiaire, incluant le remplacement complet des filtres et vérification des tuyaux.',
      tasks: [
        'Toutes les tâches du Service A (250 Heures)',
        'Changer les filtres (huile, essence, liquide de refroidissement, air)',
        'Vérifier l\'intégralité des tuyaux et durites (huile/essence/liquide/air)'
      ]
    },
    {
      title: 'Service C (1000 Heures)',
      frequence: 1000,
      description: 'Maintenance préventive approfondie, ciblant les soupapes et le système de refroidissement.',
      tasks: [
        'Toutes les tâches du Service A & B (250h et 500h)',
        'Controler et ajuster le calage des soupapes (si nécessaire)',
        'Vidange Liquide de refroidissement (Rinçage & Nettoyage du circuit)'
      ]
    },
    {
      title: 'Service D (3000 Heures)',
      frequence: 3000,
      description: 'Maintenance préventive majeure, intervention sur les pièces d\'usure et chambres de combustion.',
      tasks: [
        'Toutes les tâches du Service A, B & C (250h, 500h et 1000h)',
        'Tester et/ou changer les injecteurs d\'essence / Changer toutes les courroies',
        'Ouvrir et nettoyer les chambres de combustion'
      ]
    }
  ];
}
