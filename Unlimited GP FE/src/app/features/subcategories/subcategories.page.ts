import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';

import { CatalogService } from '../../core/catalog/catalog.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  standalone: true,
  templateUrl: './subcategories.page.html',
  styleUrl: './subcategories.page.css',
  imports: [AsyncPipe, NgIf, NgFor, TPipe]
})
export class SubCategoriesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly i18n = inject(I18nService);

  protected readonly lang = computed(() => this.i18n.lang());

 private readonly categoryId$ = this.route.paramMap.pipe(
  map(p => Number(p.get('categoryId'))),
  // Optional but highly recommended safety check
  map(id => {
    if (Number.isNaN(id)) {
      throw new Error('Invalid categoryId');
    }
    return id;
  })
);

 protected readonly vm$ = this.categoryId$.pipe(
  switchMap((categoryId) =>
    combineLatest([
      this.catalog.getCategoryById(categoryId),
      this.catalog.getSubCategories(categoryId)
    ]).pipe(
      map(([category, subCategories]) => ({
        categoryId,
        category,
        subCategories
      }))
    )
  )
);

  protected back(): void {
    this.router.navigate(['/']);
  }
}
