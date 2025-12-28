import { Component, inject, signal, computed } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/admin/admin.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { ShopModel } from '../../core/shop/shop.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './admin-pending-shops.page.html',
  styleUrl: './admin-pending-shops.page.css',
  imports: [NgForOf, NgIf, FormsModule, TPipe]
})
export class AdminPendingShopsPage {
  private readonly admin = inject(AdminService);
  readonly i18n = inject(I18nService);

  protected readonly loading = signal(true);
  protected readonly serverError = signal<string | null>(null);
  protected readonly shops = signal<ShopModel[]>([]);
  protected readonly lang = computed(() => this.i18n.lang());
  protected readonly showRejectModal = signal(false);
  protected readonly currentRejectShop = signal<ShopModel | null>(null);
  protected readonly rejectionText = signal('');

  // property for binding with ngModel
  get rejectionTextValue(): string {
    return this.rejectionText();
  }
  set rejectionTextValue(v: string) {
    this.rejectionText.set(v || '');
  }

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.admin.getPendingShops().subscribe({
      next: (res) => {
        // normalize incoming shape so we always have `shopId` available
        const items = (res || []).map((s: any) => ({
          ...s,
          shopId: s.shopId ?? s.id ?? s.shopID ?? s.shopId
        }));
        this.shops.set(items as ShopModel[]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.serverError.set(err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل جلب المتاجر المعلقة.' : 'Failed to fetch pending shops.'));
        this.loading.set(false);
      }
    });
  }

  approve(shop: ShopModel) {
    console.log('approve clicked', shop?.shopId);
    if (!shop.shopId) return;
    this.admin.approveShop(shop.shopId).subscribe({
      next: () => {
        this.shops.set(this.shops().filter((s) => s.shopId !== shop.shopId));
      },
      error: (err) => {
        console.error(err);
        this.serverError.set(err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل الموافقة.' : 'Failed to approve.'));
      }
    });
  }

  // open reject modal so admin can type a reason
  reject(shop: ShopModel) {
    console.log('reject clicked', shop?.shopId);
    if (!shop || !shop.shopId) return;
    this.currentRejectShop.set(shop);
    this.rejectionText.set('');
    this.serverError.set(null);
    this.showRejectModal.set(true);
  }

  cancelReject() {
    this.currentRejectShop.set(null);
    this.rejectionText.set('');
    this.showRejectModal.set(false);
  }

  submitReject() {
    console.log('submitReject called');
    const shop = this.currentRejectShop();
    const reason = this.rejectionText().trim();
    if (!shop || !shop.shopId) return this.cancelReject();
    if (!reason) {
      this.serverError.set(this.lang() === 'ar' ? 'أدخل سبب الرفض.' : 'Please enter a rejection reason.');
      return;
    }

    console.log('calling admin.rejectShop', { shopId: shop.shopId, reason });

    this.admin.rejectShop(shop.shopId, reason).subscribe({
      next: () => {
        this.shops.set(this.shops().filter((s) => s.shopId !== shop.shopId));
        this.cancelReject();
      },
      error: (err) => {
        console.error(err);
        this.serverError.set(err?.error?.message || err?.message || (this.lang() === 'ar' ? 'فشل الرفض.' : 'Failed to reject.'));
      }
    });
  }
}
