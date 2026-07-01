import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-manual-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    PdfViewerModule,
  ],
  templateUrl: './manual-viewer.html',
  styleUrls: ['./manual-viewer.scss'],
})
export class ManualViewerComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ManualViewerComponent>>(MatDialogRef);
  data = inject<{
    page: number | string;
    fileName?: string;
  }>(MAT_DIALOG_DATA);

  pdfSrc = 'assets/manuals/manual.pdf'; // Path to manual in assets
  page = 1;
  zoom = 1.0;
  rotation = 0;
  originalSize = false;
  showAll = false;
  autoresize = true;
  renderText = true;
  isLoading = true;
  error: unknown = null;

  ngOnInit() {
    if (this.data) {
      if (this.data.page) {
        this.page =
          typeof this.data.page === 'string' ? parseInt(this.data.page, 10) : this.data.page;
      }
      if (this.data.fileName) {
        this.pdfSrc = 'assets/manuals/' + this.data.fileName;
      }
    }
  }

  onProgress(progressData: unknown) {
    this.isLoading = true;
  }

  onLoadComplete(pdf: unknown) {
    this.isLoading = false;
  }

  onError(error: unknown) {
    this.error = error;
    this.isLoading = false;
    console.error('PDF Error:', error);
  }

  zoomIn() {
    this.zoom += 0.25;
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.25;
    }
  }

  rotate() {
    this.rotation += 90;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  close() {
    this.dialogRef.close();
  }

  openExternal() {
    window.open(this.pdfSrc, '_blank');
  }
}
