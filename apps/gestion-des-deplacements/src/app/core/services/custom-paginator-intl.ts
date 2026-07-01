import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  private translateService = inject(TranslateService);

  constructor() {
    super();

    this.translateService.onLangChange.subscribe((event: any) => {
      this.getTranslations();
    });

    this.getTranslations();
  }

  getTranslations() {
    this.translateService
      .get([
        'PAGINATOR.ITEMS_PER_PAGE',
        'PAGINATOR.NEXT_PAGE',
        'PAGINATOR.PREVIOUS_PAGE',
        'PAGINATOR.FIRST_PAGE',
        'PAGINATOR.LAST_PAGE',
        'PAGINATOR.OF',
      ])
      .subscribe((translations: any) => {
        this.itemsPerPageLabel = translations['PAGINATOR.ITEMS_PER_PAGE'] || 'Items per page:';
        this.nextPageLabel = translations['PAGINATOR.NEXT_PAGE'] || 'Next page';
        this.previousPageLabel = translations['PAGINATOR.PREVIOUS_PAGE'] || 'Previous page';
        this.firstPageLabel = translations['PAGINATOR.FIRST_PAGE'] || 'First page';
        this.lastPageLabel = translations['PAGINATOR.LAST_PAGE'] || 'Last page';
        this.changes.next();
      });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translateService.instant('PAGINATOR.OF')} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.translateService.instant('PAGINATOR.OF')} ${length}`;
  };
}
