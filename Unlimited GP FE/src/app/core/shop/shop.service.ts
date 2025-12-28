import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';

export interface CreateShopRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface ShopModel {
  shopId?: number;
  shopName?: string;
  name?: string;
  ownerUserName?: string;
  description?: string;
  imageUrl?: string;
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Rejected' | string;
  rejectionMessage?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  createShop(payload: CreateShopRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/Shop/CreateShop`, payload);
  }

  getMyShop(pageNumber: number = 1, pageSize: number = 10): Observable<ShopModel | null> {
    return this.http.get<ShopModel>(`${this.apiBaseUrl}/api/Shop/GetMyShop?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  updateShop(payload: ShopModel): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/api/Shop/UpdateShop`, payload);
  }

  // Products within a shop
  createProduct(shopId: number | string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/shops/${shopId}/products`, payload);
  }

  getShopProducts(shopId: number | string, query: Record<string, any> = {}): Observable<any> {
    const params = new URLSearchParams();
    Object.keys(query).forEach((k) => params.set(k, String(query[k])));
    const q = params.toString() ? `?${params.toString()}` : '';
    return this.http.get<any>(`${this.apiBaseUrl}/api/shops/${shopId}/products${q}`);
  }
}
