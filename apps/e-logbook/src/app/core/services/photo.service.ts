import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface PhotoUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

export interface Photo {
  url?: string;
  publicId?: string;
  localUrl?: string;
  file?: File;
  synced: boolean;
  uploadedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  /**
   * Upload une photo vers Cloudinary
   */
  async uploadPhoto(
    file: File,
    type: 'incidents' | 'maintenances' | 'fuels' | 'trips',
    recordId: string,
    country: string,
    base: string,
  ): Promise<PhotoUploadResult> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    formData.append('recordId', recordId);
    formData.append('country', country);
    formData.append('base', base);

    try {
      const result = await firstValueFrom(
        this.http.post<PhotoUploadResult>(`${this.apiUrl}/upload`, formData),
      );
      return result;
    } catch (error) {
      console.error('❌ [PhotoService] Erreur upload:', error);
      throw error;
    }
  }

  /**
   * Supprimer une photo de Cloudinary
   */
  async deletePhoto(publicId: string): Promise<void> {
    // Encoder le publicId pour l'URL
    const encodedPublicId = publicId.replace(/\//g, '_');

    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/upload/${encodedPublicId}`));
    } catch (error) {
      console.error('❌ [PhotoService] Erreur suppression:', error);
      throw error;
    }
  }

  /**
   * Créer une URL locale pour affichage immédiat
   */
  createLocalUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Libérer une URL locale
   */
  revokeLocalUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Compresser une image avant upload (optionnel)
   */
  async compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality,
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }
}
