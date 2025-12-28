import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../core/shop/shop.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  imports: [TPipe],
  templateUrl: './manage.page.html',
  styleUrl: './manage.page.css'
})
export class MyShopManagePage {
  private readonly router = inject(Router);
  private readonly shopService = inject(ShopService);
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());

  constructor() {
    // if the shop is still pending or missing, redirect back to My Shop overview
    this.shopService.getMyShop().subscribe({
      next: (s) => {
        const status = (s?.status || '').toString().toLowerCase();
        if (!s || status === 'pending' || status === 'rejected') {
          this.router.navigate(['/my-shop']);
        }
      },
      error: () => this.router.navigate(['/my-shop'])
    });
  }

  addProduct() {
    // Navigate to an add product page, or open a modal
  }

  manageCategories() {
    // Navigate to a category management page
  }

  manageSubCategories() {
    // Navigate to a sub-category management page
  }
}
