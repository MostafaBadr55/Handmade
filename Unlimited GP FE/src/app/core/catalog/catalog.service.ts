import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../api/api.tokens';
import { Category, SubCategory, Product } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getCategories(): Observable<Category[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Category`).pipe(
      map((res) => this.mapCategories(res))
    );
  }

  getCategoryById(categoryId: number): Observable<Category | null> {
    return this.http.get<any>(`${this.baseUrl}/api/Category/${categoryId}`).pipe(
        map(item => this.mapCategory(item))
    );
  }

  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/SubCategories/GetallSubCategoryByCategoryId`, {
        params: { categoryId }
    }).pipe(
      map((res) => this.mapSubCategories(res))
    );
  }

  getHomeProducts(page: number, size: number): Observable<Product[]> {
      return this.http.get<any[]>(`${this.baseUrl}/api/Home/${page}/${size}`);
  }

  getPublicProducts(params: any): Observable<Product[]> {
      let httpParams = new HttpParams();
      Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined) {
              httpParams = httpParams.set(key, params[key]);
          }
      });
      return this.http.get<any[]>(`${this.baseUrl}/api/products/public`, { params: httpParams });
  }

  createCategory(payload: { name: string; description?: string; imageUrl?: string }) {
    return this.http.post(`${this.baseUrl}/api/Category`, payload);
  }

  createSubCategory(payload: { categoryId: number | string; name: string }) {
    return this.http.post(`${this.baseUrl}/api/SubCategories/CreateSubCategory`, payload);
  }

  private mapCategories(payload: any[]): Category[] {
    if (!Array.isArray(payload)) return [];
    return payload.map(item => this.mapCategory(item)).filter((x): x is Category => x !== null);
  }

  private mapCategory(item: any): Category | null {
      if (!item) return null;
      return {
          id: item.id || item.categoryId,
          nameEn: item.name || item.nameEn,
          nameAr: item.name || item.nameAr,
          imageUrl: item.imageUrl
      };
  }

  private mapSubCategories(payload: any[]): SubCategory[] {
    if (!Array.isArray(payload)) return [];
    return payload.map(item => ({
        id: item.id,
        categoryId: item.categoryId,
        nameEn: item.name || item.nameEn,
        nameAr: item.name || item.nameAr
    }));
  }
}
