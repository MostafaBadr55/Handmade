import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { ShopModel } from '../shop/shop.service';

export interface GetShopsParams {
  OwnerUserId?: number;
  Status?: string;
  MinRating?: number;
  MaxRating?: number;
  Name?: string;
  SortBy?: string;
  SortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface adminShopModel {
  id: number;
  ownerUserId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Rejected';
  ratingAverage: number;
}

export interface GetProductsParams {
  ShopId?: number;
  Status?: 'Active' | 'InActive';
  ApprovalStatus?: 'Pending' | 'Approved' | 'Rejected';
  IsPublished?: boolean;
  SortBy?: 'CreatedAt' | 'Price' | 'Title';
  SortDirection?: 'Asc' | 'Desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface AssignRoleRequest {
  userName: string;
  roleName: string;
}

export interface RejectRequest {
  rejectionMessage: string;
}

export interface ProductRejectRequest {
  productId: number;
  rejectionMessage: string;
}

export interface CategoryRequest {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface SubCategoryRequest {
  id?: number;
  categoryId: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  // ============ SHOPS ============
  getShops(params: GetShopsParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<any>(`${this.apiBaseUrl}/api/Admin/GetShops`, { params: httpParams });
  }

  getPendingShops(): Observable<ShopModel[]> {
    return this.http.get<ShopModel[]>(`${this.apiBaseUrl}/api/Admin/shops/pending`);
  }

  approveShop(shopId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/Admin/shops/${shopId}/approve`, null);
  }

  rejectShop(shopId: number, rejectionMessage: string): Observable<any> {
    const body = { rejectionMessage };
    console.debug('AdminService.rejectShop sending body:', body);
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/Admin/shops/${shopId}/reject`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ============ PRODUCTS ============
  getProducts(params: GetProductsParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<any>(`${this.apiBaseUrl}/api/Admin/products`, { params: httpParams });
  }

  approveProduct(productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/Admin/${productId}/approve`, null);
  }

  rejectProduct(productId: number, rejectionMessage: string): Observable<any> {
    const body: ProductRejectRequest = { productId, rejectionMessage };
    return this.http.post<any>(`${this.apiBaseUrl}/api/Admin/${productId}/reject`, body);
  }

  // ============ USERS ============
  assignRole(userName: string, roleName: string): Observable<any> {
    const body: AssignRoleRequest = { userName, roleName };
    return this.http.post<any>(`${this.apiBaseUrl}/api/Admin/users/assign-role`, body);
  }

  // ============ CATEGORIES ============
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/Category`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/Category/${id}`);
  }

  createCategory(payload: CategoryRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/Category`, payload);
  }

  updateCategory(payload: CategoryRequest): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/api/Category`, payload);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/api/Category/${id}`);
  }

  // ============ SUBCATEGORIES ============
  getAllSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/SubCategories/GetAllSubCategories`);
  }

  getSubCategoriesByCategoryId(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/SubCategories/GetallSubCategoryByCategoryId`, {
      params: { categoryId: String(categoryId) }
    });
  }

  getSubCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/SubCategories/GetSubCategoryById/${id}`);
  }

  createSubCategory(payload: SubCategoryRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/SubCategories/CreateSubCategory`, payload);
  }

  updateSubCategory(payload: SubCategoryRequest): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/api/SubCategories/UpdateSubCategory`, payload);
  }

  deleteSubCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/api/SubCategories/DeleteSubCategory/${id}`);
  }
}
