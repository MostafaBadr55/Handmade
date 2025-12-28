import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';

export interface CartItem {
  productId: number;
  productName?: string;
  productNameAr?: string;
  imageUrl?: string;
  price?: number;
  quantity: number;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  totalItems?: number;
  totalPrice?: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  // Signal to track cart items count for badge
  private readonly _cartCount = signal<number>(0);
  readonly cartCount = computed(() => this._cartCount());

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiBaseUrl}/api/Cart`).pipe(
      tap((cart) => {
        this._cartCount.set(cart.totalItems ?? cart.items?.length ?? 0);
      })
    );
  }

  getCartSummary(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.apiBaseUrl}/api/Cart/summary`).pipe(
      tap((summary) => {
        this._cartCount.set(summary.totalItems ?? 0);
      })
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const body: AddToCartRequest = { productId, quantity };
    return this.http.post<any>(`${this.apiBaseUrl}/api/Cart/items`, body).pipe(
      tap(() => {
        this._cartCount.update((c) => c + quantity);
      })
    );
  }

  updateItemQuantity(productId: number, quantity: number): Observable<any> {
    const body: UpdateQuantityRequest = { quantity };
    return this.http.put<any>(`${this.apiBaseUrl}/api/Cart/items/${productId}`, body);
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/api/Cart/items/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/api/Cart`).pipe(
      tap(() => {
        this._cartCount.set(0);
      })
    );
  }

  // Refresh cart count from server
  refreshCartCount(): void {
    this.getCartSummary().subscribe({
      error: () => this._cartCount.set(0)
    });
  }
}
