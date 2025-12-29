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
  templateUrl: './add-product.page.html',
  styleUrl: './add-product.page.css',
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
  categoryId: null as number | null,
  subCategoryId: null as number | null,
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
    this.filesService.upload(file, 'product').subscribe({
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

     if (!this.form.categoryId || !this.form.subCategoryId) {
    console.error('Category and SubCategory are required');
    return;
  }

    this.loading.set(true);


    const payload = {
  categoryId: this.form.categoryId,
  subCategoryId: this.form.subCategoryId,
  title: this.form.title,
  price: this.form.price,
  images: [
    {
      url: this.form.imageUrl,
      altText: this.form.title,
      isPrimary: true,
      sortOrder: 0
    }
  ]
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
        console.log('Payload was:', payload);
        alert(this.lang() === 'ar' ? 'فشل إضافة المنتج. يرجى المحاولة مرة أخرى.' : 'Failed to add product. Please try again.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/my-shop']);
  }
}

