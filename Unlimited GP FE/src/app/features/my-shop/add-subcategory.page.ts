import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/catalog/catalog.service';
import { Category } from '../../core/models/catalog.models';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  standalone: true,
  template: `
    <div class="container">
      <h2>{{ lang() === 'ar' ? 'إضافة تصنيف فرعي جديد' : 'Add New Subcategory' }}</h2>
      <form (ngSubmit)="submit()">
        <div class="form-group">
          <label>{{ lang() === 'ar' ? 'التصنيف' : 'Category' }}</label>
          <select name="categoryId" [(ngModel)]="form.categoryId" required>
            <option value="">{{ lang() === 'ar' ? 'اختر التصنيف' : 'Select Category' }}</option>
            <option *ngFor="let c of categories()" [value]="c.id">{{ lang() === 'ar' ? (c.nameAr || c.nameEn) : (c.nameEn || c.nameAr) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ lang() === 'ar' ? 'الاسم' : 'Name' }}</label>
          <input name="name" [(ngModel)]="form.name" required />
        </div>
        <div class="actions">
          <button type="button" (click)="cancel()">{{ lang() === 'ar' ? 'إلغاء' : 'Cancel' }}</button>
          <button type="submit">{{ lang() === 'ar' ? 'إنشاء' : 'Create' }}</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    input, select { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    button[type="submit"] { background: #007bff; color: white; }
    button[type="button"] { background: #ccc; }
  `],
  imports: [CommonModule, FormsModule]
})
export class AddSubCategoryPage {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  lang = computed(() => this.i18n.lang());

  protected readonly categories = signal<Category[]>([]);
  protected form = {
    categoryId: '',
    name: ''
  };

  constructor() {
    this.catalogService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  submit() {
    this.catalogService.createSubCategory(this.form).subscribe({
      next: () => this.router.navigate(['/my-shop']),
      error: (err) => console.error(err)
    });
  }

  cancel() {
    this.router.navigate(['/my-shop']);
  }
}
