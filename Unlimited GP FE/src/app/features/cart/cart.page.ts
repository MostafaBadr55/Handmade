import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, Cart, CartItem } from '../../core/cart/cart.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css',
  imports: [CommonModule, RouterLink, TPipe]
})
export class CartPage implements OnInit {
  private readonly cartService = inject(CartService);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(true);
  protected readonly updating = signal<number | null>(null); // productId being updated
  protected readonly error = signal<string | null>(null);
  protected readonly cart = signal<Cart | null>(null);

  protected readonly lang = computed(() => this.i18n.lang());
  protected readonly items = computed(() => this.cart()?.items ?? []);
  protected readonly totalPrice = computed(() => this.cart()?.totalPrice ?? 0);
  protected readonly totalItems = computed(() => this.cart()?.totalItems ?? this.items().length);
  protected readonly isEmpty = computed(() => this.items().length === 0);

  ngOnInit(): void {
    this.loadCart();
  }

  protected loadCart(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error.set(this.lang() === 'ar' ? 'فشل تحميل السلة' : 'Failed to load cart');
        this.loading.set(false);
      }
    });
  }

  incrementQuantity(item: CartItem): void {
    const newQty = item.quantity + 1;
    this.updateQuantity(item.productId, newQty);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item.productId);
      return;
    }
    const newQty = item.quantity - 1;
    this.updateQuantity(item.productId, newQty);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.updating.set(productId);
    this.cartService.updateItemQuantity(productId, quantity).subscribe({
      next: () => {
        // Update local state
        const current = this.cart();
        if (current) {
          const updatedItems = current.items.map((i) =>
            i.productId === productId ? { ...i, quantity, subtotal: (i.price ?? 0) * quantity } : i
          );
          const newTotal = updatedItems.reduce((sum, i) => sum + (i.subtotal ?? (i.price ?? 0) * i.quantity), 0);
          this.cart.set({ ...current, items: updatedItems, totalPrice: newTotal });
        }
        this.updating.set(null);
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.updating.set(null);
        // Reload cart to sync
        this.loadCart();
      }
    });
  }

  removeItem(productId: number): void {
    this.updating.set(productId);
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        // Update local state
        const current = this.cart();
        if (current) {
          const updatedItems = current.items.filter((i) => i.productId !== productId);
          const newTotal = updatedItems.reduce((sum, i) => sum + (i.subtotal ?? (i.price ?? 0) * i.quantity), 0);
          this.cart.set({ ...current, items: updatedItems, totalPrice: newTotal, totalItems: updatedItems.length });
        }
        this.updating.set(null);
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.updating.set(null);
        this.loadCart();
      }
    });
  }

  clearCart(): void {
    if (!confirm(this.lang() === 'ar' ? 'هل أنت متأكد من إفراغ السلة؟' : 'Are you sure you want to clear the cart?')) {
      return;
    }
    this.loading.set(true);
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set({ items: [], totalItems: 0, totalPrice: 0 });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.loading.set(false);
        this.loadCart();
      }
    });
  }

  getProductName(item: CartItem): string {
    return this.lang() === 'ar' ? (item.productNameAr || item.productName || '') : (item.productName || '');
  }
}
