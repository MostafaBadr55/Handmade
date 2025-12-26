import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  // fetch paged home data (products / featured items)
  getHome(page: number, size: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}/api/Home/${page}/${size}`);
  }

  // fetch single product by id (convenience)
  getProduct(productId: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}/api/products/${productId}`);
  }
}
