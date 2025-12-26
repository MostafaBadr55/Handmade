import { Component, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/shop/shop.service';
import { FilesService } from '../../core/files/files.service';
import { CatalogService } from '../../core/catalog/catalog.service';
import { Category, SubCategory } from '../../core/models/catalog.models';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  standalone: true,
  template: `
    <div class="add-product-container">
      <div class="form-card">
        <div class="form-header">
          <button class="back-btn" (click)="cancel()">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2>{{ isEdit() ? (lang() === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang() === 'ar' ? 'إضافة منتج جديد' : 'Add New Product') }}</h2>
        </div>

        <form (ngSubmit)="submit()" #productForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label>{{ lang() === 'ar' ? 'العنوان' : 'Title' }}</label>
              <input name="title" [(ngModel)]="form.title" required #title="ngModel"
                     [placeholder]="lang() === 'ar' ? 'أدخل عنوان المنتج' : 'Enter product title'" />
              <div *ngIf="title.invalid && title.touched" class="error-text">
                {{ lang() === 'ar' ? 'العنوان مطلوب' : 'Title is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ lang() === 'ar' ? 'السعر' : 'Price' }}</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input type="number" name="price" [(ngModel)]="form.price" required min="0.01" #price="ngModel" />
              </div>
              <div *ngIf="price.invalid && price.touched" class="error-text">
                {{ lang() === 'ar' ? 'السعر مطلوب ويجب أن يكون أكبر من 0' : 'Price is required and must be greater than 0' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ lang() === 'ar' ? 'الفئة' : 'Category' }}</label>
              <select name="categoryId" [(ngModel)]="form.categoryId" (change)="onCategoryChange()" required #cat="ngModel">
                <option value="">{{ lang() === 'ar' ? 'اختر الفئة' : 'Select Category' }}</option>
                <option *ngFor="let c of categories()" [value]="c.id">{{ lang() === 'ar' ? (c.nameAr || c.nameEn) : (c.nameEn || c.nameAr) }}</option>
              </select>
              <div *ngIf="cat.invalid && cat.touched" class="error-text">
                {{ lang() === 'ar' ? 'الفئة مطلوبة' : 'Category is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ lang() === 'ar' ? 'الفئة الفرعية' : 'Subcategory' }}</label>
              <select name="subCategoryId" [(ngModel)]="form.subCategoryId" required #subCat="ngModel" [disabled]="!form.categoryId">
                <option value="">{{ lang() === 'ar' ? 'اختر الفئة الفرعية' : 'Select Subcategory' }}</option>
                <option *ngFor="let s of subCategories()" [value]="s.id">{{ lang() === 'ar' ? (s.nameAr || s.nameEn) : (s.nameEn || s.nameAr) }}</option>
              </select>
              <div *ngIf="subCat.invalid && subCat.touched" class="error-text">
                {{ lang() === 'ar' ? 'الفئة الفرعية مطلوبة' : 'Subcategory is required' }}
              </div>
            </div>
          </div>

          <div class="form-group full-width">
            <label>{{ lang() === 'ar' ? 'الصورة' : 'Image' }}</label>
            <div class="image-input-group">
              <input type="file" accept="image/*" (change)="onFileChange($event)" class="form-input" />
              <input name="imageUrl" [(ngModel)]="form.imageUrl" required #img="ngModel" style="display:none" />
              <div class="image-preview" *ngIf="form.imageUrl && form.imageUrl.length > 0">
                <img [src]="form.imageUrl" alt="Preview" (error)="form.imageUrl = ''" />
              </div>
              <div *ngIf="uploadInProgress()" class="image-preview">
                <div class="spinner"></div>
              </div>
            </div>
            <div *ngIf="img.invalid && img.touched" class="error-text">
              {{ lang() === 'ar' ? 'الصورة مطلوبة' : 'Image is required' }}
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="cancel()">
              {{ lang() === 'ar' ? 'إلغاء' : 'Cancel' }}
            </button>
            <button type="submit" class="submit-btn" [disabled]="productForm.invalid || loading()">
              <span *ngIf="!loading()">{{ isEdit() ? (lang() === 'ar' ? 'تحديث' : 'Update') : (lang() === 'ar' ? 'إنشاء' : 'Create') }}</span>
              <span *ngIf="loading()" class="spinner"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-product-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .form-card {
      width: 100%;
      max-width: 800px;
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .form-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
    .form-header h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #2d3436;
    }
    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #636e72;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .back-btn:hover {
      background: #f1f2f6;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .full-width {
      grid-column: span 2;
    }
    label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #2d3436;
    }
    input, select {
      padding: 0.75rem 1rem;
      border: 1.5px solid #dfe6e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #d2b48c;
      box-shadow: 0 0 0 3px rgba(210, 180, 140, 0.1);
    }
    .price-input {
      position: relative;
      display: flex;
      align-items: center;
    }
    .currency {
      position: absolute;
      left: 1rem;
      color: #636e72;
      font-weight: 600;
    }
    .price-input input {
      padding-left: 2rem;
      width: 100%;
    }
    .image-input-group {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    .image-input-group input {
      flex: 1;
    }
    .image-preview {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #eee;
      background: #f8f9fa;
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .error-text {
      color: #d63031;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    .cancel-btn {
      padding: 0.75rem 2rem;
      background: #f1f2f6;
      border: none;
      border-radius: 8px;
      color: #2d3436;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .cancel-btn:hover {
      background: #dfe6e9;
    }
    .submit-btn {
      padding: 0.75rem 3rem;
      background: #d2b48c;
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
      min-width: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .submit-btn:hover:not(:disabled) {
      background: #c4a47c;
      transform: translateY(-1px);
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .image-input-group { flex-direction: column; }
      .image-preview { width: 100%; height: 200px; }
    }
  `],
  imports: [CommonModule, FormsModule]
})
export class AddProductPage {
  private readonly shopService = inject(ShopService);
  private readonly catalogService = inject(CatalogService);
  private readonly filesService = inject(FilesService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly categories = signal<Category[]>([]);
  protected readonly subCategories = signal<SubCategory[]>([]);
  protected readonly isEdit = signal(false);
  protected readonly shopId = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly lang = computed(() => this.i18n.lang());

  protected form = {
    title: '',
    price: 0,
    categoryId: '',
    subCategoryId: '',
    imageUrl: ''
  };

  protected readonly uploadInProgress = signal(false);

  constructor() {
    this.loadCategories();
    const state = this.router.getCurrentNavigation()?.extras.state as { shopId: number };
    if (state?.shopId) {
      this.shopId.set(state.shopId);
    } else {
      this.shopService.getMyShop().subscribe(s => {
        if (s?.shopId) this.shopId.set(s.shopId);
        else this.router.navigate(['/my-shop']);
      });
    }
  }

  private loadCategories() {
    this.catalogService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  onCategoryChange() {
    if (this.form.categoryId) {
      this.catalogService.getSubCategories(this.form.categoryId).subscribe(subs => this.subCategories.set(subs));
    } else {
      this.subCategories.set([]);
    }
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    this.uploadInProgress.set(true);
    this.filesService.upload(file, 'general').subscribe({
      next: (res) => {
        this.form.imageUrl = res.url;
        this.uploadInProgress.set(false);
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadInProgress.set(false);
        alert(this.lang() === 'ar' ? 'فشل رفع الصورة.' : 'Failed to upload image.');
      }
    });
  }

  submit() {
    if (!this.shopId()) {
      console.error('No shopId found');
      return;
    }

    this.loading.set(true);

    // Ensure IDs are numbers if they look like numbers, otherwise keep as is or handle NaN
    const catId = Number(this.form.categoryId);
    const subCatId = Number(this.form.subCategoryId);

    const payload = {
      shopId: Number(this.shopId()),
      categoryId: isNaN(catId) ? this.form.categoryId : catId,
      subCategoryId: isNaN(subCatId) ? this.form.subCategoryId : subCatId,
      title: this.form.title,
      price: this.form.price,
      images: this.form.imageUrl ? [{
        url: this.form.imageUrl,
        altText: this.form.title,
        isPrimary: true,
        sortOrder: 0
      }] : []
    };

    console.log('Submitting product with payload:', payload);

    this.shopService.createProduct(this.shopId()!, payload).subscribe({
      next: (res) => {
        console.log('Product created successfully:', res);
        this.loading.set(false);
        this.router.navigate(['/my-shop']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error creating product:', err);
        alert(this.lang() === 'ar' ? 'فشل إضافة المنتج. يرجى المحاولة مرة أخرى.' : 'Failed to add product. Please try again.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/my-shop']);
  }
}

