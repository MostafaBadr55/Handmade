import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog/catalog.service';
import { HomeService } from '../../core/home/home.service';
import { Category } from '../../core/models/catalog.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, TPipe, RouterLink],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.css']
})
export class LandingPage {
  private catalogService = inject(CatalogService);
  private homeService = inject(HomeService);
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());

  categories = toSignal(this.catalogService.getCategories().pipe(
    catchError(() => of([]))
  ), { initialValue: [] as Category[] });

  products = toSignal(this.homeService.getHome(1, 20).pipe(
    map((res: any) => {
      if (Array.isArray(res)) return res;
      // Handle potential paginated response structures
      if (res && Array.isArray(res.items)) return res.items;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && Array.isArray(res.products)) return res.products;
      return [];
    }),
    catchError(() => of([]))
  ), { initialValue: [] as any[] });
}
