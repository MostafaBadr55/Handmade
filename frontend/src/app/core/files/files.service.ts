import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';

export interface UploadResponse {
  url: string;
}

// Backend returns imageUrl, we normalize it to url
interface BackendUploadResponse {
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class FilesService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  upload(file: File, type = 'general'): Observable<UploadResponse> {
    const fd = new FormData();
    fd.append('file', file);
    const params = new HttpParams().set('type', type);
    return this.http.post<BackendUploadResponse>(`${this.apiBaseUrl}/api/Files/upload`, fd, { params }).pipe(
      map(res => ({ url: res.imageUrl }))
    );
  }
}
