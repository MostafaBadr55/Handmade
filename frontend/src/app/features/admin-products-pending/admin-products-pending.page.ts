import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/admin/admin.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  imports: [RouterLink, TPipe],
  templateUrl: './admin-products-pending.page.html',
  styleUrl: './admin-products-pending.page.css'
})
export class AdminProductsPendingPage {
  private admin = inject(AdminService);
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());
  protected readonly loading = signal(true);
  protected readonly products = signal<any[]>([]);

  constructor() {
    // placeholder: actual service method may differ
    this.loading.set(false);
  }
}
