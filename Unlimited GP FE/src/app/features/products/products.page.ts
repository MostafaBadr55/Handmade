import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog/catalog.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css'
})
export class ProductsPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());

  loading = signal(false);
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  subCategories = signal<any[]>([]);

  // Filters
  filters = signal({
    CategoryId: null as number | null,
    SubCategoryId: null as number | null,
    MinPrice: null as number | null,
    MaxPrice: null as number | null,
    Search: '',
    SortBy: '',
    SortDirection: '',
    pageNumber: 1,
    pageSize: 20
  });

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.catalogService.getCategories().subscribe({
      next: (res) => this.categories.set(res || []),
      error: () => {}
    });
  }

  loadSubCategories(categoryId: number) {
    if (!categoryId) {
      this.subCategories.set([]);
      return;
    }
    this.catalogService.getSubCategories(String(categoryId)).subscribe({
      next: (res) => this.subCategories.set(res || []),
      error: () => this.subCategories.set([])
    });
  }

  loadProducts() {
    this.loading.set(true);
    const f = this.filters();
    const params: any = {
      pageNumber: f.pageNumber,
      pageSize: f.pageSize
    };
    if (f.CategoryId) params.CategoryId = f.CategoryId;
    if (f.SubCategoryId) params.SubCategoryId = f.SubCategoryId;
    if (f.MinPrice !== null) params.MinPrice = f.MinPrice;
    if (f.MaxPrice !== null) params.MaxPrice = f.MaxPrice;
    if (f.Search) params.Search = f.Search;
    if (f.SortBy) params.SortBy = f.SortBy;
    if (f.SortDirection) params.SortDirection = f.SortDirection;

    this.catalogService.getPublicProducts(params).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res) ? res : res.items || res.data || [];
        this.products.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  // Filter update methods
  updateCategory(value: string) {
    const catId = value ? +value : null;
    this.filters.update(f => ({ ...f, CategoryId: catId, SubCategoryId: null }));
    if (catId) {
      this.loadSubCategories(catId);
    } else {
      this.subCategories.set([]);
    }
    this.loadProducts();
  }

  updateSubCategory(value: string) {
    this.filters.update(f => ({ ...f, SubCategoryId: value ? +value : null }));
    this.loadProducts();
  }

  updateMinPrice(value: string) {
    this.filters.update(f => ({ ...f, MinPrice: value ? +value : null }));
  }

  updateMaxPrice(value: string) {
    this.filters.update(f => ({ ...f, MaxPrice: value ? +value : null }));
  }

  updateSearch(value: string) {
    this.filters.update(f => ({ ...f, Search: value }));
  }

  updateSortBy(value: string) {
    this.filters.update(f => ({ ...f, SortBy: value }));
    this.loadProducts();
  }

  updateSortDirection(value: string) {
    this.filters.update(f => ({ ...f, SortDirection: value }));
    this.loadProducts();
  }

  applyFilters() {
    this.filters.update(f => ({ ...f, pageNumber: 1 }));
    this.loadProducts();
  }

  resetFilters() {
    this.filters.set({
      CategoryId: null,
      SubCategoryId: null,
      MinPrice: null,
      MaxPrice: null,
      Search: '',
      SortBy: '',
      SortDirection: '',
      pageNumber: 1,
      pageSize: 20
    });
    this.subCategories.set([]);
    this.loadProducts();
  }

  nextPage() {
    this.filters.update(f => ({ ...f, pageNumber: f.pageNumber + 1 }));
    this.loadProducts();
  }

  prevPage() {
    this.filters.update(f => ({ ...f, pageNumber: Math.max(1, f.pageNumber - 1) }));
    this.loadProducts();
  }
}
