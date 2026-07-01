import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
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
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './generateur-guide.html',
  styleUrls: ['./generateur-guide.css'],
})
export class GenerateurGuideComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);

  services: any[] = [];
  langSub!: Subscription;

  ngOnInit() {
    this.updateServices();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.updateServices();
    });
  }

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }

  updateServices() {
    this.services = [
      {
        title: this.translate.instant('GENERATORS.GUIDE.SERVICES.A_TITLE'),
        frequence: 250,
        description: this.translate.instant('GENERATORS.GUIDE.SERVICES.A_DESC'),
        tasks: Object.values(this.translate.instant('GENERATORS.GUIDE.SERVICES.A_TASKS')),
      },
      {
        title: this.translate.instant('GENERATORS.GUIDE.SERVICES.B_TITLE'),
        frequence: 500,
        description: this.translate.instant('GENERATORS.GUIDE.SERVICES.B_DESC'),
        tasks: Object.values(this.translate.instant('GENERATORS.GUIDE.SERVICES.B_TASKS')),
      },
      {
        title: this.translate.instant('GENERATORS.GUIDE.SERVICES.C_TITLE'),
        frequence: 1000,
        description: this.translate.instant('GENERATORS.GUIDE.SERVICES.C_DESC'),
        tasks: Object.values(this.translate.instant('GENERATORS.GUIDE.SERVICES.C_TASKS')),
      },
      {
        title: this.translate.instant('GENERATORS.GUIDE.SERVICES.D_TITLE'),
        frequence: 3000,
        description: this.translate.instant('GENERATORS.GUIDE.SERVICES.D_DESC'),
        tasks: Object.values(this.translate.instant('GENERATORS.GUIDE.SERVICES.D_TASKS')),
      },
    ];
  }
}
