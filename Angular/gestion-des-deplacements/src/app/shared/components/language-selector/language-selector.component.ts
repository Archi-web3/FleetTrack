
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, TranslateModule],
    template: `
    <button mat-button [matMenuTriggerFor]="languageMenu">
      <span style="font-size: 1.2rem; margin-right: 5px;">{{ currentFlag }}</span>
      <span style="font-weight: 500;">{{ currentLang | uppercase }}</span>
      <mat-icon>arrow_drop_down</mat-icon>
    </button>
    <mat-menu #languageMenu="matMenu">
      <button mat-menu-item (click)="switchLanguage('fr')">
        <span style="margin-right: 8px;">🇫🇷</span> Français
      </button>
      <button mat-menu-item (click)="switchLanguage('en')">
        <span style="margin-right: 8px;">🇬🇧</span> English
      </button>
      <button mat-menu-item (click)="switchLanguage('es')">
        <span style="margin-right: 8px;">🇪🇸</span> Español
      </button>
    </mat-menu>
  `,
    styles: []
})
export class LanguageSelectorComponent {
    currentLang: string = 'fr';
    currentFlag: string = '🇫🇷';

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['fr', 'en', 'es']);
        this.translate.setDefaultLang('fr');

        const storedLang = localStorage.getItem('appLanguage');
        const browserLang = this.translate.getBrowserLang();
        let langToUse = storedLang || (browserLang && ['fr', 'en', 'es'].includes(browserLang) ? browserLang : 'fr');

        this.useLanguage(langToUse!);
    }

    useLanguage(language: string) {
        this.currentLang = language;
        this.translate.use(language);
        localStorage.setItem('appLanguage', language);
        this.updateFlag(language);
    }

    switchLanguage(language: string) {
        this.useLanguage(language);
    }

    updateFlag(lang: string) {
        switch (lang) {
            case 'fr': this.currentFlag = '🇫🇷'; break;
            case 'en': this.currentFlag = '🇬🇧'; break;
            case 'es': this.currentFlag = '🇪🇸'; break;
            default: this.currentFlag = '🇫🇷';
        }
    }
}
