import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  imports: [RouterLink, TPipe],
  templateUrl: './admin-products-approved.page.html',
  styleUrl: './admin-products-approved.page.css'
})
export class AdminProductsApprovedPage {
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());
}
