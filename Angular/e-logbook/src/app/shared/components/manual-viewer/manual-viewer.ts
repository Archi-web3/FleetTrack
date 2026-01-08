import { Component, Inject, OnInit } from '@angular/core';
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
        PdfViewerModule
    ],
    templateUrl: './manual-viewer.html',
    styleUrls: ['./manual-viewer.scss']
})
export class ManualViewerComponent implements OnInit {
    pdfSrc = 'assets/manual.pdf'; // Path to manual in assets
    page = 1;
    zoom = 1.0;
    rotation = 0;
    originalSize = false;
    showAll = false;
    autoresize = true;
    renderText = true;
    isLoading = true;
    error: any = null;

    constructor(
        public dialogRef: MatDialogRef<ManualViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { page: number | string }
    ) { }

    ngOnInit() {
        if (this.data && this.data.page) {
            this.page = typeof this.data.page === 'string' ? parseInt(this.data.page, 10) : this.data.page;
        }
    }

    onProgress(progressData: any) {
        this.isLoading = true;
    }

    onLoadComplete(pdf: any) {
        this.isLoading = false;
    }

    onError(error: any) {
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
}
